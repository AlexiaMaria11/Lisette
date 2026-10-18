# Personal Library and Connected Book Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or, if the user selects it, superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Deliver the personal library and connected book discovery slice of Lisette as working, testable software.

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

### Task 1: Private collection and Android ISBN capture

**Files:** create/modify `supabase/migrations/0009_library.sql`, `src/features/library/api.ts`, `src/features/library/IsbnScanner.native.tsx`, `src/features/library/IsbnScanner.web.tsx`, `src/app/(app)/library.tsx`, `tests/library.test.ts`, `src/features/profiles/api.ts`, `supabase/tests/profiles.test.sql`. Only create files needed by this deliverable; protect existing project documentation during scaffolding.

**Interfaces:** LibraryEntry {workId:string;shelf:"to_read"|"reading"|"read";isPublic:boolean}; saveBook(workId:string,shelf:LibraryEntry["shelf"]):Promise<void>; lookupIsbn(isbn:string):Promise<BookMetadata|null>. ID values are UUID strings. Public methods derive identity from authenticated session; never accept an arbitrary acting-user ID from the client. Domain types are defined with their owning feature and generated database types, not duplicated by later tasks.

**Acceptance test:** `library_is_private_and_scans_recover: default isPublic=false; denied camera opens manual path; duplicate scan updates same account/work entry; no ISBN result offers manual add without inventing title`.

- [ ] **Step 1:** Add the named acceptance test to the listed test file(s), with fixtures for owner, another author, two publishers and administrator when permissions are involved. Assertions must exercise real SQL/API behaviour, not merely mocked SDK calls.
- [ ] **Step 2:** Run `npm test -- --runInBand` and confirm the test fails for the missing behaviour. For the initial bootstrap only, configure the minimum runner needed to observe this failure before feature implementation.
- [ ] **Step 3:** Implement the contract above in the listed owning files. Use expo-camera barcode scanning on Android only; manual entry on all platforms. Validate ISBN checksum and debounce duplicate callbacks. Proposed book metadata source Open Library via a bounded backend request; check current API/usage docs before implementation, provide timeout/unavailable fallback and cache by ISBN. Do not merge unrelated works purely by title. CRUD library entries with the three agreed shelves and explicit public switch; extend Inspirations from plan 03 now that library entries exist and rerun `supabase/tests/profiles.test.sql` using real shared/unshared rows; removing an entry does not delete the shared work.
- [ ] **Step 4:** Run `npm test -- --runInBand`; require PASS. Run `npm run typecheck` and the relevant Android/web smoke flow; database tasks must also pass the existing SQL policy suite. Record physical-device checks when automation cannot prove sensor behaviour.
- [ ] **Step 5:** Review the diff against the spec and commit only this task's files with message `feat: private collection and android isbn capture`. No production service creation, paid provider activation or publishing is part of this step.

### Task 2: Book pages linked to people, excerpts and posts

**Files:** create/modify `src/features/works/related.ts`, `src/app/(app)/books/[id].tsx`, `supabase/migrations/0010_book_relations.sql`, `supabase/tests/book_discovery.test.sql`. Only create files needed by this deliverable; protect existing project documentation during scaffolding.

**Interfaces:** get_work_connections(work_id:uuid): {authors:Profile[];publishers:Publisher[];events:LinkedEvent[];excerpts:PublicExcerpt[];posts:Post[]}; LinkedEvent {id:string;relation:"book"|"author"|"publisher"}. This task defines the response contract but returns events:[] without querying future event tables. Plan 05 Task 1 extends the same RPC after creating events and owns the real book-to-event integration check. ID values are UUID strings. Public methods derive identity from authenticated session; never accept an arbitrary acting-user ID from the client. Domain types are defined with their owning feature and generated database types, not duplicated by later tasks.

