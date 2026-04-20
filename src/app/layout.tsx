import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';

import { ColorSchemeScript, MantineProvider, DirectionProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Heebo } from 'next/font/google';
import { theme } from '@/theme/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppDataProvider } from '@/contexts/AppDataContext';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { DevToolbarWrapper } from '@/components/dev/DevToolbarWrapper';

const heebo = Heebo({ subsets: ['hebrew', 'latin'] });

import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'של״ז בכושר',
  description: 'אפליקציית אימון יומי של 10 דקות',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4c6ef5',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <ColorSchemeScript />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={heebo.className} suppressHydrationWarning>
        <DirectionProvider initialDirection="rtl">
          <MantineProvider theme={theme} defaultColorScheme="light">
            <Notifications position="top-center" />
            <AuthProvider>
              <AppDataProvider>
                <ErrorBoundary>
                  <OfflineBanner />
                  {children}
                  <DevToolbarWrapper />
                </ErrorBoundary>
              </AppDataProvider>
            </AuthProvider>
          </MantineProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
