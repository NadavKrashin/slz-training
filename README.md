# של״ז בכושר (SLZ Training)

Daily 10-minute workout PWA built with Next.js, Mantine, and Firebase.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Mantine v7
- **Backend:** Firebase Auth, Firestore, Cloud Functions v2, Cloud Messaging
- **PWA:** next-pwa, service worker, installable on mobile

## Setup

### 1. Install dependencies

```bash
npm install
cd functions && npm install && cd ..
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
# Fill in your Firebase project config values
```

### 3. Firebase setup

```bash
npm install -g firebase-tools
firebase login
firebase init
```

### 4. Deploy Firestore rules & indexes

```bash
firebase deploy --only firestore
```

### 5. Deploy Cloud Functions

```bash
cd functions && npm run build && cd ..
firebase deploy --only functions
```

### 6. Bootstrap admin

Set the `BOOTSTRAP_ADMIN_EMAIL` parameter before deploying functions:

```bash
firebase functions:params:set BOOTSTRAP_ADMIN_EMAIL=your@email.com
firebase deploy --only functions
```

Then sign in to the app with that email and call `setAdminClaim` from the browser console with your own UID:

```js
const { getFunctions, httpsCallable } = await import('https://www.gstatic.com/firebasejs/10.0.0/firebase-functions.js');
// or from your app's Firebase instance:
httpsCallable(functions, 'setAdminClaim')({ targetUid: 'YOUR_UID_HERE' });
```

After the call succeeds, sign out and sign back in to refresh your token — the admin UI will then appear.

### 7. Seed motivational messages

Call the `seedMotivationalMessages` Cloud Function as admin.

### 8. Run locally

```bash
npm run dev
```

## Project Structure

```
src/
  app/           # Next.js App Router pages and layouts
    (auth)/      # Login, register, forgot-password
    (app)/       # Authenticated user pages (home, workout, history, timer, profile)
    (admin)/     # Admin pages (workouts, users, daily, messages, timer)
  components/    # Reusable React components by feature
  hooks/         # Custom React hooks
  contexts/      # React contexts (auth)
  lib/           # Utilities, Firebase SDK, types, constants
  theme/         # Mantine theme configuration
functions/       # Firebase Cloud Functions
```

## Admin Permissions

Admin authorization uses a two-layer system:

### Firebase Custom Claims (source of truth)

A JWT claim `{ admin: true }` is set on a user's auth token via the `setAdminClaim` Cloud Function. This is checked by:

- **Client:** `getIdTokenResult().claims.admin` in `AuthContext` → sets `isAdmin`
- **Firestore rules:** `request.auth.token.admin == true` in the `isAdmin()` helper

The Firestore `users/{uid}.role` field is **display only** (used for badges in the admin user list) and has no authorization power.

### Where it's enforced

| Layer | How |
|---|---|
| Admin pages | `(admin)/layout.tsx` checks `isAdmin`, redirects to `/home` if false |
| Admin nav tab | `BottomNav` only shows the gear icon when `isAdmin` is true |
| Firestore writes | Rules check `request.auth.token.admin` for workout CRUD, app settings, messages |
| Cloud Functions | `context.auth.token.admin` check in callable functions |

### Making someone admin

From the browser console while logged in as an existing admin:

```js
window.makeAdmin('target-user-uid')
```

To find a user's UID, run `window.whoAmI()` in their browser console.

After the call succeeds, the target user must sign out and sign back in (or call `refreshClaims()`) to pick up the new claim.

### Bootstrapping the first admin

Since no admin exists initially to call `setAdminClaim`, you need to bootstrap manually. See the [Bootstrap admin](#6-bootstrap-admin) section in Setup.

## Key Features

- Full Hebrew RTL interface
- Mobile-first PWA, installable on home screen
- Daily workouts with stage-by-stage timer flow
- Two simultaneous timers (total + stage)
- Streak tracking and monthly calendar history
- Motivational mascot with random messages
- Admin workout management with 600-second validation
- Push notifications at 22:00 for incomplete workouts
- Privacy-respecting sharing toggle per user
- Offline support via Firestore persistence
