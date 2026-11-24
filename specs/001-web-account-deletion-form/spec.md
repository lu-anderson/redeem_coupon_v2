# Spec 001 — Web account-deletion form

This is a design spec only. Do not implement, merge rules, deploy functions, or
publish Hosting until the owner approves this document.

The spec is written in English (repo convention). UI copy in the UX section is
pt-BR, to match the existing pages.

## Metadata

| Field | Value |
| ----- | ----- |
| Status | `needs-decision` |
| Milestone | After the current store review; Play web-deletion compliance |
| Priority | P1 |
| Depends on | In-app deletion (`deleteAccount`) already shipped in `lu-anderson/codespaces-blank` (PR #64) |
| Blocks the release | no (in-app deletion already exists). It does block a *working* Play web deletion resource. |
| Implementation | Only after the owner approves this spec |

Allowed statuses follow the Affetto template: `todo`, `in-progress`, `done`, `needs-decision`.

## Context

The public page `https://<host>/delete-account` in this repo (`pages/DeleteAccountPage.tsx`)
asks for an email and promises a confirmation message, a 7-day link, and deletion within
30 days after confirmation. That flow was never built.

What the form does today (`services/deletionRequestService.ts`):

1. The browser calls Firestore directly (no Cloud Function, no outbound email).
2. It queries `deletion_requests` for an existing document with the same lowercased email
   and `status: "pending"` (`getDocs`).
3. If none is found, it `addDoc`s `{ email, requestedAt: serverTimestamp(), status: "pending", confirmedAt: null, processedAt: null }`.
4. A confirmation-token stub in the file is empty and is not written.

Why the form fails even though production rules are live:

- Live Firestore rules on `affetto-5c970` (and the same block in
  `lu-anderson/codespaces-blank` `firestore.rules`) allow **create only** of that exact
  shape, including signed-out clients. **Reads, updates, and deletes are denied.**
- The pre-write `getDocs` query is a read, so the client receives `permission-denied` and
  the page shows an error.
- Nothing processes the queue. Production functions are `deleteAccount` (signed-in callable,
  keyed by uid, not by this collection), `revenuecatWebhook`, `revokeExpiredPremium`, and
  `sendCouponNotification`. A document that somehow got created would stay `pending` forever.
- The 7-day link and the 30-day delay do not exist in any function or template.

In-app deletion already works and must stay the primary path for people who have the app:
on the home Dashboard (header “Olá, {nome}!”), the top-right account menu (three dots,
“Menu da conta”, same menu as “Sair”) has “Excluir conta”. Confirm calls
`authService.deleteAccount()` and the `deleteAccount` callable, then signs out. Deletion is
immediate. Store subscriptions are not cancelled. On iOS, a Sign in with Apple account is
re-confirmed and the Apple tokens are revoked first. There is no Perfil or Settings screen.

Google Play still requires a web resource where a person can request deletion **without
reinstalling the app**. This spec is how that resource becomes real, without letting a
stranger delete someone else’s account by typing their email.

This repo has no prior `specs/` tree. The folder layout and the Given / When / Then style
follow `lu-anderson/codespaces-blank/specs/templates/spec.md`.

## Goals

- A person who is not signed in, and who may not have the app installed, can request
  account deletion from `/delete-account`.
- Input is validated and sanitized on the client and again on the server. The collection
  cannot be used as an injection or write-gadget surface.
- Identity is verified by email before any account is deleted.
- After a valid confirmation, the server reuses the same deletion core as `deleteAccount`
  (lookup by email → uid), so web and in-app remove the same data.
- Request records have a strict lifecycle: `pending` → `processed` → `delivered`.
- Only the Admin SDK may change status.
- The page copy matches the real flow (no fictional 7-day / 30-day process).
- The existing support address already printed on `/delete-account`, `/privacy`, and
  `/terms` remains as a manual fallback. This spec does not invent a new address.
- Rollout is dev → staging → prod, each with an explicit approval. No production deploy
  from the implementation task itself.

## Non-goals

- Implementing anything in this PR, or deploying rules, functions, or Hosting.
- Removing or changing the in-app “Excluir conta” flow.
- Cancelling App Store or Google Play subscriptions (same rule as in-app deletion).
- Letting the web flow revoke Sign in with Apple tokens (the Apple sheet only exists on
  the device; see Processing).
- Building a staff inbox or admin UI for the queue.
- Moving the entire Firebase project (Auth, all functions, all rules) into this repo.
- Storing anything beyond the request record (no name, no message body, no coupon data
  in this collection).

## Repository split and rules ownership

The form and this spec live in `lu-anderson/redeem_coupon_v2`. Firebase Hosting for
the page is also deployed from this repo.

Firestore rules and Cloud Functions for the Affetto projects (`affetto-dev`,
`affetto-staging`, `affetto-5c970`) are **not** owned here. They are deployed from a
single `firestore.rules` file and the `functions/` package in
`lu-anderson/codespaces-blank`. A rules deploy from a second copy in this repo would
**overwrite** the rest of the production rules (users, coupons, purchases, and so on).

Recommended approach (default, unless a later decision changes ownership):

1. **This repo** holds the spec, the `/delete-account` UI, client validation, App Check /
   reCAPTCHA wiring on the web app, and Hosting deploys of the page.
2. **`codespaces-blank`** keeps being the only source that is allowed to deploy
   `firestore.rules` and Cloud Functions to those projects. The `deletion_requests` block
   stays in that file. The shared deletion core stays in `functions/src/deleteAccount.ts`
   (extracted so the callable and the web processor call the same function). New HTTPS
   functions for “request” and “confirm” are added there.
3. This spec is the contract. The codespaces-blank change is a follow-up PR, linked from
   this one, implemented only after approval. Do not paste a second full rules file into
   this repo.
4. Cross-reference: add a short pointer in `codespaces-blank/src/docs/ACCOUNT_DELETION.md`
   and in the `deletion_requests` comment in `firestore.rules` to this spec path.

Alternative, only if the owner later wants one repo to own all Firebase config: move
`firestore.rules` and `functions/` out of codespaces-blank into a dedicated repo, and
point both app and web deploys at it. That is a larger migration and is **not** required
to ship this form. It must not be done by copying rules into redeem_coupon_v2 and
deploying from here.

## Stories

- As a person without the app installed, I want to request deletion from the website, so
  that I can meet Play’s web deletion requirement and recover if I lost the device.
- As the account holder, I want to confirm the request from my email, so that a stranger
  who types my address cannot delete my account.
- As the owner, I want strict rules, server-side validation, and no client reads of the
  queue, so that email addresses in the collection are not listable and the form cannot
  be used for injection.
- As a signed-in user of the app, I want the in-app path to keep working unchanged.

## Status lifecycle

The owner asked for three states: `pending`, `processed`, and `delivered`. This spec
uses exactly those values on the document, with the meanings below. Clients never write
or change them.

| Status | Meaning | Who sets it | When |
| ------ | ------- | ----------- | ---- |
| `pending` | The request was accepted. A **verification** email with a single-use confirmation link was sent (or queued) to the normalized address. The Affetto account, if any, has **not** been deleted yet. | Admin SDK, in the request function, after validation | Create |
| `processed` | A valid confirmation token was presented in time. The server looked up the Firebase Auth user by that email and ran the shared deletion core if a user existed. If no user existed, the step still succeeds (see identity / enumeration). Store subscriptions are not cancelled. | Admin SDK, in the confirm function | After a valid confirmation |
| `delivered` | A **completion** email was sent to the requester stating that, if an Affetto account existed for that address, it has been deleted, plus the subscription and Sign in with Apple caveats. | Admin SDK, in the confirm function (or a short follow-up on the same request) | After `processed`, once the completion email is handed to the mail provider |

Recommended additional terminal status, not requested but useful:

| Status | Meaning |
| ------ | ------- |
| `expired` | The confirmation link reached its TTL (default 7 days) without a valid confirmation. No deletion ran. A later request for the same email may start a new `pending` cycle. |

`expired` needs a decision (open question). Until then, treat an expired token as a
failed confirmation that does not change a `pending` document, and let a later request
replace it via the Admin SDK.

**What “delivered” is not.** It is not the first (verification) email. Mixing those
meanings would mark a request delivered before any deletion. The three names still
fit if `pending` covers “waiting for the person to confirm”, `processed` covers
“account data deleted (or confirmed absent)”, and `delivered` covers “we told the
requester”.

**Transitions** (Admin SDK only):

- create → `pending`
- `pending` → `processed` (valid token, not expired, not already used)
- `processed` → `delivered`
- `pending` → `expired` (only if that status is approved)

No backwards transitions. No client updates. A second confirmation of an already
`processed` or `delivered` request is idempotent: do not delete twice, do not send a
second completion email unless the first send failed and is being retried.

## Data model

Collection: `deletion_requests` (keep the existing name).

Document id: `HMAC-SHA256(server_secret, normalized_email)` encoded as hex (64 chars).
The secret lives in function config / Secret Manager, never in this repo or the web
bundle. Because only the Admin SDK writes, the browser never computes or sees the id.
This gives dedupe without a client read: one active record per email.

PII stored: the normalized email only (required to send mail and to look up the Auth
user). No name, phone, IP in clear text, user-agent, or free-text message.

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| `email` | string | yes | Normalized: trim, Unicode NFKC, lowercase. Max 320 characters. Must match the same strict regex used in rules / the function. |
| `emailHash` | string | yes | The document id, also stored as a field for logs that must not print `email`. |
| `status` | string | yes | `pending` \| `processed` \| `delivered` (and `expired` if approved). Created as `pending` only. |
| `requestedAt` | timestamp | yes | Server time at create. |
| `confirmExpiresAt` | timestamp | yes | `requestedAt` + TTL (proposed 7 days). |
| `tokenHash` | string | yes | SHA-256 (or HMAC) of the single-use confirmation token. The raw token is sent only in the email, never stored. |
| `confirmedAt` | timestamp \| null | yes | Null until a valid confirmation. Then server time. |
| `processedAt` | timestamp \| null | yes | Null until the deletion core finished (including the “no Auth user” case). |
| `deliveredAt` | timestamp \| null | yes | Null until the completion email was accepted by the provider. |
| `matchedAccount` | boolean \| null | no | Internal only. `true` / `false` after processing. Never returned to an unauthenticated client in a way that enables enumeration. |
| `lastError` | string \| null | no | Short, non-PII machine code for retries (`mail_send_failed`, `delete_failed`). No email, no stack traces. |

Rejected on create: extra keys, `confirmationToken` in clear, uppercase email, any
status other than `pending`, client-supplied timestamps, arrays, maps, or HTML.

Normalization and validation (both client and server; server is authoritative):

- Trim surrounding whitespace.
- Apply Unicode NFKC.
- Lowercase ASCII letters.
- Reject any value that does not match
  `^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$` and length 3–320.
- Reject more than one `@`, whitespace, control characters, or angle brackets.
- Do not “fix up” or parse HTML. Invalid input is an error, not a coerced write.

## Client (this repo)

- Replace the current Firestore `getDocs` + `addDoc` path. The browser must **not**
  read or write `deletion_requests`.
- On submit, after the same format checks, call an HTTPS function (App Check /
  reCAPTCHA required) with `{ email }`.
- Success copy: a verification email was sent, check inbox and spam, the link expires
  in 7 days (or the approved TTL). Do not reveal whether an account exists.
- The confirm link lands on a page on this site (for example `/delete-account/confirm?token=…`)
  that calls the confirm function and shows a generic success or a generic failure
  (expired / invalid token). Same wording whether or not an account existed.
- Keep the support-address fallback and the in-app instructions (Dashboard → account
  menu → “Excluir conta”), because many people who still have the app should use that
  path. Do not invent a Perfil or Settings screen that the app does not have.
- Remove dead client code once the new path ships: the Firestore query in
  `deletionRequestService.ts` and any tests that only exist for that query.

## Server validation and Firestore rules

Preferred rules for this collection, deployed **only** from
`codespaces-blank/firestore.rules`:

```
match /deletion_requests/{requestId} {
  allow read, create, update, delete: if false;
}
```

All writes go through the Admin SDK in Cloud Functions. That is stricter than today’s
public create-only rule, and it removes the injection surface of a signed-out `addDoc`.

If a client-create fallback is ever required (not recommended), it must stay create-only,
exact keys, types, sizes, regex, `status == "pending"`, `requestedAt == request.time`,
null `confirmedAt` / `processedAt`, and still **deny all reads**. Dedupe would then use
a deterministic id and `set` of a new document (create succeeds, update of an existing
id fails). This spec still prefers Admin-only creates so rate limits, HMAC ids, and mail
sending happen in one place.

The request function must also:

- Verify App Check (and fail closed if the token is missing in production).
- Re-run normalization and the regex. Never trust the client.
- Rate-limit by email hash (for example one new `pending` per email per TTL) and by
  a coarse client identifier (for example 5 requests per hour per remote IP, stored
  hashed, not in this collection).
- If a non-expired `pending` document already exists for that hash, do not create a
  second one. Return the same generic success (do not resend in a tight loop).
- Create the document as `pending` only, with server timestamps.
- Send the verification email.

The confirm function must:

- Hash the token and find the document (Admin query or a lookup table). Constant-time
  compare on the hash.
- Reject expired, already used, or unknown tokens with the same generic error.
- After success, run the deletion core, set `processed`, send the completion email,
  set `delivered`.

## Identity verification

A stranger must not be able to delete an account by submitting someone else’s email.

Flow:

1. The requester submits an email on `/delete-account`.
2. The request function always returns a generic success after basic validation
   (and after rate limits). It sends a verification email only to that address.
3. The email contains a single-use HTTPS link with a high-entropy token (at least
   128 bits of randomness). The token is not the document id.
4. Only a valid, unexpired token starts deletion.
5. The completion email is the `delivered` step.

This requires an email provider (Firebase Auth will not send this mail by itself).
The provider is an open question. Do not put SMTP passwords in the repo.

If no Auth user exists for the email, still show generic success and still send the
verification email. After confirmation, run the lookup, delete nothing if absent,
and send a completion email that says: if an Affetto account existed for this
address, it has been deleted. That wording avoids account enumeration.

## Processing

Extract the body of `functions/src/deleteAccount.ts` into a function such as
`deleteAccountByUid(uid)` in codespaces-blank. The existing callable keeps checking
`context.auth.uid` and then calls that function. The confirm function does:

1. `getUserByEmail(normalizedEmail)` via the Admin Auth SDK.
2. If found, `deleteAccountByUid(uid)`.
3. If `auth/user-not-found`, treat as success with `matchedAccount: false`.

The deletion core already removes, for that uid: `users/{uid}`, `pushTokens`,
`coupons` and their `couponUsages`, `notifications`, `purchases`, `pendingPurchases`,
`ratings`, `feedback`, `revenuecatEvents`, and the Firebase Auth user. It does not
delete `couponTemplates`, `orphanPurchases`, or other people’s data. It does not
cancel the store subscription.

**Sign in with Apple.** The in-app path can re-prompt Apple on iOS and revoke tokens
before delete. A server-side email flow cannot present the Apple sheet, and Firebase
does not store Apple tokens to revoke later. The completion email must tell the
person that if they created the account with Apple, they should also remove Affetto
under Ajustes → [seu nome] → Iniciar Sessão com a Apple. The in-app path remains
the better option for those accounts.

**Subscriptions.** Same as in-app: not cancelled. The completion email and the page
must say to cancel in iPhone Settings or in the Play Store if they have an active
plan, and may link the official manage-subscription URLs.

Idempotency: a repeated confirm or a uid that is already gone must succeed, same as
the callable.

## Retention and audit

- Keep the request document after `delivered` (or `expired`) for a proposed
  90 days, then a scheduled function deletes it. That is long enough for support
  disputes and short enough not to keep emails indefinitely.
- Function logs must use `emailHash` (and uid after a successful lookup), never
  the raw email, never the raw token, never the confirmation URL.
- Staff who need to debug a ticket use the Auth / support tools they already have,
  not a world-readable collection (rules deny all client access).

## UX copy (pt-BR)

Replace the current “confirme por e-mail / link em 7 dias / exclusão em 30 dias após
a confirmação” story with copy that matches the real pipeline. Proposed text for the
implementation (may be edited in review, but the meaning is fixed):

**How to delete (in the app, preferred if they still have it):**

1. Abra o Affetto e entre na sua conta.
2. Na tela inicial (saudação “Olá, …!”), toque no menu da conta no canto superior
   direito (ícone de três pontos), o mesmo menu de “Sair”.
3. Toque em “Excluir conta”, leia o aviso e confirme. A exclusão é imediata.

**How to request from the site:**

- Informe o e-mail da conta (e-mail/senha, Google ou Sign in with Apple, inclusive
  um endereço de retransmissão privada da Apple, se for o caso).
- Enviaremos um e-mail de verificação com um link. O link expira em 7 dias e só
  funciona uma vez.
- Depois que você confirmar, apagamos os dados da conta na hora (não há espera de
  30 dias) e enviamos um e-mail de conclusão.
- Se não existir conta com esse e-mail, a mensagem de conclusão permanece genérica.
- Uma assinatura ativa da App Store ou do Google Play não é cancelada com a
  exclusão. Cancele nas configurações da loja.
- Se a conta foi criada com a Apple, após a exclusão pelo site revogue também o
  Affetto em Ajustes → [seu nome] → Iniciar Sessão com a Apple.

**Success after submit:** “Se o e-mail estiver correto, você receberá uma mensagem
para confirmar a exclusão. Confira também a caixa de spam. O link expira em 7 dias.”

**Success after confirm:** “Se existia uma conta Affetto com este e-mail, ela foi
excluída. Uma assinatura ativa precisa ser cancelada na loja. Se você entrava com
a Apple, revogue o Affetto nos Ajustes do iPhone.”

**Failure:** “Não foi possível concluir o pedido. O link pode ter expirado ou já
ter sido usado. Você pode solicitar de novo ou usar o e-mail de suporte.”

Keep the existing support mailto already on the page. Do not add a new address.

Update `/privacy` in the same implementation so it does not describe a 30-day web
queue that no longer exists, without changing the in-app description.

## Tests

In `codespaces-blank` (where rules and functions already have tests):

- Rules unit tests: every client path against `deletion_requests` fails (read, list,
  create, update, delete), signed in and signed out. Admin writes are out of band
  for rules tests.
- Function tests: normalization and rejection of malicious / oversized / uppercase
  / HTML email strings; HMAC id stability; rate-limit behaviour; create writes only
  `pending`; confirm rejects bad or expired tokens; confirm calls
  `deleteAccountByUid` when Auth has that email; confirm is success when Auth has
  no user; logs do not include the raw email or token; status moves
  `pending` → `processed` → `delivered`; a second confirm is idempotent.

In this repo:

- Client validation tests (invalid emails never call the function).
- The page no longer imports Firestore `getDocs` / `addDoc` for this collection.
- Confirm-page generic success / failure rendering.

## Rollout

Implementation, after approval, in this order. Each production step needs an
explicit owner approval. Do not deploy production from the first implementation
task unless that approval is given.

1. codespaces-blank PR: extract `deleteAccountByUid`, add request/confirm
   functions, tighten `deletion_requests` rules, add tests. No deploy yet.
2. Deploy functions and rules to **affetto-dev** only. Smoke the form against the
   dev Hosting site.
3. This repo PR: new client, copy, tests. Deploy Hosting to **affetto-dev** only.
4. Staging: functions, rules, then Hosting, with a written approval.
5. Production `affetto-5c970`: functions and rules first, then Hosting, with a
   written approval. Keep a short window to watch logs (hashed ids only).
6. Update `ACCOUNT_DELETION.md` so it no longer says the web form’s query is
   denied and left unfixed.

## Play policy

Play requires a URL where a user can request deletion without installing or
reinstalling the app. `/delete-account` stays that URL. After this ships, the
form actually completes the request (verification email + deletion + completion
email). The in-app path remains available. The support address remains a fallback
if the person cannot use the form.

## Acceptance criteria

### A person can request from the site without the app

- **Given** a browser on `/delete-account` and no installed app.
- **When** they submit a well-formed email and pass App Check.
- **Then** the client does not read or write Firestore.
- **And** they see only the generic “check your email” success.
- **And** a `pending` document is created by the Admin SDK (or a generic success
  is returned because a non-expired pending request already exists).

### A stranger cannot delete someone else’s account

- **Given** a submitted email that belongs to an existing Auth user.
- **When** no valid confirmation token is presented.
- **Then** that Auth user and their Firestore data still exist.

### A confirmed request deletes the same data as the app

- **Given** a valid, unexpired token for an email that has an Auth user.
- **When** the confirm function runs.
- **Then** `deleteAccountByUid` removes the same per-uid data as in-app deletion.
- **And** the store subscription is not cancelled.
- **And** the document becomes `processed` then `delivered`.
- **And** a completion email is sent.

### No account is not an error that leaks existence

- **Given** a well-formed email with no Auth user.
- **When** they submit and later confirm.
- **Then** visible messages stay generic.
- **And** the document still reaches `delivered`.

### Invalid input never reaches Firestore

- **Given** an empty string, too-long value, HTML, uppercase-only garbage, or a
  string that fails the regex.
- **When** they submit.
- **Then** the function (and the client checks) reject it.
- **And** no document is written.

### In-app deletion is unchanged

- **Given** a signed-in user in the app.
- **When** they use “Excluir conta” in the account menu.
- **Then** the existing callable path still works, including Apple revocation on iOS.

## Out of scope

- This PR (the spec only): no code, no deploys, no merge of implementation.
- Staff tooling, bulk deletion, or GDPR export (access / correction stay on the
  support address and in-app, as they do today).
- Changing how RevenueCat or Meta attribution works after a user is gone.

## Open questions

1. **Email provider.** Which service sends the verification and completion mail
   (for example a Firebase “Trigger Email” extension, SendGrid, Resend, or Postmark)?
   The form cannot work without one. Credentials stay out of git.
2. **Is the extra `expired` status wanted**, or should an old `pending` document be
   overwritten by a new request after the TTL without a named status?
3. **Confirmation TTL.** This spec proposes 7 days (the current page already mentions
   7 days). Is that the right window?
4. **Immediate deletion after confirm.** This spec drops the promised 30-day wait and
   deletes as soon as the link is confirmed (same idea as in-app). Confirm that this
   is acceptable for Play and for the owner.
5. **Rules / functions stay in codespaces-blank?** The recommended split is above.
   Approve it, or say if ownership should move later — but not by deploying rules
   from this repo.
6. **App Check vs a visible reCAPTCHA.** Proposal: Firebase App Check with reCAPTCHA
   v3 on the web app, required in production. A visible challenge can be added if
   abuse appears.
7. **Completion email when no account existed.** Is the generic wording enough, or
   should we skip the second email when `matchedAccount` is false (still risky for
   enumeration if the first email always arrives and the second does not)?
8. **Sign in with Apple from the web.** Accept the Settings revocation note, or
   require those accounts to delete only in the iOS app (the site would then refuse
   or instruct them after they confirm)? Recommendation: allow the web path and
   include the Settings instructions, so people without the phone can still delete.
9. **90-day retention** of request records: keep, shorten, or hash/redact `email`
   after `delivered` and keep only `emailHash`?

## References

- This repo: `pages/DeleteAccountPage.tsx`, `services/deletionRequestService.ts`.
- `lu-anderson/codespaces-blank`: `firestore.rules` (`deletion_requests` block),
  `functions/src/deleteAccount.ts`, `src/docs/ACCOUNT_DELETION.md`,
  `src/components/HeaderRight.tsx`, spec 025.
