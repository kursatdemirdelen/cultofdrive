import './globals.css';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Cult of Drive - Authentic BMW Culture | Coming Soon',
  description:
    "Join the waitlist for Cult of Drive - the ultimate destination for 90s–2000s BMW enthusiasts. Authentic, OEM, Driver's Cars Only. Coming Soon.",
  keywords: [
    'BMW',
    'E36',
    'M3',
    'BMW culture',
    'vintage BMW',
    'BMW community',
    'coming soon',
  ],
  authors: [{ name: 'Cult of Drive' }],
  creator: 'Cult of Drive',
  publisher: 'Cult of Drive',
  openGraph: {
    title: 'Cult of Drive - Authentic BMW Culture',
    description:
      'Join the waitlist for the ultimate BMW enthusiast community. 90s–2000s BMW culture at its finest.',
    url: 'https://cultofdrive.com',
    siteName: 'Cult of Drive',
    images: [
      {
        url: '/bmw-e36.jpg',
        width: 800,
        height: 600,
        alt: 'BMW E36 M3 - Cult of Drive',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cult of Drive - Authentic BMW Culture',
    description: 'Join the waitlist for the ultimate BMW enthusiast community.',
    images: ['/bmw-e36.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-white bg-black">{children}</body>
    </html>
  );
}
