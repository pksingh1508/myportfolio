import Link from "next/link";
import Container from "../components/layout/Container";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-page">
      <Container className="flow not-found-shell">
        <p className="meta">404 / off orbit</p>
        <h1>Page not found</h1>
        <p>The page you requested does not exist or the project slug is invalid.</p>
        <p className="btn-row">
          <Link href="/" className="btn btn-primary">Return home</Link>
          <Link href="/#work" className="btn btn-secondary">View selected work</Link>
          <Link href="/#contact">Contact</Link>
        </p>
      </Container>
    </main>
  );
}
