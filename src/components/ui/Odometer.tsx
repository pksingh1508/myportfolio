import type { CSSProperties } from "react";

type OdometerProps = {
  /** The figure exactly as approved, for example "1,000+" or "95+". */
  readonly value: string;
  readonly className?: string;
};

const isDigit = (char: string) => char >= "0" && char <= "9";

/**
 * Rolling-digit figure. Every digit column is a CSS-generated 0–9 drum
 * (see "Odometer" in globals.css) that already rests on its final digit,
 * so the number reads correctly without JavaScript, motion, or hydration.
 * The roll plays only when an ancestor reveal flips `data-revealed` or
 * `data-revealing`. The face is drawn entirely with generated content, so
 * assistive technology, copy/paste, and crawlers read only the plain
 * value. Server Component.
 */
export default function Odometer({ value, className }: OdometerProps) {
  const chars = Array.from(value);
  let column = 0;
  return (
    <span className={className ? `odometer ${className}` : "odometer"}>
      <span className="visually-hidden">{value}</span>
      <span className="odo-face" aria-hidden="true">
        {chars.map((char, index) =>
          isDigit(char) ? (
            <span
              key={index}
              className="odo-cell"
              style={{ "--d": char, "--c": column++ } as CSSProperties}
            />
          ) : (
            <span key={index} className="odo-char" data-char={char} />
          ),
        )}
      </span>
    </span>
  );
}
