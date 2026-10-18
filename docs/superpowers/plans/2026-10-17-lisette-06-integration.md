# Notifications, Moderation and Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or, if the user selects it, superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Deliver the notifications, moderation and delivery slice of Lisette as working, testable software.

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

### Task 1: Transactional notifications and bilingual email

**Files:** create/modify `supabase/migrations/0013_notifications.sql`, `supabase/functions/send-notifications/index.ts`, `src/features/notifications/api.ts`, `src/app/(app)/notifications.tsx`, `supabase/tests/notifications.test.sql`. Only create files needed by this deliverable; protect existing project documentation during scaffolding.

**Interfaces:** Consumes domain_events and internal enqueue_event(kind:text,subject_id:uuid,event_key:text,recipient_ids:uuid[],channels:text[]):void from plan 02 Task 2. Produces trusted-service-only process_notification_outbox(limit:number):{sent:number;failed:number}; not a public client RPC. Migration 0013 adds delivery/in-app records and worker state, not the existing producer table/helper. ID values are UUID strings. Public methods derive identity from authenticated session; never accept an arbitrary acting-user ID from the client. Domain types are defined with their owning feature and generated database types, not duplicated by later tasks.

**Acceptance test:** `outbox_is_idempotent: selection+evaluation creates one combined notice; retry does not duplicate in-app record; email failure retains retryable event without reverting submission; payload contains only recipient-authorised detail; a followers-only `author_published` event reaches current followers only`.

- [ ] **Step 1:** Add the named acceptance test to the listed test file(s), with fixtures for owner, another author, two publishers and administrator when permissions are involved. Assertions must exercise real SQL/API behaviour, not merely mocked SDK calls.
- [ ] **Step 2:** Run `supabase test db` and confirm the test fails for the missing behaviour. For the initial bootstrap only, configure the minimum runner needed to observe this failure before feature implementation.
- [ ] **Step 3:** Implement the contract above in the listed owning files. Consume existing durable events, including pending events from before worker setup; add delivery records with unique event/recipient/channel, selected locale at dispatch and stable message IDs. SMTP/email provider and hosting costs require explicit setup at execution; prepare local mail sink first. Provider-level idempotency if available, otherwise document possible email duplicate after uncertain network outcome. Email includes minimal content and authenticated deep link, not full manuscript/contact data. In-app+email for manuscript events; in-app event edits/cancellation; in-app only for `author_published` follower notices and `beta_shared` invitations produced in plan 03. No OS push requirement. Bound retry/backoff and surface exhausted deliveries to admins.
- [ ] **Step 4:** Run `supabase test db`; require PASS. Run `npm run typecheck` and the relevant Android/web smoke flow; database tasks must also pass the existing SQL policy suite. Record physical-device checks when automation cannot prove sensor behaviour.
- [ ] **Step 5:** Review the diff against the spec and commit only this task's files with message `feat: transactional notifications and bilingual email`. No production service creation, paid provider activation or publishing is part of this step.

### Task 2: Reporting, administrative access and end-to-end privacy

**Files:** create/modify `supabase/migrations/0014_moderation.sql`, `src/app/(app)/admin/reports.tsx`, `src/features/moderation/api.ts`, `supabase/tests/moderation.test.sql`, `tests/e2e/privacy.spec.ts`. Only create files needed by this deliverable; protect existing project documentation during scaffolding.

**Interfaces:** report_content(target_type:text (including `review`),target_id:uuid,reason:text,details:text):uuid; moderate_report(report_id:uuid,action:"dismiss"|"hide"|"suspend"):void. ID values are UUID strings. Public methods derive identity from authenticated session; never accept an arbitrary acting-user ID from the client. Domain types are defined with their owning feature and generated database types, not duplicated by later tasks.

**Acceptance test:** `manual_moderation_only: report queues without hiding; non-admin mutation fails; hiding source also hides reshares/search; suspended account cannot mutate private/public data; admin report read does not grant file gateway access; completed account export excludes other authors’ private evaluations`.

- [ ] **Step 1:** Add the named acceptance test to the listed test file(s), with fixtures for owner, another author, two publishers and administrator when permissions are involved. Assertions must exercise real SQL/API behaviour, not merely mocked SDK calls.
- [ ] **Step 2:** Run `supabase test db` and confirm the test fails for the missing behaviour. For the initial bootstrap only, configure the minimum runner needed to observe this failure before feature implementation.
- [ ] **Step 3:** Implement the contract above in the listed owning files. Implement authorisation-restricted report queue, manual actions/audit and publisher approval workspace. Proposed suspension denies login-protected app actions and current-token privileged mutations; detail treatment of active submissions before enabling production suspension. Full discovery removal uses the same entitlement revocation. Finish account-deletion request review and export from plan 01; assert the completed export contains only requester-authorized history and never another author’s private evaluation; present a retention proposal before destructive processing. Keep operational review distinct from legal ownership adjudication.
- [ ] **Step 4:** Run `supabase test db`; require PASS. Run `npm run typecheck` and the relevant Android/web smoke flow; database tasks must also pass the existing SQL policy suite. Record physical-device checks when automation cannot prove sensor behaviour.
- [ ] **Step 5:** Review the diff against the spec and commit only this task's files with message `feat: reporting, administrative access and end-to-end privacy`. No production service creation, paid provider activation or publishing is part of this step.

