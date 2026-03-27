// @ts-check
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export is only needed for Firebase Hosting (production builds).
  // In dev mode it breaks dynamic routes like /admin/users/[uid] because
  // the dev server enforces generateStaticParams() for all navigations.
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  reactStrictMode: true,
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks', '@tabler/icons-react'],
  },
};

module.exports = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Upload source maps during CI builds only
  silent: !process.env.CI,

  // Capture more client-side source files for better stack traces
  widenClientFileUpload: true,

  // Suppress Sentry SDK logging in production bundles
  disableLogger: true,
});
