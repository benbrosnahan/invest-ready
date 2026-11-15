import type { Metadata } from "next";

// A result exists only for the tab that answered the quiz, so the page is empty to a crawler. Keep it out of search.
export const metadata: Metadata = {
  title: "Your answer | Invest Ready by Cense",
  robots: { index: false, follow: true },
  alternates: { canonical: "/" },
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
