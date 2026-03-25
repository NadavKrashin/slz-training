# Contributing

## Prerequisites

- Node 22
- Firebase CLI: `npm install -g firebase-tools`
- Access to the Firebase projects (ask project owner)

## Local development

### First-time setup

```bash
npm ci
npm ci --prefix functions
cp .env.local.example .env.local   # fill in real Firebase values, or leave blank to use emulators
```

### Running with emulators (recommended)

No real Firebase project needed. All data is local and wiped on restart (unless exported).

```bash
# Terminal 1 — start emulators
npm run emulators

# Terminal 2 — seed test data (run once per fresh emulator session)
npm run seed

# Terminal 3 — start dev server (auto-connects to emulators via .env.development)
npm run dev
```

Test credentials after seeding:
- **Admin**: `admin@test.com` / `admin123`
- **Regular user**: `user@test.com` / `user1234`

Open Emulator UI at http://localhost:4000.

### Dev toolbar

Press **Ctrl+Shift+D** in the browser to open the dev toolbar:
- Set timer speed to **60x** to complete a 10-minute workout in ~10 seconds
- Use **→ 23:59:50** to simulate midnight and test day-transition logic
- **Trigger Reminder** calls the local Cloud Function directly

### Running against real Firebase (optional)

Fill in `.env.local` with real Firebase values. Set `NEXT_PUBLIC_USE_EMULATORS=false`.

---

## Branch → Environment mapping

```
main          →  Production  (slz-training)
develop       →  Staging     (slz-training-staging)
feature/*     →  Local only  (no deployment)
fix/*         →  Local only
```

### Typical workflow

```bash
# Start a feature
git checkout develop
git pull
git checkout -b feature/my-feature

# ... make changes, test locally with emulators ...

# Push and open a PR into develop
git push -u origin feature/my-feature
# → open PR on GitHub, CI runs automatically

# After PR is merged to develop → auto-deploys to staging
# Verify on staging, then open a PR from develop → main
# After approval and merge → auto-deploys to production
```

---

## CI

GitHub Actions runs on every push to `develop`/`main` and every PR targeting those branches.

Steps:
1. **Lint** — `npm run lint`
2. **Typecheck** — `npx tsc --noEmit` + functions build
3. **Build** — full Next.js build with staging secrets

All three must pass before a PR can be merged.

---

## Deployment

### Staging

Deploys automatically when a commit reaches `develop`. No action required.

Check the Actions tab in GitHub for status.

### Production

Deploys automatically when a commit reaches `main`, but the `production` GitHub Environment can require manual approval. Configure reviewers under:

> GitHub repo → Settings → Environments → production → Required reviewers

To set up approval (recommended):
1. Go to the environment settings above
2. Add yourself (or others) as required reviewers
3. Each push to `main` will pause and email you for approval before deploying

### Manual deploy (emergency)

```bash
# Staging
firebase deploy --project staging

# Production
firebase deploy --project production
```

---

## Secrets setup (first-time, repo owner only)

### 1. Get a Firebase CI token

```bash
firebase login:ci
```

Copy the token.

### 2. Create the staging Firebase project

```bash
firebase projects:create slz-training-staging
```

Then configure it: enable Auth (Google + Email), Firestore, Functions, and Cloud Messaging in the Firebase Console.

### 3. Add GitHub Secrets

Go to **GitHub repo → Settings → Secrets and variables → Actions**.

Add the following secrets:

| Secret | Description |
|--------|-------------|
| `FIREBASE_TOKEN` | Token from `firebase login:ci` |
| `STAGING_FIREBASE_API_KEY` | From staging project settings |
| `STAGING_FIREBASE_AUTH_DOMAIN` | |
| `STAGING_FIREBASE_PROJECT_ID` | `slz-training-staging` |
| `STAGING_FIREBASE_STORAGE_BUCKET` | |
| `STAGING_FIREBASE_MESSAGING_SENDER_ID` | |
| `STAGING_FIREBASE_APP_ID` | |
| `STAGING_FIREBASE_VAPID_KEY` | From Cloud Messaging → Web Push certs |
| `PROD_FIREBASE_API_KEY` | From production project settings |
| `PROD_FIREBASE_AUTH_DOMAIN` | |
| `PROD_FIREBASE_PROJECT_ID` | `slz-training` |
| `PROD_FIREBASE_STORAGE_BUCKET` | |
| `PROD_FIREBASE_MESSAGING_SENDER_ID` | |
| `PROD_FIREBASE_APP_ID` | |
| `PROD_FIREBASE_VAPID_KEY` | |

Firebase project settings are at: Firebase Console → Project settings → General → Your apps.

### 4. Create GitHub Environments

Go to **GitHub repo → Settings → Environments**.

- Create `staging` — no restrictions needed
- Create `production` — add Required reviewers for approval gate

---

## Notes

### Static hosting

The app is deployed as a static site to Firebase Hosting (`out/` directory). Next.js needs `output: 'export'` in `next.config.js` for this to work. If you see a mismatch between build output and what Firebase Hosting expects, verify that setting is present.

### Emulator data persistence

`npm run emulators` imports from and exports to `./emulator-data/` automatically. This directory is gitignored. Delete it to start fresh.

Run `npm run emulators:export` to save current emulator state manually.