**Acceptance test:** `work_connections_preserve_visibility: confirmed work-author/publisher links appear; no reliable match gives empty state; private excerpts/posts absent; events is an empty array before event schema exists`. Real event-link assertions belong to plan 05 Task 1. UI fixtures cannot complete that integration gate.

- [ ] **Step 1:** Add the named acceptance test to the listed test file(s), with fixtures for owner, another author, two publishers and administrator when permissions are involved. Assertions must exercise real SQL/API behaviour, not merely mocked SDK calls.
- [ ] **Step 2:** Run `supabase test db` and confirm the test fails for the missing behaviour. For the initial bootstrap only, configure the minimum runner needed to observe this failure before feature implementation.
- [ ] **Step 3:** Implement the contract above in the listed owning files. Use explicit work-author/publisher associations and source identity, not fuzzy automatic public attribution. Offer reviewed/manual linkage when external ISBN metadata cannot reliably match a profile. Show profile/event connections without implying endorsement. Include unpublished public works, permitted excerpt grouping, linked posts and saving parent work. Migration 0010 must not reference nonexistent event tables. Plan 05 Task 1 creates them before extending this RPC and its SQL tests. Controlled UI fixtures are not production records or evidence of completed integration. Custom shelves remain deferred; ratings and reviews are Task 3.
- [ ] **Step 4:** Run `supabase test db`; require PASS. Run `npm run typecheck` and the relevant Android/web smoke flow; database tasks must also pass the existing SQL policy suite. Record physical-device checks when automation cannot prove sensor behaviour.
- [ ] **Step 5:** Review the diff against the spec and commit only this task's files with message `feat: book pages linked to people, excerpts and events`. No production service creation, paid provider activation or publishing is part of this step.

### Task 3: Reviews and ratings

**Dependencies:** Task 2 and plan 03 Task 3 (blocking predicate, soft deletion). Plan 06 Task 2 adds `review` as a report target.

**Files:** create/modify `supabase/migrations/0018_reviews.sql`, `src/features/reviews/api.ts`, `src/app/(app)/books/[id]/review.tsx`, `supabase/tests/reviews.test.sql`. Only create files needed by this deliverable; protect existing project documentation during scaffolding.

**Interfaces:** set_rating(work_id:uuid,value:smallint|null):void; upsert_review(work_id:uuid,body:text):uuid; delete_review(work_id:uuid):void; Review {id:string;workId:string;authorActor:ActorRef;body:string;rating:number|null;updatedAt:string}. ID values are UUID strings. Public methods derive identity from authenticated session.

**Acceptance test:** `one_review_per_reader`: second rating/review from the same account updates instead of duplicating; another account cannot edit or delete it; blocked accounts do not see each other's reviews; a deleted review disappears from the book page; no average is exposed by any RPC; an unpublished work cannot be rated or reviewed.

- [ ] **Step 1:** Add the named acceptance test to the listed test file(s), with fixtures for owner, another author, two publishers and administrator when permissions are involved. Assertions must exercise real SQL/API behaviour, not merely mocked SDK calls.
- [ ] **Step 2:** Run `supabase test db` and confirm the test fails for the missing behaviour. For the initial bootstrap only, configure the minimum runner needed to observe this failure before feature implementation.
- [ ] **Step 3:** Implement the contract above in the listed owning files. Unique (account, work) for ratings and for reviews. Scale 1–5 whole values (confirmed). Show reviews on the book/work page with author attribution; reviews are public content under existing visibility and block rules. Never show an average or sort by rating. Only published books can be rated or reviewed for now (confirmed).
- [ ] **Step 4:** Run `supabase test db`; require PASS. Run `npm run typecheck` and the relevant Android/web smoke flow; database tasks must also pass the existing SQL policy suite. Record physical-device checks when automation cannot prove sensor behaviour.
- [ ] **Step 5:** Review the diff against the spec and commit only this task's files with message `feat: reviews and ratings`. No production service creation, paid provider activation or publishing is part of this step.
