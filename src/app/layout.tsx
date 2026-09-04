import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { site } from "../constant/data";
import SiteFooter from "../components/layout/SiteFooter";
import SiteHeader from "../components/layout/SiteHeader";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        {/*
         * Progressive-enhancement flag, set before first paint so the fixed
         * header and disclosure menu never flash through their no-JS static
         * states when JavaScript is available. Without JavaScript this never
         * runs and the static fallbacks in globals.css apply instead.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body id="top" className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
