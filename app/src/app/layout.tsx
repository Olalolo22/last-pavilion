import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "The Last Pavilion — Crypto's World Fair (Blitz 9)",
  description:
    'A real-time survival coordination game on Solana & MagicBlock Ephemeral Rollups. Eight crypto ideals entered. Meters drain continuously. Intervene before extinction.',
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
  themeColor: '#05070c',
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
