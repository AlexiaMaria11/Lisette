# Foundation and Accounts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or, if the user selects it, superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Deliver the foundation and accounts slice of Lisette as working, testable software.

**Architecture:** One React Native/Expo TypeScript application for Android and React Native Web, with Supabase Auth, Postgres/RLS and private Storage. Use transactional database functions for multi-record state changes and authenticated file access where immediate revocation is required. These are proposed technical decisions awaiting plan review.

**Tech Stack:** React Native, TypeScript, Expo Router, React Native Web; proposed Supabase; Jest/component tests, SQL policy tests and Playwright where relevant.

**Spec:** [../specs/2026-10-17-lisette-functional-design.md](../specs/2026-10-17-lisette-functional-design.md); detailed approved decisions: `../../product/requirements.md`. Read the master plan for dependencies and technical defaults.

## Global Constraints
- Android phones and tablets first; authenticated web for readers, authors and publishers second; no iOS.
- React Native and TypeScript are the requested application foundation. Expo and React Native Web are proposed tooling, not a replacement for React Native.
- Romanian and English require explicit language choice; preserve exact approved brand wording and diacritics from `brand/brand.yaml`.
- PDF-only manuscripts; no manuscript editor, chat, algorithmic feed or financial features.
- Submission email and phone are mandatory and private. An identity-document upload is not required.
- Proposed sensors: camera ISBN scan, foreground location unlock, ambient light, plus motion sensors and an on-device microphone noise level for the opt-in reading heatmap (no audio recorded); at least three must qualify. Include local biometrics with device-credential fallback too.
- Manuscripts are not encrypted by Lisette; private storage and access control only. Never describe them as encrypted.
- Shared public content requires sign-in. Server permissions, not UI state, govern private data and media.
- Draft technical defaults below are reviewable proposals. They are not already-approved product policies.

## Review Focus
- A previously obtained file reference must fail after withdrawal/rejection: plan 02 file-access tests.
- Concurrent submit/retry and status changes must not duplicate or resurrect submissions: plan 02 transactional tests.
- Edited excerpts and new recipient restrictions must not leak unapproved text: plan 03 approval tests.
- Concurrent unlocks, changed variants and content removal must preserve or revoke the correct entitlement: plan 05 unlock tests.
- Denied permissions, missing sensors and expired login must offer a truthful recoverable path: plans 01, 04, 05 and 06 tests.

### Task 1: Authenticated bilingual React Native shell

**Files:** create/modify `package.json`, `app.config.ts`, `src/app/_layout.tsx`, `src/app/(auth)/index.tsx`, `src/lib/supabase.ts`, `src/features/account/session.ts`, `src/i18n/en.json`, `src/i18n/ro.json`, `src/ui/theme.ts`, `.env.example`, `supabase/config.toml`, `supabase/migrations/0000_session.sql`, `supabase/tests/session.test.sql`, `tests/helpers/local-users.ts`, `tests/account-shell.test.tsx`, `tests/e2e/auth.spec.ts`, `docs/technical/local-development.md`. Only create files needed by this deliverable; protect existing project documentation during scaffolding.

**Interfaces:** AuthSession { userId:string; locale:"ro"|"en" }; useSession(): AuthSession | null; get_session_context(): AuthSession; set_locale(locale:"ro"|"en"):void. SQL derives the user from auth.uid(). This task owns account access and locale only; Task 2 extends the session with roles/actors. Null means signed out; model loading separately to avoid redirecting during session restoration. ID values are UUID strings. Public methods derive identity from authenticated session; never accept an arbitrary acting-user ID from the client. Domain types are defined with their owning feature and generated database types, not duplicated by later tasks.

**Acceptance test:** `language_persists_and_private_routes_redirect: select ro, restart, expect ro; signed-out /manuscripts redirects; a 900px tablet viewport has no clipped primary action`. SQL `locale_is_owner_scoped` verifies own locale persistence and denial of another account’s update/unauthenticated access. The private /manuscripts route is an authenticated placeholder at this stage.

