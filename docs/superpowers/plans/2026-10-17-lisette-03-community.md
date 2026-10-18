# Sharing Approval, Profiles and Community Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or, if the user selects it, superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Deliver the sharing approval, profiles and community slice of Lisette as working, testable software.

**Architecture:** One React Native/Expo TypeScript application for Android and React Native Web, with Supabase Auth, Postgres/RLS and private Storage. Use transactional database functions for multi-record state changes and authenticated file access where immediate revocation is required. These are proposed technical decisions awaiting plan review.

**Tech Stack:** React Native, TypeScript, Expo Router, React Native Web; proposed Supabase; Jest/component tests, SQL policy tests and Playwright where relevant.

**Spec:** [../specs/2026-10-17-lisette-functional-design.md](../specs/2026-10-17-lisette-functional-design.md); detailed approved decisions: `../../product/requirements.md`. Read the master plan for dependencies and technical defaults.

## Global Constraints
- Android phones and tablets first; authenticated web for readers, authors and publishers second; no iOS.
- React Native and TypeScript are the requested application foundation. Expo and React Native Web are proposed tooling, not a replacement for React Native.
- Romanian and English require explicit language choice; preserve exact approved brand wording and diacritics from `brand/brand.yaml`.
- PDF-only manuscripts; no manuscript editor, chat, algorithmic feed, financial features or heatmap.
- Submission email and phone are mandatory and private. An identity-document upload is not required.
- Camera ISBN scan, foreground location unlock and ambient light are the proposed three qualifying sensors; include local biometrics with device-credential fallback too.
- Shared public content requires sign-in. Server permissions, not UI state, govern private data and media.
- Draft technical defaults below are reviewable proposals. They are not already-approved product policies.

## Review Focus
- A previously obtained file reference must fail after withdrawal/rejection: plan 02 file-access tests.
- Concurrent submit/retry and status changes must not duplicate or resurrect submissions: plan 02 transactional tests.
- Edited excerpts and new recipient restrictions must not leak unapproved text: plan 03 approval tests.
- Concurrent unlocks, changed variants and content removal must preserve or revoke the correct entitlement: plan 05 unlock tests.
- Denied permissions, missing sensors and expired login must offer a truthful recoverable path: plans 01, 04, 05 and 06 tests.

### Task 1: Exact-text approval across publishers

**Files:** create/modify `supabase/migrations/0006_sharing.sql`, `src/features/excerpts/api.ts`, `src/app/(app)/author/excerpts/[id].tsx`, `src/app/(app)/publisher/approvals.tsx`, `supabase/tests/sharing.test.sql`. Only create files needed by this deliverable; protect existing project documentation during scaffolding.

**Interfaces:** request_sharing(work_id:uuid,text_version_id:uuid,kind:"synopsis"|"excerpt"): uuid; decide_sharing(request_id:uuid,approved:boolean): void; publish_excerpt(text_version_id:uuid): uuid. Consumes enqueue_event from plan 02 Task 2; each approval/refusal emits one author event with in_app/email channels in its decision transaction. ID values are UUID strings. Public methods derive identity from authenticated session; never accept an arbitrary acting-user ID from the client. Domain types are defined with their owning feature and generated database types, not duplicated by later tasks.

**Acceptance test:** `all_applicable_approvals_required: A approves/B pending -> hidden; withdraw B -> publish allowed; edit text -> old approval invalid; on_hold and selected still restrict; already-public text never silently removed by later submission; repeated sharing decision does not duplicate the durable event`.

- [ ] **Step 1:** Add the named acceptance test to the listed test file(s), with fixtures for owner, another author, two publishers and administrator when permissions are involved. Assertions must exercise real SQL/API behaviour, not merely mocked SDK calls.
- [ ] **Step 2:** Run `supabase test db` and confirm the test fails for the missing behaviour. For the initial bootstrap only, configure the minimum runner needed to observe this failure before feature implementation.
- [ ] **Step 3:** Implement the contract above in the listed owning files. Store immutable excerpt text versions, sharing requests and per-submission decisions; SQL computes applicable restrictions from accepted snapshots. Reject publication lacking any applicable approval. Pending edits keep approved public version unchanged until revised approval/publication. Existing public text is disclosed in submission review; proposed new submissions must explicitly acknowledge its existing public status rather than retrospectively hide it. The accepted snapshot remains effective after selection. Before implementing amendments, approve their product flow explicitly; until then expose no amendment endpoint or setting. The publisher’s current account setting does not rewrite existing submissions. Enforce same gate for manuscript-linked discovery variants; no gate on unrelated artwork.
- [ ] **Step 4:** Run `supabase test db`; require PASS. Run `npm run typecheck` and the relevant Android/web smoke flow; database tasks must also pass the existing SQL policy suite. Record physical-device checks when automation cannot prove sensor behaviour.
- [ ] **Step 5:** Review the diff against the spec and commit only this task's files with message `feat: exact-text approval across publishers`. No production service creation, paid provider activation or publishing is part of this step.

### Task 2: Public profiles and portfolio CRUD

**Files:** create/modify `src/features/profiles/api.ts`, `src/app/(app)/profiles/[id].tsx`, `src/app/(app)/author/portfolio.tsx`, `supabase/migrations/0007_profiles.sql`, `supabase/tests/profiles.test.sql`. Only create files needed by this deliverable; protect existing project documentation during scaffolding.

