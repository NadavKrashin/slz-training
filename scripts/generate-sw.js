#!/usr/bin/env node
/**
 * Generates public/firebase-messaging-sw.js with Firebase config values
 * substituted from environment variables. Run before `next dev` and `next build`.
 *
 * The service worker file is derived at build/dev time because service workers
 * run in their own global scope and cannot access Next.js runtime env vars.
 * Firebase config values are NEXT_PUBLIC_* (non-secret) so embedding them
 * in a static file is intentional and safe.
 */

const fs = require('fs');
const path = require('path');

// Load .env.local if present (for local development)
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      if (!process.env[key]) process.env[key] = value.trim();
    }
  }
}

const required = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.warn(`[generate-sw] Warning: missing env vars: ${missing.join(', ')}`);
  console.warn('[generate-sw] Background notifications will not work until these are set.');
}

const content = `/* AUTO-GENERATED — do not edit. Run \`npm run generate-sw\` to regenerate. */
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: ${JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '')},
  authDomain: ${JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '')},
  projectId: ${JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '')},
  storageBucket: ${JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '')},
  messagingSenderId: ${JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '')},
  appId: ${JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '')},
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'של\u05f4ז בכושר';
  const options = {
    body: payload.notification?.body || '',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    dir: 'rtl',
    lang: 'he',
    data: payload.data,
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.link || '/home';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
`;

const outPath = path.join(__dirname, '..', 'public', 'firebase-messaging-sw.js');
fs.writeFileSync(outPath, content, 'utf8');
console.log('[generate-sw] Written public/firebase-messaging-sw.js');