- [ ] **Step 1:** Bootstrap the minimum Expo/test runner and local Supabase configuration needed to run failing tests. Check Node, Android SDK/emulator or device, Docker and Supabase CLI; document versions/start commands in `docs/technical/local-development.md`. Initialise/start local Supabase and add local-only verified-user fixture helpers. Add `tests/account-shell.test.tsx`, `tests/e2e/auth.spec.ts` and `supabase/tests/session.test.sql`; use real SQL/API for owner-scope assertions. If this checkout has no Git repository, initialise one during coding bootstrap before the first planned commit; preserve existing documentation.
- [ ] **Step 2:** Run `npm test -- --runInBand tests/account-shell.test.tsx` and `supabase test db`; require failures for missing session/locale behavior after runners connect successfully. Tooling or database-start failures do not count as behavioral red tests.
- [ ] **Step 3:** Implement the contract above in the listed owning files. Bootstrap one Expo TypeScript project at repository root without replacing existing brand/docs. Pin a compatible stable SDK/Node combination after checking official release docs; use npm lockfile and Expo-managed native dependency versions. Add jest-expo/component tests, TypeScript checking, ESLint, Playwright web smoke tests, and scripts test/typecheck/lint/test:web. Use Supabase Auth email verification and recovery; store native refresh credentials with SecureStore and web sessions with the SDK browser adapter. Never put a service-role key in EXPO_PUBLIC variables. Start from the existing draft copy in `src/i18n/en.json` and `src/i18n/ro.json` (Romanian pending review) instead of recreating it. Add approved theme/font tokens; manual locale selector before login and persisted account choice afterwards. Migration 0000 owns the minimal profiles row, verified-user self-access policies, get_session_context() and set_locale(); Task 2 extends profiles. Add test:gateway for the local HTTP runner. Document `supabase start`, `supabase db reset`, serving Edge Functions, fixtures and npm commands. Keep local secrets out of public environment variables, shipped code and source control.
- [ ] **Step 4:** Run `npm test -- --runInBand`, `supabase db reset`, `supabase test db`, `npm run test:web -- tests/e2e/auth.spec.ts` and `npm run typecheck`; require PASS. Verify a real Android session/locale flow. Reset must rebuild from numbered migrations and local-only fixtures, not rely on manual database patches.
- [ ] **Step 5:** Review the diff against the spec and commit only this task's files with message `feat: authenticated bilingual react native shell`. No production service creation, paid provider activation or publishing is part of this step.

### Task 2: Role activation and publisher approval

**Files:** create/modify `supabase/migrations/0001_accounts.sql`, `supabase/tests/accounts.test.sql`, `src/features/account/roles.ts`, `src/features/account/actors.ts`, `src/features/account/session.ts`, `src/app/(app)/settings.tsx`, `src/app/(app)/admin/publishers.tsx`. Only create files needed by this deliverable; protect existing project documentation during scaffolding.

**Interfaces:** activate_author():void; request_publisher(name:text):uuid; approve_publisher(publisher_id:uuid):void; get_actor_context():SessionContext. ActorRef {kind:"person"|"publisher";id:string}; SessionContext extends AuthSession {authorEnabled:boolean;publisherId:string|null;permittedActors:ActorRef[]}; internal assert_actor_owned(actor:ActorRef):void; can_receive_submissions(publisher_id:uuid):boolean exposes the approval predicate consumed by plan 02 Task 2, which adds route availability checks. Extend useSession() to SessionContext here. Define actors in `src/features/account/actors.ts`: reader/author share one person actor, publisher has a separate actor. Client workspace selection is never authorization. ID values are UUID strings. Public methods derive identity from authenticated session; never accept an arbitrary acting-user ID from the client. Domain types are defined with their owning feature and generated database types, not duplicated by later tasks.

**Acceptance test:** `roles_are_server_enforced: reader can enable author without changing user ID; unapproved publisher has can_receive_submissions=false (actual submit-RPC denial is tested in plan 02 Task 2); non-admin approve RPC denied; forged role metadata has no authority; unowned person/publisher actor denied; enabling author preserves person actor; switching workspace does not change private manuscript ownership`.

