import Link from "next/link";
import type { ReactNode } from "react";

type SmartLinkProps = {
  readonly href: string;
  readonly external?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
  readonly ariaLabel?: string;
  readonly arrow?: boolean;
};

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
  const content = arrow ? <><span>{children}</span><span className="link-arrow" aria-hidden="true"><span>↗</span><span>↗</span></span></> : children;
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