### Task 3: Categorized authenticated search

**Dependencies:** Profiles/public works, publisher catalogue, events and Task 2 moderation visibility exist. Search is an approved requirement.

**Files:** create/modify `supabase/migrations/0015_search.sql`, `supabase/tests/search.test.sql`, `src/features/search/api.ts`, `src/app/(app)/search.tsx`, `tests/e2e/search.spec.ts`.

**Interfaces:** search_catalogue(query:text,category:"all"|"authors"|"publishers"|"works"|"events",limit:integer,offset:integer): {authors:SearchHit[];publishers:SearchHit[];works:SearchHit[];events:SearchHit[]}; SearchHit {id:string;label:string}. Derive identity from session. Proposed technical defaults: bounded Postgres case-insensitive search, trimmed query 2–100 characters, default 20/max 50 results per category, stable label/id ordering. No external search service.

**Acceptance tests:** `search_is_categorized_and_private` finds matching public unpublished work, author, publisher and event in their categories; signed-out access denied; private works/library entries/manuscripts/contacts/evaluations/pending associations, followers-only excerpts for non-followers, beta shares and moderated content absent. `search_links_to_existing_views` opens each category’s result and shows truthful empty/loading/failure states.

- [ ] **Step 1:** Add SQL visibility tests in `supabase/tests/search.test.sql` and real local browser navigation tests in `tests/e2e/search.spec.ts`.
- [ ] **Step 2:** Run `supabase test db` and `npm run test:web -- tests/e2e/search.spec.ts`; confirm missing search behavior fails.
- [ ] **Step 3:** Implement RPC, typed client and screen using existing visibility/association rules and public projections. Apply actor-based block predicates wherever underlying content rules require them. Add a signed-in navigation entry point; publisher intake filters remain separate.
- [ ] **Step 4:** Run both commands again plus `npm run typecheck`; require PASS and manually verify Android phone/tablet navigation.
- [ ] **Step 5:** Review against search requirements and commit only this task’s files with message `feat: categorized authenticated search`.

### Task 4: Cross-platform regression and reviewable release artifacts

**Files:** create/modify `tests/e2e/manuscripts.spec.ts`, `tests/e2e/discovery.spec.ts`, `docs/testing/acceptance.md`, `docs/testing/crud-evidence.md`, `docs/testing/demo.md`, `.github/workflows/checks.yml`. Only create files needed by this deliverable; protect existing project documentation during scaffolding.

**Interfaces:** npm scripts: test, typecheck, lint, test:web; SQL policy suite: supabase test db; build artifacts: Android APK and authenticated web export. ID values are UUID strings. Public methods derive identity from authenticated session; never accept an arbitrary acting-user ID from the client. Domain types are defined with their owning feature and generated database types, not duplicated by later tasks.

**Acceptance test:** `release_matrix: all AC-01..AC-27 and consolidated decisions traced to tests/manual checks; create/read/update/delete for posts/library/events/reviews; at least three qualifying sensors plus biometrics physically demonstrated; PDF old-reference denial checked after status changes`.

- [ ] **Step 1:** Add the named acceptance test to the listed test file(s), with fixtures for owner, another author, two publishers and administrator when permissions are involved. Assertions must exercise real SQL/API behaviour, not merely mocked SDK calls.
- [ ] **Step 2:** Run `npm run test:web` and confirm the test fails for the missing behaviour. For the initial bootstrap only, configure the minimum runner needed to observe this failure before feature implementation.
- [ ] **Step 3:** Implement the contract above in the listed owning files. Run typecheck, meaningful Jest/component tests, SQL permission/concurrency tests, Playwright authenticated web flows, Android phone/tablet manual flows and release build install. Add Android automation only for stable core paths after development build works. Web export must not include secrets or static protected payloads. Demo accounts/publishers clearly labelled fictional; do not enable automated demo status changes in production data. Document untested devices, missing service credentials and costs honestly. Prepare reviewable APK/web artifact locally or in configured CI; publishing or production deployment is a separate action, not implicit plan execution.
- [ ] **Step 4:** Run `npm run test:web`; require PASS. Run `npm run typecheck` and the relevant Android/web smoke flow; database tasks must also pass the existing SQL policy suite. Record physical-device checks when automation cannot prove sensor behaviour.
- [ ] **Step 5:** Review the diff against the spec and commit only this task's files with message `feat: cross-platform regression and reviewable release artifacts`. No production service creation, paid provider activation or publishing is part of this step.

