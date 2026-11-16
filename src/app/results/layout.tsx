import type { Metadata } from "next";

// A result is worked out in the browser from the answers in the link's fragment (after the #), which never reaches
// the server. So this page's HTML, and any link preview built from it, is the same for every result: it names the
// tool, never the verdict or the answers. Kept out of search, since there is nothing in it to index.
const TITLE = "An answer from Invest Ready by Cense";
// Setting openGraph here replaces the root's, so the share card drawn by app/opengraph-image.tsx is named again.
const IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Invest Ready by Cense: five questions on whether you are ready to start investing",
};
const DESCRIPTION = "One answer to: am I ready to start investing? Open it to see the steps, then take the five questions yourself.";

export const metadata: Metadata = {
  title: "Your answer | Invest Ready by Cense",
  description: DESCRIPTION,
  robots: { index: false, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/results",
    siteName: "Cense",
    type: "website",
    locale: "en_US",
    images: [IMAGE],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [IMAGE.url] },
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
