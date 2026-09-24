import type { ReactNode, SVGProps } from "react";

/**
 * Small stroked icons drawn on a 16px grid. Decorative by default: every
 * icon ships aria-hidden and relies on the surrounding text for its name.
 */
type IconProps = Omit<SVGProps<SVGSVGElement>, "children">;

function Icon({
  className = "icon",
  children,
  ...props
}: IconProps & { readonly children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

export type ArrowDirection = "up-right" | "down" | "up" | "right" | "left";

const ARROW_PATHS: Record<ArrowDirection, string> = {
  "up-right": "M4.5 11.5l7-7M5.5 4.5h6v6",
  down: "M8 3v10M3.5 8.5L8 13l4.5-4.5",
  up: "M8 13V3M3.5 7.5L8 3l4.5 4.5",
  right: "M3 8h10M8.5 3.5L13 8l-4.5 4.5",
  left: "M13 8H3M7.5 3.5L3 8l4.5 4.5",
};

export function ArrowIcon({
  direction = "up-right",
  ...props
}: IconProps & { readonly direction?: ArrowDirection }) {
  return (
    <Icon {...props}>
      <path d={ARROW_PATHS[direction]} />
    </Icon>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="5.5" y="5.5" width="8" height="8" rx="2" />
      <path d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 8.5l3 3 6-7" />
    </Icon>
  );
}
