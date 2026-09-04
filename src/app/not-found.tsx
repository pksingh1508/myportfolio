import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The page you requested does not exist or the project slug is invalid.</p>
      <ul>
        <li>
          <Link href="/">Return home</Link>
        </li>
        <li>
          <Link href="/#work">View selected work</Link>
        </li>
        <li>
          <Link href="/#contact">Contact</Link>
        </li>
      </ul>
    </main>
  );
}
