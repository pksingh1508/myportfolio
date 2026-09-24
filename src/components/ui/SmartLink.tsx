import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon, type ArrowDirection } from "./Icons";

type SmartLinkProps = {
  readonly href: string;
  readonly external?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
  readonly ariaLabel?: string;
  /** `true` draws the default up-right arrow; a direction picks another. */
  readonly arrow?: boolean | ArrowDirection;
};

/** Two stacked arrows that trade places on hover (CSS owns the motion). */
export function LinkArrow({ direction = "up-right" }: { readonly direction?: ArrowDirection }) {
  return (
    <span className="link-arrow" data-arrow={direction} aria-hidden="true">
      <ArrowIcon direction={direction} />
      <ArrowIcon direction={direction} />
    </span>
  );
}

/**
 * Internal links use next/link for prefetching; external links open safely
 * in a new tab. Server Component with no client JavaScript.
 */
export default function SmartLink({
  href,
  external = false,
  className,
  children,
  ariaLabel,
  arrow = false,
}: SmartLinkProps) {
  const direction = arrow === true ? "up-right" : arrow || null;
  const content = direction ? (
    <>
      <span>{children}</span>
      <LinkArrow direction={direction} />
    </>
  ) : (
    children
  );
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}
