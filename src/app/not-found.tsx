import type { CSSProperties } from "react";
import Link from "next/link";
import Container from "../components/layout/Container";
import PageTransition from "../components/motion/PageTransition";
import SmartLink from "../components/ui/SmartLink";

/** Stagger slot for the CSS page-load entrance (see `.intro` in globals.css). */
const step = (index: number) => ({ "--i": index }) as CSSProperties;

export default function NotFound() {
  return (
    <PageTransition>
      <main id="main-content" className="not-found-page">
        <Container className="not-found-shell">
          <p className="eyebrow intro" style={step(0)}>
            404 / off orbit
          </p>
          <h1 className="intro" style={step(1)}>
            Page not found
          </h1>
          <p className="intro" style={step(2)}>
            The page you requested does not exist or the project slug is invalid.
          </p>
          <p className="btn-row intro" style={step(3)}>
            <SmartLink href="/" className="btn btn-primary" arrow="left">
              Return home
            </SmartLink>
            <SmartLink href="/#work" className="btn btn-secondary">
              View selected work
            </SmartLink>
            <Link href="/#contact" className="text-link">
              Contact
            </Link>
          </p>
        </Container>
      </main>
    </PageTransition>
  );
}