- [ ] **Step 1:** Add the named acceptance test to the listed test file(s), with fixtures for owner, another author, two publishers and administrator when permissions are involved. Assertions must exercise real SQL/API behaviour, not merely mocked SDK calls.
- [ ] **Step 2:** Run `supabase test db` and confirm the test fails for the missing behaviour. For the initial bootstrap only, configure the minimum runner needed to observe this failure before feature implementation.
- [ ] **Step 3:** Implement the contract above in the listed owning files. Extend existing profiles; create publishers(single owner), person/publisher actor identities, publisher_requests, admin membership, blocks and protected contact data. Enable RLS for every exposed table. Keep public profile projection separate from email/phone. Single-owner publisher role can coexist with reader identity; implement the proposed workspace switch using permittedActors. Public content and follow/block edges use ActorRef and server ownership checks on acting-actor mutations. Submissions/files remain person-owned; publisher recipient access derives from ownership. For new-submission block checks compare author person actor and recipient publisher actor. Do not silently extend a publisher block to its administrator’s personal account; broader semantics need a product decision. Admin membership is provisioned by a trusted setup operation, never client-writable. Add confirmation-based author/publisher associations as separate records.
- [ ] **Step 4:** Run `supabase test db`; require PASS. Run `npm run typecheck` and the relevant Android/web smoke flow; database tasks must also pass the existing SQL policy suite. Record physical-device checks when automation cannot prove sensor behaviour.
- [ ] **Step 5:** Review the diff against the spec and commit only this task's files with message `feat: role activation and publisher approval`. No production service creation, paid provider activation or publishing is part of this step.

### Task 3: Core work identity and account lifecycle

**Files:** create/modify `supabase/migrations/0002_works_accounts.sql`, `src/features/works/api.ts`, `src/app/(app)/works/[id].tsx`, `src/features/account/lifecycle.ts`, `supabase/tests/account_lifecycle.test.sql`. Only create files needed by this deliverable; protect existing project documentation during scaffolding.

**Interfaces:** Work { id: string; title: string; ownerId: string | null; isbn: string | null; visibility: "private" | "public" }; createWork(input: {title:string; isbn?:string}): Promise<Work>; requestAccountDeletion(): Promise<void>. ID values are UUID strings. Public methods derive identity from authenticated session; never accept an arbitrary acting-user ID from the client. Domain types are defined with their owning feature and generated database types, not duplicated by later tasks.

**Acceptance test:** `private_work_and_contacts_do_not_leak: other account cannot select private work; export contains only own account/work records at this stage; deletion request revokes user sessions without silently deleting other accounts`.

- [ ] **Step 1:** Add the named acceptance test to the listed test file(s), with fixtures for owner, another author, two publishers and administrator when permissions are involved. Assertions must exercise real SQL/API behaviour, not merely mocked SDK calls.
- [ ] **Step 2:** Run `supabase test db` and confirm the test fails for the missing behaviour. For the initial bootstrap only, configure the minimum runner needed to observe this failure before feature implementation.
- [ ] **Step 3:** Implement the contract above in the listed owning files. Define works and work_author/work_publisher relationships, plus publication entries with explicit attribution. Distinguish public work identity from private file/version and personal library entry. Implement recovery, user-scoped export and deletion-request queue. Do not query future submission/evaluation tables in migration 0002. Extend export in the owning later migrations as these entities arrive; plan 06 Task 2 tests that export contains the requester’s authorized history but no evaluations for other authors. Early export completeness is limited to existing modules. Do not automatically choose historical retention periods: queue reviewed deletion and document retention proposal before destructive processing. Add a reusable block predicate used by later mutations; unblock does not recreate prior follows.
- [ ] **Step 4:** Run `supabase test db`; require PASS. Run `npm run typecheck` and the relevant Android/web smoke flow; database tasks must also pass the existing SQL policy suite. Record physical-device checks when automation cannot prove sensor behaviour.
- [ ] **Step 5:** Review the diff against the spec and commit only this task's files with message `feat: core work identity and account lifecycle`. No production service creation, paid provider activation or publishing is part of this step.

