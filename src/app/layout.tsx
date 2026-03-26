import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';

import { ColorSchemeScript, MantineProvider, DirectionProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Heebo } from 'next/font/google';
import { theme } from '@/theme/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { DevToolbarWrapper } from '@/components/dev/DevToolbarWrapper';

const heebo = Heebo({ subsets: ['hebrew', 'latin'] });

import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'של״ז בכושר',
  description: 'אפליקציית אימון יומי של 10 דקות',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#228BE6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <ColorSchemeScript />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={heebo.className} suppressHydrationWarning>
        <DirectionProvider initialDirection="rtl">
          <MantineProvider theme={theme} defaultColorScheme="light">
            <Notifications position="top-center" />
            <AuthProvider>
              <OfflineBanner />
              {children}
              <DevToolbarWrapper />
            </AuthProvider>
          </MantineProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
