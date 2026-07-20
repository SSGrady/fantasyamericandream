import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fantasy American Dream - Class of 2026',
  description: 'Build a career. Survive the economy. Buy back your time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
