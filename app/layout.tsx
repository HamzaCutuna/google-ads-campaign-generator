import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://adskit.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AdsKit.io - Free Google Ads Campaign Generator",
    template: "%s | AdsKit.io",
  },
  description: "Generate complete, import-ready Google Ads Search campaigns instantly. Free AI-powered tool with buyer-intent keywords, RSA ad copy, and negative keyword lists. No signup required.",
  keywords: [
    "google ads generator",
    "google ads campaign",
    "google ads tool",
    "free google ads",
    "ppc campaign generator",
    "search ads generator",
    "keyword research tool",
    "rsa ad copy generator",
    "google ads editor csv",
    "campaign builder free",
  ],
  authors: [{ name: "AdsKit.io" }],
  creator: "AdsKit.io",
  publisher: "AdsKit.io",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "AdsKit.io - Free Google Ads Campaign Generator",
    description: "Generate complete, import-ready Google Ads Search campaigns instantly. Free AI-powered tool with buyer-intent keywords, RSA ad copy, and negative keyword lists. No signup required.",
    siteName: "AdsKit.io",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AdsKit.io - Free Google Ads Campaign Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AdsKit.io - Free Google Ads Campaign Generator",
    description: "Generate complete, import-ready Google Ads Search campaigns instantly. Free AI-powered tool. No signup required.",
    images: ["/images/og-image.jpg"],
    creator: "@adskit",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
