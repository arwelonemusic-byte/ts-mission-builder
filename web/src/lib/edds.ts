/**
 * Enfusion `.edds` writer — lets the builder ship a ready-to-use texture
 * resource without Workbench ever importing anything.
 *
 * Format (ground-truthed 2026-07-31 against 4377 vanilla + 67 community
 * `.edds`, and validated in Workbench with a file written by this code):
 *
 *   0x00..0x7B  standard 124-byte DDS header, with the ASCII marker "ENF1"
 *               at 0x24 (reserved1[1]) — present in EVERY Enfusion .edds
 *   0x7C..0x93  standard DX10 header (dxgiFormat, resourceDimension, ...)
 *   0x94..      Enfusion mip table: one 8-byte entry per mip —
 *               4-byte compression tag ("COPY" = raw, "LZ4 " = lz4 block)
 *               + 4-byte STORED size, ordered SMALLEST MIP FIRST
 *   then        mip payloads concatenated in table order
 *
 * We write BC7 (dxgi 99, BC7_UNORM_SRGB — the single most common format in
 * vanilla) with every mip stored "COPY", so no lz4 implementation is needed.
 * BC7 is 8bpp: a mipped 1920x1200 lands at ~2.9 MB instead of the ~11.7 MB an
 * uncompressed B8G8R8A8 chain would cost, at near-lossless quality.
 *
 * The GUID is NOT stored in the binary — the sidecar `.edds.meta` is the sole
 * source, exactly like our `.conf`/`.ent` files.
 */

/** BC7_UNORM_SRGB. Our source pixels are sRGB, so the format must say so. */
const DXGI_BC7_UNORM_SRGB = 99;

export type Mip = { w: number; h: number; data: Uint8ClampedArray };

/**
 * Box-filtered mip chain down to 1x1, using FLOOR halving — this is what
 * Workbench produces (1920x1200 -> 11 levels, matching level-for-level).
 */
export function buildMips(width: number, height: number, rgba: Uint8ClampedArray): Mip[] {
  const mips: Mip[] = [{ w: width, h: height, data: rgba }];
  let cw = width;
  let ch = height;
  let cur = rgba;
  while (cw > 1 || ch > 1) {
    const nw = Math.max(1, cw >> 1);
    const nh = Math.max(1, ch >> 1);
    const next = new Uint8ClampedArray(nw * nh * 4);
    for (let y = 0; y < nh; y++) {
      for (let x = 0; x < nw; x++) {
        // Clamp the second sample so odd dimensions don't read past the row
        const x0 = Math.min(cw - 1, x * 2);
        const x1 = Math.min(cw - 1, x * 2 + 1);
        const y0 = Math.min(ch - 1, y * 2);
        const y1 = Math.min(ch - 1, y * 2 + 1);
        for (let c = 0; c < 4; c++) {
          const s =
            cur[(y0 * cw + x0) * 4 + c] +
            cur[(y0 * cw + x1) * 4 + c] +
            cur[(y1 * cw + x0) * 4 + c] +
            cur[(y1 * cw + x1) * 4 + c];
          next[(y * nw + x) * 4 + c] = (s + 2) >> 2;
        }
      }
    }
    mips.push({ w: nw, h: nh, data: next });
    cw = nw;
    ch = nh;
    cur = next;
  }
  return mips;
}

/* ------------------------------- BC7 -------------------------------------
 * We emit mode 6 only: one subset, RGBA endpoints at 7 bits/channel plus a
 * per-endpoint p-bit, and 4-bit (16-level) indices. Mode 6 is the general
 * -purpose opaque/alpha mode and is what a photographic thumbnail wants; the
 * partitioned modes buy little on smooth image content and cost far more to
 * search. Block layout, LSB-first across the 16 bytes:
 *   [0..6]    mode  (six 0 bits then a 1)
 *   [7..62]   R0 R1 G0 G1 B0 B1 A0 A1, 7 bits each
 *   [63..64]  p-bit 0, p-bit 1
 *   [65..127] indices: 3 bits for texel 0 (anchor), then 4 bits x 15
 * The anchor's high bit is implicit-0, so index[0] must be <= 7 — if it isn't
 * we swap the endpoints and invert every index, which is a no-op visually.
 */

