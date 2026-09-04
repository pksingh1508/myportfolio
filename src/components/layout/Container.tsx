import type { ReactNode } from "react";

type ContainerProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

/** Centered content shell: min(100% - gutter, 90rem). Server Component. */
export default function Container({ children, className = "" }: ContainerProps) {
  const classes = className ? `shell ${className}` : "shell";
  return <div className={classes}>{children}</div>;
}
