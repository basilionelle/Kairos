import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { GoogleAnalytics } from '../components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kairos',
  description: 'The Student-Powered Toolkit for College Success',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#4362d5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} antialiased text-base`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