/** BC7 4-bit index interpolation weights (out of 64). */
const BC7_W = [0, 4, 9, 13, 17, 21, 26, 30, 34, 38, 43, 47, 51, 55, 60, 64];

/** Quantize an 8-bit endpoint to 7 bits + a shared p-bit; returns squared error. */
function fitEndpoint(v: Float64Array, p: number, q: Int32Array): number {
  let err = 0;
  for (let c = 0; c < 4; c++) {
    let qi = Math.round((v[c] - p) / 2);
    if (qi < 0) qi = 0;
    else if (qi > 127) qi = 127;
    q[c] = qi;
    const d = ((qi << 1) | p) - v[c];
    err += d * d;
  }
  return err;
}

// Scratch buffers — one block at a time, reused across the whole image so the
// encoder doesn't allocate 190k+ temporaries per export.
const blk = new Uint8Array(64);
const mean = new Float64Array(4);
const dir = new Float64Array(4);
const eA = new Float64Array(4);
const eB = new Float64Array(4);
const qA = new Int32Array(4);
const qB = new Int32Array(4);
const rA = new Int32Array(4);
const rB = new Int32Array(4);
const qTrial = new Int32Array(4);
const lsX = new Float64Array(4);
const lsY = new Float64Array(4);
const idx = new Uint8Array(16);

/** Reconstruct the 8-bit endpoint values a 7-bit value + p-bit decode to. */
function expand(q: Int32Array, p: number, out: Int32Array) {
  for (let c = 0; c < 4; c++) out[c] = (q[c] << 1) | p;
}

/** Assign each texel the nearest index along the endpoint line. */
function assignIndices(): void {
  let dd = 0;
  for (let c = 0; c < 4; c++) {
    const d = rB[c] - rA[c];
    dd += d * d;
  }
  if (dd === 0) {
    idx.fill(0);
    return;
  }
  for (let i = 0; i < 16; i++) {
    let dot = 0;
    for (let c = 0; c < 4; c++) dot += (blk[i * 4 + c] - rA[c]) * (rB[c] - rA[c]);
    let t = Math.round((dot / dd) * 15);
    if (t < 0) t = 0;
    else if (t > 15) t = 15;
    idx[i] = t;
  }
}

