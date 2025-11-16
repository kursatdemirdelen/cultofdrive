import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import TopBar from "@/app/components/nav/TopBar";
import { ToastContainer } from "@/app/components/ui/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Cult of Drive - 90s-2000s BMW Culture",
    template: "%s | Cult of Drive",
  },
  description:
    "A curated digital garage for 90s-2000s BMW enthusiasts. Share builds, connect with drivers, and preserve automotive stories. Join the community celebrating E36, E46, and classic BMW culture.",
  keywords: [
    "BMW",
    "E36",
    "E46",
    "E39",
    "E30",
    "classic cars",
    "90s BMW",
    "2000s BMW",
    "BMW builds",
    "BMW community",
    "driving culture",
    "automotive community",
    "car enthusiasts",
    "BMW garage",
    "BMW marketplace",
  ],
  authors: [{ name: "Cult of Drive" }],
  creator: "Cult of Drive",
  publisher: "Cult of Drive",
  openGraph: {
    title: "Cult of Drive - 90s-2000s BMW Culture",
    description:
      "A curated digital garage for 90s-2000s BMW enthusiasts. Share builds, connect with drivers, and preserve automotive stories.",
    siteName: "Cult of Drive",
    locale: "en_US",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://cultofdrive.com",
    images: [
      {
        url: "/images/bmw-e36.png",
        width: 1200,
        height: 630,
        alt: "Cult of Drive - BMW Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cult of Drive - 90s-2000s BMW Culture",
    description:
      "A curated digital garage for 90s-2000s BMW enthusiasts. Share builds, connect with drivers, and preserve automotive stories.",
    images: ["/images/bmw-e36.png"],
    creator: "@cultofdrive",
  },
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
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <TopBar />
        <main className="pt-8 md:pt-12">{children}</main>
        <ToastContainer />

      </body>
    </html>
  );
}
