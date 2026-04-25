import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { companyName, companyTagline, defaultSiteUrl } from "@/lib/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(defaultSiteUrl),
  title: {
    default: `${companyName} | Job Consulting & Placement`,
    template: `%s | ${companyName}`,
  },
  description: companyTagline,
  keywords: [
    "recruitment agency",
    "placement portal",
    "job consultancy",
    "hiring solutions",
    "Draft Consulting",
  ],
  openGraph: {
    title: `${companyName} | Job Consulting & Placement`,
    description: companyTagline,
    url: defaultSiteUrl,
    siteName: companyName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${companyName} | Job Consulting & Placement`,
    description: companyTagline,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-title" content="Draft" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/icon0.svg" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
