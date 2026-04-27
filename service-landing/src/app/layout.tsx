import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scholarship API - Find & Apply for Scholarships',
  description: 'A comprehensive platform for discovering and applying to scholarships with powerful APIs for developers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
}