**Interfaces:** Publication {id:string; authorId:string; kind:"book"|"newspaper"|"magazine"|"anthology"; title:string; outlet?:string; year?:number; url?:string}; confirm_association(association_id:uuid,accept:boolean): void. ID values are UUID strings. Public methods derive identity from authenticated session; never accept an arbitrary acting-user ID from the client. Domain types are defined with their owning feature and generated database types, not duplicated by later tasks.

**Acceptance test:** `profile_preserves_private_data: WIP shows permitted public excerpts only; Inspirations is empty before library exists; repeat with real shared/unshared entries after plan 04 Task 1; pending publisher association absent; author can edit/delete self-reported publication but cannot edit another author`.

- [ ] **Step 1:** Add the named acceptance test to the listed test file(s), with fixtures for owner, another author, two publishers and administrator when permissions are involved. Assertions must exercise real SQL/API behaviour, not merely mocked SDK calls.
- [ ] **Step 2:** Run `supabase test db` and confirm the test fails for the missing behaviour. For the initial bootstrap only, configure the minimum runner needed to observe this failure before feature implementation.
- [ ] **Step 3:** Implement the contract above in the listed owning files. Implement author sections WIP, Recently published, Inspirations, publication portfolio and blog/social links. Until plan 04 Task 1 creates library entries, return empty Inspirations without SQL references to future tables; migration 0009 extends it and owns the final shared/unshared integration check. Publisher profile includes books/authors/calls/events/posts/discoveries as modules become available. Explicit author acceptance precedes public publisher association. Proposed book relationships use creator-maintained metadata and show provenance without automatic verification. Retain approved existing relationships during rejected requests; do not turn manuscript selection into published-work association.
- [ ] **Step 4:** Run `supabase test db`; require PASS. Run `npm run typecheck` and the relevant Android/web smoke flow; database tasks must also pass the existing SQL policy suite. Record physical-device checks when automation cannot prove sensor behaviour.
- [ ] **Step 5:** Review the diff against the spec and commit only this task's files with message `feat: public profiles and portfolio crud`. No production service creation, paid provider activation or publishing is part of this step.

### Task 3: Posts, reactions, comments, reshares and blocking

**Files:** create/modify `supabase/migrations/0008_community.sql`, `src/features/community/api.ts`, `src/app/(app)/feed.tsx`, `src/app/(app)/posts/[id].tsx`, `src/app/(app)/compose.tsx`, `supabase/tests/community.test.sql`. Only create files needed by this deliverable; protect existing project documentation during scaffolding.

**Interfaces:** createPost(actor:ActorRef,input:{text?:string;imageIds?:string[];workId?:string}):Promise<string>; set_reaction(actor:ActorRef,content_id:uuid,kind:text|null):void; set_block(actor:ActorRef,target:ActorRef,blocked:boolean):void; set_follow(actor:ActorRef,target:ActorRef,following:boolean):void. Consumes ActorRef/assert_actor_owned from plan 01 Task 2. Server verifies acting identity. Preserve one reaction per authenticated person/content even when their selected attribution actor changes: use authenticated user ID for reaction uniqueness and store the authorized actor for display. Reader/author share a person actor; publisher attribution uses its separate actor. A workspace switch cannot create an additional reaction on the same content. ID values are UUID strings. Public methods derive identity from authenticated session; never accept an arbitrary acting-user ID from the client. Domain types are defined with their owning feature and generated database types, not duplicated by later tasks.

**Acceptance test:** `community_permissions: one reaction row changes/removes; reshare loses source access when hidden/deleted; blocked users cannot follow/react/comment either direction; explicit work selection groups content and no guessed link is added; forged publisher actor denied; switching workspace never changes original creator identity or creates a second reaction on the same content`.

- [ ] **Step 1:** Add the named acceptance test to the listed test file(s), with fixtures for owner, another author, two publishers and administrator when permissions are involved. Assertions must exercise real SQL/API behaviour, not merely mocked SDK calls.
- [ ] **Step 2:** Run `supabase test db` and confirm the test fails for the missing behaviour. For the initial bootstrap only, configure the minimum runner needed to observe this failure before feature implementation.
- [ ] **Step 3:** Implement the contract above in the listed owning files. Use shared content IDs for ordinary posts and excerpts; owner edit/delete and comments; unique authenticated-user/content reaction with authorized actor attribution; active-actor follow chronological feed with stable created_at/id pagination. Proposed reaction IDs love/okay/dislike, temporary accessible labels until icon design. Proposed limits: text 3000 characters, four images, 5MiB each. Posts need text or one image. Work association is explicitly selected. Enforce blocks server-side for feed/interactions/new submissions; no automatic withdrawal or follow restoration. Use soft deletion for linked content display, not public retained text; filter reshares/search by source visibility. No chat or recommendation pipeline.
- [ ] **Step 4:** Run `supabase test db`; require PASS. Run `npm run typecheck` and the relevant Android/web smoke flow; database tasks must also pass the existing SQL policy suite. Record physical-device checks when automation cannot prove sensor behaviour.
- [ ] **Step 5:** Review the diff against the spec and commit only this task's files with message `feat: posts, reactions, comments, reshares and blocking`. No production service creation, paid provider activation or publishing is part of this step.

