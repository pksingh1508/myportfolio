import ContactFinale from "../components/sections/ContactFinale";
import CredibilityStrip from "../components/sections/CredibilityStrip";
import Education from "../components/sections/Education";
import Experience from "../components/sections/Experience";
import Hero from "../components/sections/Hero";
import SelectedWork from "../components/sections/SelectedWork";
import Skills from "../components/sections/Skills";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <CredibilityStrip />
      <SelectedWork />
      <Skills />
      <Experience />
      <Education />
      <ContactFinale />
    </main>
  );
}
