# Lisette delivery plan

Status: approved for implementation (2026-10-21). Stack decided: React Native + Expo (Expo Router, React Native Web), TypeScript, Supabase (Postgres, Auth, Storage, Edge Functions, EU region). Android phones/tablets first, authenticated web second, no iOS.

## Tools on each computer

VS Code with the Claude Code, Expo Tools and ESLint extensions; Node and Git; Docker and the Supabase CLI (both people, for the local database and SQL tests); Expo Go on a real Android phone. No Android Studio and no local Android SDK. When a module is not available in Expo Go (likely the PDF reader in 02.1), make a development build in the cloud with `eas build --profile development --platform android` (free Expo account) and install it on the phone. Claude Code plugins `expo` and `superpowers` are listed in `.claude/settings.json`.

## Read before any task

1. `AGENTS.md` and `brand/brand.yaml` (approved wording, palette, fonts).
2. `docs/product/requirements.md`: what the product must do. It wins over everything below.
3. `docs/superpowers/specs/2026-10-21-lisette-database-design.md` and `lisette-schema.html` (same folder): the only source for tables, columns, types, allowed values and limits. Plans name tables; they never redefine them.
4. This page, then the module plan of your task.

## Rules for every task

- **Test first.** Write the task's acceptance test, run it and see it fail for the right reason, implement, run it again until it passes. SQL rules are tested with `supabase test db` against real roles, not mocks.
- **Identity comes from the session.** Every database function reads the caller from `auth.uid()`. Never accept an account ID for "who is acting" from the app.
- **Database owns the rules.** RLS on every table. Any change that touches several rows or checks several rules (submit, change status, approve, unlock) is one `security definer` function in one transaction. The UI never decides permissions.
- **Migrations** are created with `supabase migration new <topic>` (timestamped names, no fixed numbers). Run `supabase db reset` before merging to prove a clean rebuild. A function is created only after the tables it uses exist.
- **IDs** are UUID strings. Types come from generated database types plus the owning feature; do not copy them into other features.
- **Limits** marked "propunere" in the schema page are starting values. Use them; never invent others.
- **Files:** private buckets have no client read access. Manuscripts, beta pages and discovery content go through an authenticated Edge Function with `Cache-Control: no-store`, never long-lived signed URLs.
- **Words:** never say manuscripts are encrypted; downloads cannot be recalled; device authentication is not proof of authorship.
- **Translations:** add keys only inside your feature's group in `src/i18n/ro.json` and `en.json` (groups already exist). Romanian copy is still pending review.
- **Out of scope:** manuscript editor, chat, payments, algorithmic feed, OS push, audio recording.
- **Secrets:** never in `EXPO_PUBLIC_*` variables or in git.

## Who does what

Two streams, each owning its database work and its screens. Week 1 and weeks 7–8 are done together.

| Week | Person A: manuscripts | Person B: community and discovery |
|---|---|---|
| 1 | **Together:** [01 Foundation](2026-10-17-lisette-01-foundation.md). A: Supabase, auth, migrations. B: Expo shell, theme, i18n, device checks. | |
| 2 | 02.1 private PDF upload | 03.3 posts, reactions, follows |
| 3 | 02.2 calls and submissions, 02.3 review | 03.2 profiles, 04.1 library |
| 4 | 03.1 approvals and publisher quotes | 04.2 book page, 04.3 reviews |
| 5 | 03.4 audiences and beta, 03.5 heatmap | 05.1 events and map, 05.2 discoveries |
| 6 | 06.1 notifications | 05.3 ambient light, 06.3 search |
| 7–8 | **Together:** 06.2 moderation, 06.4 device testing, demo and builds | |

Module plans: [02 Manuscripts](2026-10-17-lisette-02-manuscripts.md) · [03 Community](2026-10-17-lisette-03-community.md) · [04 Library](2026-10-17-lisette-04-library.md) · [05 Map](2026-10-17-lisette-05-map.md) · [06 Integration](2026-10-17-lisette-06-integration.md).

Weeks are checkpoints, not estimates; you work intermittently. At each checkpoint note what is done. If it slips, discuss order with each other instead of silently dropping agreed features.

### Working in two

- One branch per task. Merge to `main` at least twice a week.
- Shared tables (`accounts`, `profiles`, `publishers`, `works`, `contents`, `domain_events`) change only after both agree.
- If you need the other stream's table before it is merged, build the screen on fixtures; the task is done only after the real integration test passes.

## Dependencies

| Task | Needs |
|---|---|
| 01.1 → 01.2 → 01.3 | in order |
| 02.1 | 01.3 |
| 02.2 → 02.3 | 02.1 |
| 03.3 | 01.2 |
| 03.2 | 03.3 (excerpts appear after 03.1, Inspirations after 04.1) |
| 03.1 | 02.3 and 03.3 |
| 03.4 → 03.5 | 03.1 |
| 04.1 | 01.3 |
| 04.2 → 04.3 | 04.1 and 03.3 |
| 05.1 | 04.2 |
| 05.2 | 05.1 (activating manuscript-quoting variants needs 03.1) |
| 05.3 | 02.1 (reuses its device-auth adapter) |
| 06.1 | 02.3 (first event producers) |
| 06.2, 06.3 | the content they cover |
| 06.4 | everything |

## Device and service checks

- Week 1: Expo Go on a real Android phone (and tablet, if available) reaches biometrics/device PIN, camera, location, the light sensor and motion sensors. Record missing hardware in `docs/testing/devices.md` before counting sensor points.
- 02.1: owner PDF preview works on Android phone, tablet and web, and clears on lock/logout. Stop and report if it cannot.
- Before 05.1 and 06.1: check map provider and email service keys, terms and cost. Use local fixtures and a local mail sink until then.
- Pin a compatible Expo SDK / Node set at the start; do not copy "latest".

## Commands

Created in 01.1: `npm run typecheck`, `npm run lint`, `npm test -- --runInBand`, `supabase test db`, `npm run test:gateway`, `npm run test:web`, `npx expo export --platform web`, plus an Android APK built with EAS Build and installed on phone and tablet.

## Not decided: do not build

Post-selection changes to sharing restrictions; history retention and destructive account deletion; heatmap data retention and opt-out deletion; report reasons and appeal flow; notification preferences. Keep the agreed safe default (snapshots kept, deletion only queued) and expose no action for these.

## Acceptance criteria map

| Criteria (functional spec) | Task |
|---|---|
| AC-01–03 language, roles, publisher approval | 01.1, 01.2 |
| AC-04–09 PDF versions, submissions, evaluation, access; AC-27 opened marker | 02.1–02.3 |
| AC-10–14, AC-16 approvals, visibility, reactions, work links, associations | 03.1–03.3 |
| AC-24 audiences and beta; AC-23 reading patterns | 03.4, 03.5 |
| AC-15 library and book connections; AC-25 reviews | 04.1–04.3, 05.1 |
| AC-17–19 events, unlocks, collection | 05.1, 05.2 |
| AC-20–21 notifications, moderation; AC-26 follower notices | 06.1, 06.2 |
| AC-22 phone, tablet, web, no editor | every UI task, final check 06.4 |
| Search | 06.3 |
