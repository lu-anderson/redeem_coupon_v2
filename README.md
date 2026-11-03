<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Cupons do Amor — redeem

Web app that redeems a shared coupon at `/redeem/<couponId>`. Vite + React, Firebase Hosting from `dist`.

Backlog: [lu-anderson/codespaces-blank specs/015-web-redeem-page-stuck-loading](https://github.com/lu-anderson/codespaces-blank/blob/main/specs/015-web-redeem-page-stuck-loading).

A bundle built without the Firebase web config inlines `projectId` as `undefined`. Firestore then opens Listen channels to `projects/undefined`, `getDoc` never settles, and the redeem page spins forever. `vite build` now refuses to emit that bundle, and the page times out into an error with a retry button.

## Run locally

**Prerequisites:** Node.js and Yarn.

1. Install dependencies: `yarn install`
2. Create a gitignored env file for the mode you are using (`.env.development` for `yarn dev`). Do not commit it.
3. Start the app: `yarn dev`

## Environment variables

Required (the build fails if any of these are missing or blank):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

Optional (read when set):

- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`

`.env.example` lists these names with placeholders. Copy it to the gitignored file for the Vite mode you are building: `.env.development`, `.env.staging`, `.env.production`, or `.env.local`.

| Command | Vite mode | Env file |
| --- | --- | --- |
| `yarn dev` | development | `.env.development`, `.env.local` |
| `yarn build` | production (Vite default) | `.env.production` |
| `yarn build:dev` | development | `.env.development` |
| `yarn build:staging` | staging | `.env.staging` |
| `yarn build:prod` | production | `.env.production` |

`yarn build` and `yarn build:prod` both use production mode.

## Deploy

A Hosting deploy must use the matching mode. For the production site:

```bash
firebase use production && yarn build:prod && firebase deploy --only hosting
```

Production Hosting is the `affetto-5c970` project. Someone with owner access has to create `.env.production` from that project's web app config and run the command above. Do not deploy a build that was produced without those variables.

## Tests

```bash
yarn test
```