/** Encode the 4x4 block currently in `blk` into 16 bytes at out[off]. */
function encodeBlock(out: Uint8Array, off: number) {
  // --- principal axis through the block's RGBA cloud ---
  mean.fill(0);
  for (let i = 0; i < 16; i++) for (let c = 0; c < 4; c++) mean[c] += blk[i * 4 + c];
  for (let c = 0; c < 4; c++) mean[c] /= 16;

  // Seed the power iteration with the furthest texel from the mean
  let bestN = -1;
  let bi = 0;
  for (let i = 0; i < 16; i++) {
    let n = 0;
    for (let c = 0; c < 4; c++) {
      const d = blk[i * 4 + c] - mean[c];
      n += d * d;
    }
    if (n > bestN) {
      bestN = n;
      bi = i;
    }
  }
  for (let c = 0; c < 4; c++) dir[c] = blk[bi * 4 + c] - mean[c];

  if (bestN > 0) {
    for (let it = 0; it < 6; it++) {
      let n0 = 0, n1 = 0, n2 = 0, n3 = 0;
      for (let i = 0; i < 16; i++) {
        const a = blk[i * 4] - mean[0];
        const b = blk[i * 4 + 1] - mean[1];
        const c2 = blk[i * 4 + 2] - mean[2];
        const e = blk[i * 4 + 3] - mean[3];
        const dot = a * dir[0] + b * dir[1] + c2 * dir[2] + e * dir[3];
        n0 += dot * a; n1 += dot * b; n2 += dot * c2; n3 += dot * e;
      }
      const len = Math.sqrt(n0 * n0 + n1 * n1 + n2 * n2 + n3 * n3);
      if (len < 1e-9) break;
      dir[0] = n0 / len; dir[1] = n1 / len; dir[2] = n2 / len; dir[3] = n3 / len;
    }
  }

  // --- endpoints = extremes of the projection onto that axis ---
  let tmin = Infinity;
  let tmax = -Infinity;
  for (let i = 0; i < 16; i++) {
    let t = 0;
    for (let c = 0; c < 4; c++) t += (blk[i * 4 + c] - mean[c]) * dir[c];
    if (t < tmin) tmin = t;
    if (t > tmax) tmax = t;
  }
  if (!Number.isFinite(tmin) || !Number.isFinite(tmax)) {
    tmin = 0;
    tmax = 0;
  }
  for (let c = 0; c < 4; c++) {
    eA[c] = Math.min(255, Math.max(0, mean[c] + dir[c] * tmin));
    eB[c] = Math.min(255, Math.max(0, mean[c] + dir[c] * tmax));
  }

  const quantize = () => {
    // p-bit is shared by all 4 channels of an endpoint — pick the better one
    const pA = fitEndpoint(eA, 0, qTrial) <= fitEndpoint(eA, 1, qTrial) ? 0 : 1;
    fitEndpoint(eA, pA, qA);
    const pB = fitEndpoint(eB, 0, qTrial) <= fitEndpoint(eB, 1, qTrial) ? 0 : 1;
    fitEndpoint(eB, pB, qB);
    expand(qA, pA, rA);
    expand(qB, pB, rB);
    return [pA, pB];
  };

  let [pA, pB] = quantize();
  assignIndices();

  // --- one least-squares refit of the endpoints against the chosen indices ---
  let A = 0, B = 0, C = 0;
  const X = lsX;
  const Y = lsY;
  X.fill(0);
  Y.fill(0);
  for (let i = 0; i < 16; i++) {
    const w = BC7_W[idx[i]] / 64;
    const u = 1 - w;
    A += u * u;
    B += u * w;
    C += w * w;
    for (let c = 0; c < 4; c++) {
      X[c] += u * blk[i * 4 + c];
      Y[c] += w * blk[i * 4 + c];
    }
  }
  const det = A * C - B * B;
  if (Math.abs(det) > 1e-6) {
    for (let c = 0; c < 4; c++) {
      eA[c] = Math.min(255, Math.max(0, (C * X[c] - B * Y[c]) / det));
      eB[c] = Math.min(255, Math.max(0, (A * Y[c] - B * X[c]) / det));
    }
    [pA, pB] = quantize();
    assignIndices();
  }

  // --- anchor rule: index[0] is stored in 3 bits, so it must be <= 7 ---
  if (idx[0] > 7) {
    for (let c = 0; c < 4; c++) {
      const t = qA[c];
      qA[c] = qB[c];
      qB[c] = t;
    }
    const tp = pA;
    pA = pB;
    pB = tp;
    for (let i = 0; i < 16; i++) idx[i] = 15 - idx[i];
  }

  // --- pack ---
  for (let i = 0; i < 16; i++) out[off + i] = 0;
  let bit = 0;
  const put = (v: number, n: number) => {
    for (let i = 0; i < n; i++) {
      if ((v >>> i) & 1) out[off + (bit >> 3)] |= 1 << (bit & 7);
      bit++;
    }
  };
  put(1 << 6, 7); // mode 6
  for (let c = 0; c < 4; c++) {
    put(qA[c], 7);
    put(qB[c], 7);
  }
  put(pA, 1);
  put(pB, 1);
  put(idx[0], 3); // anchor: high bit implicit 0
  for (let i = 1; i < 16; i++) put(idx[i], 4);
}

