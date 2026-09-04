import ContactFinale from "../components/sections/ContactFinale";
import CredibilityStrip from "../components/sections/CredibilityStrip";
import Education from "../components/sections/Education";
import Experience from "../components/sections/Experience";
import Hero from "../components/sections/Hero";
import SelectedWork from "../components/sections/SelectedWork";
import Skills from "../components/sections/Skills";
import { profile, site } from "../constant/data";

/**
 * Person structured data from verified facts only: name, primary role,
 * bio, email, and the two public profiles. Location is omitted (unknown)
 * and url appears once the production domain is set.
 */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.fullName,
  jobTitle: profile.roles[0],
  description: profile.shortBio,
  email: `mailto:${profile.email}`,
  ...(site.url ? { url: site.url } : {}),
  sameAs: profile.links
    .filter((link) => link.kind === "social")
    .map((link) => link.href),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <main id="main-content">
      <Hero />
      <CredibilityStrip />
      <SelectedWork />
      <Skills />
      <Experience />
      <Education />
      <ContactFinale />
      </main>
    </>
  );
}
