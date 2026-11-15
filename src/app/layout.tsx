import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";

// Two faces, shared with Loan Desk and Decode so the Cense tools read as one family. Bricolage carries headlines;
// Instrument Sans carries everything that is read or compared, and has true tabular figures.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});
const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE = "https://invest-ready.vercel.app";
const DESCRIPTION =
  "Five questions to find out if investing is your right next dollar. If not, what comes first. If so, which account to open and how. Free, and nothing leaves your browser.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Invest Ready by Cense: am I ready to start investing?",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Invest Ready by Cense",
    description: "Five questions: are you ready to start investing, and if not, what comes first?",
    url: SITE,
    siteName: "Cense",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invest Ready by Cense",
    description: "Five questions: are you ready to start investing, and if not, what comes first?",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFCEC",
  width: "device-width",
  initialScale: 1,
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Invest Ready by Cense",
  url: SITE,
  description: DESCRIPTION,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  audience: { "@type": "Audience", audienceType: "College students" },
  publisher: { "@type": "Organization", name: "Cense", url: "https://cense.beehiiv.com" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} font-sans`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        <noscript>
          <div style={{ padding: "1rem", textAlign: "center" }}>
            Invest Ready needs JavaScript to answer. Please turn it on in your browser settings.
          </div>
        </noscript>
        {children}
      </body>
    </html>
  );
}
