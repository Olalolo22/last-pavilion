import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "The Last Pavilion — Crypto's World Fair",
  description:
    'Eight nations enter. One survives. A live multiplayer survival attraction built on Solana and MagicBlock.',
  keywords: [
    'solana',
    'magicblock',
    'ephemeral rollups',
    'blitz 9',
    'world fair',
    'crypto game',
    'survival',
  ],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#11110f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-w-[320px]">{children}</body>
    </html>
  );
}
