import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { GoogleAnalytics } from '../components/GoogleAnalytics';
import dynamic from 'next/dynamic';

// Dynamically import the WishNotificationWrapper to avoid SSR issues
const WishNotificationWrapper = dynamic(
  () => import('../components/wishlist/WishNotificationWrapper'),
  { ssr: false }
);

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kairos',
  description: 'The Student-Powered Toolkit for College Success',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover',
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
          <WishNotificationWrapper />
        </Providers>
      </body>
    </html>
  );
}
