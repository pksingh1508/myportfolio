import type { ReactNode } from "react";

type ContainerProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

/** Centered Tailwind max-w-7xl content shell: min(100% - gutter, 80rem). */
export default function Container({ children, className = "" }: ContainerProps) {
  const classes = className ? `shell ${className}` : "shell";
  return <div className={classes}>{children}</div>;
}
