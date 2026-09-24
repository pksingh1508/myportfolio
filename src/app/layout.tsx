import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "../constant/data";
import SiteFooter from "../components/layout/SiteFooter";
import SiteHeader from "../components/layout/SiteHeader";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// Mono only sets small numeric indices, mostly below the fold: load it on
// demand instead of competing with the primary face on every page.
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  // Absolute-URL fields activate with site.url; text-only social cards
  // (no OG images per the Step 14 scope decision) work without a domain.
  metadataBase: site.url ? new URL(site.url) : undefined,
  alternates: site.url ? { canonical: "/" } : undefined,
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    locale: "en_US",
    ...(site.url ? { url: "/" } : {}),
  },
  twitter: {
    card: "summary",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

/*
 * Progressive-enhancement flags, set before first paint so the fixed header
 * and disclosure menu never flash through their no-JS static states when
 * JavaScript is available. Without JavaScript this never runs and the static
 * fallbacks in globals.css apply instead. If the app has not hydrated four
 * seconds later (for example a failed bundle), `data-hydrated="fallback"`
 * releases every pre-reveal pose so content can never stay hidden.
 */
const enhancementScript = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.hasAttribute('data-hydrated'))d.setAttribute('data-hydrated','fallback')},4000)})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: enhancementScript }} />
      </head>
      <body id="top" className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
