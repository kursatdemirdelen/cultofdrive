import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import TopBar from "@/app/components/nav/TopBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "Cult of Drive - 90s-2000s BMW Culture",
  description:
    "Experience the golden era of BMW. Pure driving machines, no compromises. Join the community for classic BMW enthusiasts.",
  keywords: [
    "BMW",
    "E36",
    "E46",
    "classic cars",
    "90s BMW",
    "2000s BMW",
    "driving culture",
    "automotive community",
  ],
  authors: [{ name: "Cult of Drive" }],
  creator: "Cult of Drive",
  publisher: "Cult of Drive",
  openGraph: {
    title: "Cult of Drive - 90s-2000s BMW Culture",
    description:
      "Experience the golden era of BMW. Pure driving machines, no compromises.",
    siteName: "Cult of Drive",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/bmw-e36.png",
        width: 1024,
        height: 640,
        alt: "BMW E36 - Cult of Drive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cult of Drive - 90s-2000s BMW Culture",
    description:
      "Experience the golden era of BMW. Pure driving machines, no compromises.",
    images: ["/images/bmw-e36.png"],
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
      <body>
        <TopBar />
        <main className="pt-8 md:pt-12">{children}</main>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