/** Compress one mip level to BC7. Edge blocks clamp-repeat the last row/column. */
function compressBC7(m: Mip): Uint8Array {
  const bw = Math.ceil(m.w / 4);
  const bh = Math.ceil(m.h / 4);
  const out = new Uint8Array(bw * bh * 16);
  let off = 0;
  for (let by = 0; by < bh; by++) {
    for (let bx = 0; bx < bw; bx++) {
      for (let y = 0; y < 4; y++) {
        const sy = Math.min(m.h - 1, by * 4 + y);
        for (let x = 0; x < 4; x++) {
          const sx = Math.min(m.w - 1, bx * 4 + x);
          const si = (sy * m.w + sx) * 4;
          const di = (y * 4 + x) * 4;
          blk[di] = m.data[si];
          blk[di + 1] = m.data[si + 1];
          blk[di + 2] = m.data[si + 2];
          blk[di + 3] = m.data[si + 3];
        }
      }
      encodeBlock(out, off);
      off += 16;
    }
  }
  return out;
}

/**
 * Encode canvas RGBA pixels as a mipped, BC7-compressed Enfusion `.edds`.
 * Synchronous and CPU-bound (~1-3 s for 1920x1200 across all mips).
 */
export function encodeEdds(
  width: number,
  height: number,
  rgba: Uint8ClampedArray
): Uint8Array<ArrayBuffer> {
  // Smallest mip first — the engine streams them in that order
  const chunks = buildMips(width, height, rgba).reverse().map(compressBC7);
  const topBytes = Math.ceil(width / 4) * Math.ceil(height / 4) * 16;

  const headBytes = 128 + 20 + chunks.length * 8;
  const head = new Uint8Array(headBytes);
  const dv = new DataView(head.buffer);
  const ascii = (s: string, at: number) => {
    for (let i = 0; i < s.length; i++) head[at + i] = s.charCodeAt(i);
  };

  ascii("DDS ", 0);
  dv.setUint32(0x04, 124, true); // header size
  // CAPS|HEIGHT|WIDTH|PIXELFORMAT|MIPMAPCOUNT|LINEARSIZE (block-compressed:
  // LINEARSIZE, not PITCH — matches Workbench's own BC7 output)
  dv.setUint32(0x08, 0x000a1007, true);
  dv.setUint32(0x0c, height, true);
  dv.setUint32(0x10, width, true);
  dv.setUint32(0x14, topBytes, true); // top-mip compressed size
  dv.setUint32(0x18, 0, true); // depth
  dv.setUint32(0x1c, chunks.length, true); // mip count
  ascii("ENF1", 0x24); // required Enfusion marker
  dv.setUint32(0x4c, 32, true); // pixelformat size
  dv.setUint32(0x50, 4, true); // DDPF_FOURCC
  ascii("DX10", 0x54);
  // COMPLEX|TEXTURE|MIPMAP when mipped, else TEXTURE
  dv.setUint32(0x6c, chunks.length > 1 ? 0x401008 : 0x1000, true);

  // DX10 header
  dv.setUint32(0x80, DXGI_BC7_UNORM_SRGB, true);
  dv.setUint32(0x84, 3, true); // D3D10_RESOURCE_DIMENSION_TEXTURE2D
  dv.setUint32(0x88, 0, true); // miscFlag
  dv.setUint32(0x8c, 1, true); // arraySize
  dv.setUint32(0x90, 0, true); // miscFlags2

  // Mip table
  let total = headBytes;
  chunks.forEach((c, i) => {
    ascii("COPY", 0x94 + i * 8);
    dv.setUint32(0x94 + i * 8 + 4, c.length, true);
    total += c.length;
  });

  const out = new Uint8Array(total);
  out.set(head, 0);
  let at = headBytes;
  for (const c of chunks) {
    out.set(c, at);
    at += c.length;
  }
  return out;
}
