# redeem_coupon_v2 backlog

Minimal Spec-Driven index for the Affetto coupon redeem web app (Vite + React +
Firebase Hosting on `affetto-5c970`). Prefer short items here until the repo
grows a full `specs/` tree like Affetto (`lu-anderson/codespaces-blank`).

## How to use

1. Pick the first `todo` item whose dependencies are done.
2. Work on a branch from `origin/main`. Do not touch unrelated local edits in
   other checkouts.
3. Open one PR per item. Do not merge without owner approval.
4. Never paste secrets, API keys, or `.env` values into Evidence.

## Index

| ID | Title | Status | Priority | Depends on | Blocks Affetto v1.0.0 |
| -- | ----- | ------ | -------- | ---------- | --------------------- |
| [001](#001-security-test-battery) | Security test battery (redeem web) | `todo` | P2 (owner to confirm) | — | no |

---

## 001 — Security test battery

| Field | Value |
| ----- | ----- |
| Status | `todo` |
| Priority | P2 (owner to confirm; not blocking Affetto v1.0.0) |
| Depends on | — |
| Related | Affetto [spec 017](https://github.com/lu-anderson/codespaces-blank/blob/main/specs/017-security-test-battery/spec.md) (app and backend). Coordinate; do not duplicate Firestore ownership conclusions. |
| Prior input | Closed Copilot draft [#1](https://github.com/lu-anderson/redeem_coupon_v2/pull/1) (conflicts with `main`; not merged). Review ideas: XSS sanitization, input validation, `useEffect` cleanup, sensitive logs, `GEMINI_API_KEY` exposure. Do not merge #1. |

### Context

The redeem page is a public web client with Firebase config in the bundle. It
reads coupon documents and writes redeem-related fields according to Hosting +
Firestore rules shared with Affetto. A structured security pass has not been
tracked in this repo. Affetto owns the native app, Cloud Functions, and the
broader rules/functions audit (spec 017); this item owns the web surface.

### Scope

- XSS and input validation on the redeem page (coupon id, display names, any
  HTML rendering of user or coupon fields).
- Firestore access from the web: what the page can read and write with the
  public Firebase config; least privilege vs Affetto rules.
- Dependency audit (`yarn audit` / npm equivalent for this lockfile).
- Secrets in the bundle and in git history (including any `GEMINI_API_KEY` or
  similar). Evidence names tools and paths; never paste values.
- Hosting security headers (CSP, `X-Frame-Options` / `frame-ancestors`,
  `Referrer-Policy`, etc.) on the Firebase Hosting site.
- Coupon ID enumeration and redeem abuse (guessable ids, replay, rate limits,
  over-redeem).

### Acceptance criteria

- Findings summary under `docs/` (or this file expanded) with severity, area,
  and suggested fixes or follow-up items.
- Affetto 017 and this item cross-link each other.
- No secret values in the PR. No prod Hosting or rules deploy without explicit
  owner approval.
- Status `done` only after the summary exists and the owner accepts the
  priority/outcome.

### Out of scope

- Merging or reopening [#1](https://github.com/lu-anderson/redeem_coupon_v2/pull/1).
- Native app / RevenueCat webhook deep audit (Affetto 017).
- Implementing every remediation in the same PR.

### Tasks

| ID | Task | Owner | Done when | Evidence |
| -- | ---- | ----- | --------- | -------- |
| T001 | Confirm priority with owner (default P2) | `manual` | Priority recorded here | — |
| T002 [P] | XSS and input validation review of redeem UI | `agent` | Findings listed | — |
| T003 [P] | Firestore access review from public web config | `agent` | Read/write matrix vs rules | — |
| T004 [P] | Dependency audit | `agent` | High/critical list | — |
| T005 [P] | Secrets in bundle and history | `agent` | Tool + paths/SHAs; no values | — |
| T006 [P] | Hosting security headers | `agent` | Current headers vs recommended | — |
| T007 [P] | Coupon ID enumeration and redeem abuse | `agent` | Abuse cases and gaps | — |
| T008 | Incorporate useful ideas from closed PR #1 without merging it | `agent` | Notes in findings; #1 stays closed | — |
| T009 | Cross-link Affetto 017; open PR with findings summary | `agent` | PR URL | — |

### Risks

| Risk | Impact | Mitigation |
| ---- | ------ | ---------- |
| Secret pasted into Evidence | Leak | Names only; rotate if exposed |
| Prod Hosting change during audit | Break redeem | Owner approval; staging/dev first when possible |
| Conflict with Affetto rules work | Divergent fixes | Cross-link 017; agree ownership of rules changes |
