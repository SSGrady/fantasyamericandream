import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Life Ledger - Class of 2026',
  description: 'Build a career. Survive the economy. Buy back your time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
