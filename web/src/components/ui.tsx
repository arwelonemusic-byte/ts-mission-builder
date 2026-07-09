"use client";

import type {
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

/** Universal floating-element shadow from the ops-planner design system. */
export const PANEL_SHADOW = "shadow-[0px_16px_32px_0px_rgba(0,0,0,0.4)]";

const INPUT_CLS =
  "w-full bg-[#14181a] border border-[#2e3439] rounded-[4px] text-[14px] text-white " +
  "placeholder:text-white/30 focus:border-[#f4db50] focus:outline-none";

export function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[12px] text-white">{label}</span>
      {children}
    </label>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return <div className="text-[11px] leading-[16px] text-white/40">{children}</div>;
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return <input {...rest} className={`${INPUT_CLS} h-[44px] px-3 ${className ?? ""}`} />;
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, ...rest } = props;
  return <select {...rest} className={`${INPUT_CLS} h-[44px] px-3 ${className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return <textarea {...rest} className={`${INPUT_CLS} min-h-[80px] p-3 resize-y ${className ?? ""}`} />;
}

export function CheckRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 text-[12px] text-white/80 hover:text-white transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-[14px] shrink-0 accent-[#f4db50]"
      />
      <span className="flex-1 min-w-0">{children}</span>
    </label>
  );
}

/** 28×16 pill toggle (copied from ts-ops-planner). Off = #2e3439 track with a
 * neutral-gray knob; on = translucent brand track with a brand-yellow knob. */
export function Toggle({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`relative h-[16px] w-[28px] shrink-0 rounded-full transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f4db50] focus-visible:ring-offset-2 focus-visible:ring-offset-[#202427] ${
        checked ? "bg-[rgba(244,219,80,0.24)]" : "bg-[#2e3439]"
      }`}
    >
      <span
        aria-hidden
        className={`absolute top-0 left-0 size-[16px] rounded-full transition-[transform,background-color] duration-150 ${
          checked ? "translate-x-[12px] bg-[#f4db50]" : "translate-x-0 bg-[#abaeb0]"
        }`}
      />
    </button>
  );
}

/** Inline style for an <input type="range"> that drives the .ts-slider track's
 * completed-fill gradient (0-100% CSS variable, honoring min/max). */
export function sliderProgressStyle(value: number, min: number, max: number): CSSProperties {
  const range = max - min;
  const pct = range > 0 ? ((value - min) / range) * 100 : 0;
  return { ["--ts-slider-pct" as string]: `${Math.max(0, Math.min(100, pct))}%` };
}

export function Slider({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(+e.target.value)}
      className="ts-slider w-full"
      style={sliderProgressStyle(value, min, max)}
    />
  );
}

export function PrimaryButton({
  onClick,
  disabled,
  children,
  className,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-[40px] px-4 rounded-[8px] text-[12px] leading-[20px] font-medium transition-colors ${
        disabled
          ? "bg-[#2e3439] text-white/30"
          : "bg-[#f4db50] text-[#202427] hover:bg-[#f9e278] shadow-[0px_16px_32px_0px_rgba(191,162,0,0.6)]"
      } ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  onClick,
  active,
  destructive,
  small,
  children,
  className,
}: {
  onClick: () => void;
  active?: boolean;
  destructive?: boolean;
  small?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const activeCls = active
    ? "bg-[#f4db50] text-[#202427]"
    : `bg-[#2e3439] hover:bg-[#3a4249] ${destructive ? "text-[#f26f63]" : "text-white"}`;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${small ? "h-[32px] px-3" : "h-[40px] px-4"} rounded-[8px] text-[12px] leading-[20px] font-medium transition-colors ${activeCls} ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

/** Small ✕ remove button used in list rows and cards. */
export function XButton({ onClick, ariaLabel }: { onClick: (e: React.MouseEvent) => void; ariaLabel: string }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="size-[24px] shrink-0 flex items-center justify-center rounded-[4px] text-white/40 hover:text-[#f26f63] hover:bg-[#2e3439] transition-colors text-[12px]"
    >
      ✕
    </button>
  );
}

/** Muted mini-header for a subsection inside a panel. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="text-[14px] text-white/60">{children}</div>;
}

/** Horizontal divider between panel subsections. */
export function Divider() {
  return <div className="border-t border-[#2e3439]" />;
}
