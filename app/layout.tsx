import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cult of Drive — 90s–2000s BMW Culture',
  description: 'Experience the golden era of BMW. Pure driving machines, no compromises. Join the community for classic BMW enthusiasts.',
  keywords: ['BMW', 'E36', 'E46', 'classic cars', '90s BMW', '2000s BMW', 'driving culture', 'automotive community'],
  authors: [{ name: 'Cult of Drive' }],
  creator: 'Cult of Drive',
  publisher: 'Cult of Drive',
  openGraph: {
    title: 'Cult of Drive — 90s–2000s BMW Culture',
    description: 'Experience the golden era of BMW. Pure driving machines, no compromises.',
    siteName: 'Cult of Drive',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/bmw-e36.jpg',
        width: 1200,
        height: 600,
        alt: 'BMW E36 - Cult of Drive',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cult of Drive — 90s–2000s BMW Culture',
    description: 'Experience the golden era of BMW. Pure driving machines, no compromises.',
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
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
