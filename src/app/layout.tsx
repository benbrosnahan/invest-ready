import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Invest Ready by Cense — Am I ready to start investing?",
  description:
    "Answer 5 quick questions and find out if you're ready to invest, how much to put in, and exactly where to start.",
  openGraph: {
    title: "Invest Ready by Cense",
    description: "Find out if you're ready to invest in under 3 minutes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invest Ready by Cense",
    description: "Find out if you're ready to invest in under 3 minutes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <noscript>
          <div style={{ padding: "2rem", textAlign: "center" }}>
            This tool requires JavaScript to run. Please enable JavaScript in
            your browser settings.
          </div>
        </noscript>
        {children}
      </body>
    </html>
  );
}
