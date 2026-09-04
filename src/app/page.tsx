import { portfolioData } from "../constant/data";

export default function Home() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header>
        <p>{portfolioData.profile.fullName}</p>
        <nav aria-label="Primary">
          <ul>
            {portfolioData.site.navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="main-content">
        <h1>{portfolioData.profile.fullName}</h1>
        <p>{portfolioData.profile.headline}</p>
        <p>{portfolioData.profile.shortBio}</p>
      </main>
      <footer>
        <p>{portfolioData.contact.heading}</p>
      </footer>
    </>
  );
}
