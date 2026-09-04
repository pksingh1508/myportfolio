import Link from "next/link";
import type { ReactNode } from "react";

type SmartLinkProps = {
  readonly href: string;
  readonly external?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
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
}: SmartLinkProps) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
