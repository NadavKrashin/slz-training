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
develop       →  Dev/Staging (slz-training-dev)
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

## Code style

Prettier is configured in `.prettierrc`. Format before committing:

```bash
npm run format        # reformat src/
npm run format:check  # check only (runs in CI)
npm run lint          # ESLint
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
# Dev/staging
firebase deploy --project dev

# Production
firebase deploy --project production
```

---

## Secrets setup (first-time, repo owner only)

### 1. Create the staging Firebase project

```bash
firebase projects:create slz-training-dev
```

Then configure it in the Firebase Console: enable Auth (Google + Email/Password), Firestore, Functions, and Cloud Messaging.

### 2. Create service accounts for GitHub Actions

CI uses dedicated service accounts — not personal CLI tokens — so deploys are not tied to any individual's credentials.

**For each project (staging and production):**

1. Go to [Google Cloud Console → IAM → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) for the project
2. Click **Create Service Account**
   - Name: `github-actions-deploy`
   - Description: `GitHub Actions deployment`
3. Grant these roles:
   - `Firebase Admin` (covers Hosting, Functions, Firestore rules)
   - `Cloud Functions Developer` (if not included above)
4. Click the service account → **Keys** tab → **Add Key** → JSON
5. Download the JSON file — this is the secret value

Alternatively, `firebase init hosting:github` automates steps 1–4 for the Hosting service account.

### 3. Create GitHub Environments and add secrets

Secrets are scoped per environment — the same name resolves to a different value in `staging` vs `production`. Go to **GitHub repo → Settings → Environments**, create each environment, and add its secrets under **Environment secrets**.

**In the `staging` environment:**

| Secret | Value |
|--------|-------|
| `FIREBASE_SERVICE_ACCOUNT` | Full JSON content of the staging service account key |
| `FIREBASE_API_KEY` | Firebase Console → slz-training-dev → Project settings → Your apps |
| `FIREBASE_AUTH_DOMAIN` | |
| `FIREBASE_PROJECT_ID` | `slz-training-dev` |
| `FIREBASE_STORAGE_BUCKET` | |
| `FIREBASE_MESSAGING_SENDER_ID` | |
| `FIREBASE_APP_ID` | |
| `FIREBASE_VAPID_KEY` | Cloud Messaging → Web Push certificates → Key pair |

**In the `production` environment:**

| Secret | Value |
|--------|-------|
| `FIREBASE_SERVICE_ACCOUNT` | Full JSON content of the production service account key |
| `FIREBASE_API_KEY` | Firebase Console → slz-training → Project settings → Your apps |
| `FIREBASE_AUTH_DOMAIN` | |
| `FIREBASE_PROJECT_ID` | `slz-training` |
| `FIREBASE_STORAGE_BUCKET` | |
| `FIREBASE_MESSAGING_SENDER_ID` | |
| `FIREBASE_APP_ID` | |
| `FIREBASE_VAPID_KEY` | Cloud Messaging → Web Push certificates → Key pair |

Add Required reviewers to `production` for the approval gate.

---

## Notes

### Notification logs

After every 22:00 scheduled reminder, a document is written to `notificationLogs/{dateKey}` in Firestore with `successCount`, `failureCount`, `targetedCount`, `staleTokensCleaned`, and a `skippedReason` if the reminder was skipped (no workout, no tokens, or everyone already completed). Check this collection to verify a reminder ran without needing to watch Cloud Function logs.

### Static hosting

The app is deployed as a static site to Firebase Hosting (`out/` directory). Next.js needs `output: 'export'` in `next.config.js` for this to work. If you see a mismatch between build output and what Firebase Hosting expects, verify that setting is present.

### Emulator data persistence

`npm run emulators` imports from and exports to `./emulator-data/` automatically. This directory is gitignored. Delete it to start fresh.

Run `npm run emulators:export` to save current emulator state manually.
