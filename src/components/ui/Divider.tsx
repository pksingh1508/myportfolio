type DividerProps = {
  readonly className?: string;
};

/** Quiet hairline divider between information groups. Server Component. */
export default function Divider({ className = "" }: DividerProps) {
  const classes = className ? `rule ${className}` : "rule";
  return <hr className={classes} />;
}
