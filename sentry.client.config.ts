import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Use Firebase project ID as environment name (e.g. "slz-training", "slz-training-dev")
  environment: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,

  // Capture 10% of transactions for performance monitoring
  tracesSampleRate: 0.1,

  // Record a session replay on every error, and 5% of normal sessions
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.05,
  integrations: [Sentry.replayIntegration()],

  // Don't send errors in development
  enabled: process.env.NODE_ENV === 'production',
});
