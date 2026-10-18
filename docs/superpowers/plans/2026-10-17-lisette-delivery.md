# Lisette Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or, if explicitly selected by the user, superpowers:subagent-driven-development. Implement the linked plans task-by-task; checkboxes track work.

**Goal:** Build Lisette Android-first for phones/tablets, with a secondary authenticated web application, covering the approved functional specification.

**Architecture:** Proposed single React Native/Expo TypeScript codebase, shared domain logic and Supabase backend. Platform-specific PDF/map/sensor components sit behind narrow feature interfaces; there is no separate web product or microservice fleet. Server-enforced access rules cover manuscript versions, publisher decisions, excerpt approvals and discovery entitlements.

**Tech Stack:** Required React Native; proposed TypeScript, Expo Router, React Native Web, Supabase Auth/Postgres/Storage/Edge Functions; Expo camera/location/light/local-authentication modules. Proposed platform-specific map/PDF adapters need compatibility checks before commitment.

**Spec:** [Functional specification](../specs/2026-10-17-lisette-functional-design.md), approved in conversation; [requirements](../../product/requirements.md) hold detailed decisions. This plan is a proposal for review, not permission to start implementation or purchase services.

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

## Why one shared application

React Native is the user's selected framework. Expo supplies development/build tooling and native module integration; it does not replace React Native. React Native Web reuses components in browsers. Supabase is proposed because relational entities, transactions and access policies fit this product; no backend provider has been approved yet. Alternative: React Native CLI plus a separately managed web toolchain and API; choose it only if an actual native compatibility constraint requires the additional maintenance.

Use one package and feature folders, not a monorepo/package fleet. Database constraints/RLS and a small set of mutation RPCs own business rules. Do not add Redux, an event bus, GraphQL, custom auth or a generic repository layer by default. Query caching may be added only when repeated fetch/state handling makes it worthwhile.

## Repository structure to create during execution

```
src/app/                 # Expo Router routes; thin composition
src/features/           # account, profiles, works, manuscripts, submissions,
                        # excerpts, community, library, map, events, discoveries,
                        # notifications, moderation, reading
src/ui/                 # theme and a small set of shared accessible controls
src/i18n/               # ro/en translation files
src/lib/                # configured Supabase client; no feature business logic
supabase/migrations/    # numbered schema, policies and transactional functions
supabase/functions/     # authenticated media gateway and email worker
supabase/tests/         # real role/permission/state tests
tests/                 # component/unit and browser acceptance tests
docs/technical/        # validated platform decisions and service configuration
docs/testing/          # evidence, real device matrix and demo instructions
```

Types belong to feature modules; generated database types reflect migrations. UI cannot hold authoritative status/permission rules. Use platform suffixes for actual native/web differences, not duplicate feature implementations.

## Proposed defaults requiring review, not another questionnaire

- Supabase in an available EU region; local Supabase CLI development before external provisioning.
- Email/password with verified email; a single publisher owner and explicit workspace switch.
- PDF limit 20MiB; selection evaluation at least one meaningful field, total limit 2000 characters.
- Resubmission disabled until a publisher enables it. Selected is not terminal: author withdrawal and publisher rejection allowed (confirmed 2026-10-18).
- Discovery initial radius 100m, location accuracy <=50m, sample <=30s old; test/tune on actual devices, no claim of spoof-proof presence.
- Auto-reading theme opt-in, below 20lx dark / above 50lx light, 2-second settling; manual override and unsupported-sensor fallback.
- Reading-pattern threshold 10 readers for standard consent plus a separate no-threshold consent level (confirmed); paragraph segments; motion still/moving and noise quiet/moderate/loud buckets; no retention period until decided. Rating scale 1–5, no average shown, published books only (confirmed). Beta-reader read-only, revocable access (confirmed).
- Reaction IDs love/okay/dislike; final wording/icons in UI design. Post limit 3000 characters/four images/5MiB each.
- No silent retroactive hiding of public excerpts. Submission flow discloses public selections and captures agreement. Post-selection amendments require explicit author acceptance, but their flow is unresolved; keep accepted snapshots and expose no amendment action until designed and approved.
- Account deletion is a reviewed request until history retention is designed. Do not invent legal retention periods or silently hard-delete cross-account history.

## Decision gates and shared contracts

- **Before foundation:** review proposed Expo/React Native Web/Supabase tooling and local setup. Documentation repair does not approve the stack, app implementation or service purchases.
- **Before policy amendments:** agree the post-selection flow and existing-public-text treatment. Preserve accepted snapshots meanwhile; no unilateral update or implicit amendment workflow.
- Proposed ActorRef {kind:"person"|"publisher";id:string} and server ownership checks are defined in plan 01 Task 2. Reader/author share a person actor; publisher content uses a separate actor. Private manuscript ownership remains person-account scoped.
- Plan 02 Task 2 creates the durable event contract before producers use it; plan 06 adds delivery. Do not call a later migration’s helper or reference nonexistent tables.

## Delivery sequence and two-person ownership

| Order | Plan | Suggested owner | Testable result |
|---|---|---|---|
| 1 | [Foundation and Accounts](2026-10-17-lisette-01-foundation.md) | Person A backend + Person B UI | Complete the foundation and accounts acceptance tests |
| 2 | [Manuscripts and Publisher Review](2026-10-17-lisette-02-manuscripts.md) | Person A backend + Person B UI | Complete the manuscripts and publisher review acceptance tests |
| 3 | [Sharing Approval, Profiles and Community](2026-10-17-lisette-03-community.md) | Person B feature UI + Person A policies | Complete the sharing approval, profiles and community acceptance tests |
| 4 | [Personal Library and Connected Book Discovery](2026-10-17-lisette-04-library.md) | Person B feature UI + Person A policies | Complete the personal library and connected book discovery acceptance tests |
| 5 | [Events, Literary Discoveries and Sensors](2026-10-17-lisette-05-map.md) | Person B feature UI + Person A policies | Complete the events, literary discoveries and sensors acceptance tests |
| 6 | [Notifications, Moderation and Delivery](2026-10-17-lisette-06-integration.md) | Person A backend + Person B UI | Complete the notifications, moderation and delivery acceptance tests |

Do not split the team into isolated frontend/backend projects. Agree each feature's contract first, then one person owns its migration/policy while the other implements the corresponding screen using fixtures until integrated. Only one person edits a given migration/task branch at once. Use separate branches/worktrees in the existing Git repository.

The delivery window is eight calendar weeks with intermittent availability. Calendar targets are checkpoints, not estimates of full-time availability:
- Week 1: foundation and real-device PDF/auth/sensor compatibility checks.
- Weeks 2–3: submissions/review and sharing approval; community/profile work can proceed after work/account IDs settle.
- Weeks 4–5: library-to-person/event discovery, map, location surprises and adaptive reading; integrate notifications/admin continuously.
- Week 6: complete missing agreed flows on Android; stabilise web workspace and shared routes.
- Weeks 7–8: actual device testing, permissions/CRUD evidence, bug fixing, demo and reviewable artifacts.

At each checkpoint record completed tasks and remaining work sessions. If the schedule slips, discuss sequence/tradeoffs with the user instead of silently dropping agreed features. No budget or AI speed multiplier is assumed.

## Task dependencies and verification gates

| Task | Prerequisite | Independently verifiable result |
|---|---|---|
| 01.1 shell | Stack review/local tools | Session schema 0000, bilingual authentication, real session tests; no role dependency |
| 01.2 roles | 01.1 | Profile extension 0001, actor contract, publisher approval |
| 01.3 works | 01.2 | Work identity/account lifecycle 0002; export covers existing modules, extended in later owning migrations |
| 02.1 owner PDF | 01.3 | Owner-only gateway/preview, biometric adapter, HTTP/device checks; non-owner requests denied |
| 02.2 submissions | 02.1 | Schema 0004, per-recipient transactions, durable event contract |
| 02.3 review | 02.2 | Schema 0005, recipient authorization, real HTTP revocation and viewer checks |
| 03.1–03.3 sharing/profiles/community | 02.3 and actor contract | Approved text, public content, explicit identity; Inspirations integration waits for 04.1 |
| 03.4 audiences/beta | 03.1–03.3 | Followers-only excerpts, page-limited beta shares through the gateway |
| 03.5 reading patterns | 03.4 and settings | Opt-in aggregate heatmap, publisher sharing, Android motion/noise context |
| 04.1 library | 01.3 and profile/content contracts | Private collection, ISBN/manual entry; completes Inspirations tests with real rows |
| 04.2 connections | 04.1 and 03.1–03.3 | People/content connections; events:[] without future-schema references |
| 04.3 reviews | 04.2 and 03.3 block predicate | One rating and review per account/work |
| 05.1 events/map | 04.2, actor/event contracts | Creates event tables before extending connections; actual book-to-event SQL tests |
| 05.2 discoveries | 05.1 and sharing approvals | Stable entitlements, private variants, removal checks |
| 05.3 adaptation | 02.1 existing device-auth adapter | Ambient theme, expanded device checks; no duplicate biometric implementation |
| 06.1 delivery | 02.2 durable events; all producers for final tests | Worker delivers earlier events and retries |
| 06.2 moderation | Existing content/roles | Restricted administration and visibility |
| 06.3 search | Profiles, works, events and 06.2 | Categorized authenticated search and privacy/navigation tests |
| 06.4 release | All feature integration gates | Phone/tablet/web evidence and reviewable builds |

Fixture-only UI checks may run early but cannot complete database/cross-feature gates. Create SQL functions after referenced tables exist. Plan 03.2 returns empty Inspirations until 04.1; migration 0009 then extends that projection and completes its shared/unshared integration test. Run local `supabase db reset` at each migration gate to prove a clean ordered rebuild, not only an already-patched developer database.

## Early compatibility gates

- [ ] In 02.1 prove owner PDF preview on Android phone/tablet/web with authenticated delivery and lock/logout checks. In 02.3, after submission/review schema exists, prove subsequent gateway denial after revocation and viewer access handling. These are separate gates; bytes already received cannot be retracted, and disabling downloads is not DRM.
- [ ] Prove a development APK can access biometrics/device credential, location and ambient light on available test hardware. Missing hardware must be documented before counting sensor points.
- [ ] Verify maps provider and email service configuration, keys, terms and anticipated cost; use local fixtures/mail sink until accounts are configured.
- [ ] Check and pin a compatible Expo SDK/native package/Node set, not a floating latest version copied from this dated plan.

Do not claim hard immediate revocation using client-issued long-lived signed URLs. Keep the bucket private, require current gateway authorisation and clear active viewer caches when access ends. Already downloaded/seen bytes cannot be retracted; expose this limitation honestly.

## Coverage and acceptance

| Specification | Owning plan |
|---|---|
| AC-01..03: language, roles, publisher approval | 01 |
| AC-04..09: PDF versions, batch submission, evaluation and access | 02 |
| AC-10..14, AC-16: approval, private visibility, reactions, explicit work links, associations | 03, with 01/02 role policies |
| AC-15: private library and reliable book/event discovery | 04 + 05 event relations |
| AC-17..19: events, stable unlock and collection | 05 |
| AC-20..21: notifications and manual moderation | 06 |
| AC-22: phone/tablet/web and no editor | All UI tasks; final 06 matrix |
| AC-23: opt-in aggregate reading patterns | 03 Task 5 |
| AC-24: excerpt audiences and beta-reader shares | 03 Task 4 |
| AC-25: reviews and ratings | 04 Task 3 |
| AC-26: follower notices | 03 Tasks 1, 2, 4 producers; 06 Task 1 delivery |
| AC-27: publisher-only opened marker | 02 Task 3 |
| Later consolidated decisions: blocks, event cancellation, full discovery removal, editing, single reaction, login-only, account lifecycle, extra biometrics and web boundaries | 01 + 03 + 05 + 06 |
| Confirmed categorized author/publisher/book/event search | 06 Task 3; SQL privacy and browser navigation tests |

CRUD evidence should demonstrate create/read/update/delete on self-owned posts, library entries and events without treating deletion of immutable submission history as required CRUD. Protect comment/referral/reshare privacy after deletions.

## Verification commands at execution

The foundation task creates the npm scripts; they do not exist yet. Expected checks: `npm run typecheck`, `npm run lint`, `npm test -- --runInBand`, `supabase test db`, `npm run test:gateway -- tests/integration/manuscript-file.test.ts`, `npm run test:web`, `npx expo export --platform web`, and an installed Android development/release APK on phone/tablet. Automated checks complement physical sensor testing. Every meaningful feature task observes a failing test before its implementation, then the relevant suite passes.

## Documentation self-review

Documentation coverage maps all 27 acceptance criteria, consolidated decisions and categorized search to owning tasks. Dependencies distinguish early compatibility from later real integration; SQL, HTTP, UI and device evidence are separate. Actors and durable event producers have explicit contracts. Stack approval and policy amendments remain visible gates. This is a documentation assessment, not evidence of working software or compatible libraries. No app, tests, migrations, hosting or paid service has been created by writing or repairing this plan.

## Official references checked for the proposal

- React Native reuse in browsers: https://docs.expo.dev/workflow/web/
- Expo Router: https://docs.expo.dev/router/introduction/
- Postgres row-level security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Storage access: https://supabase.com/docs/guides/storage/security/access-control
- Camera: https://docs.expo.dev/versions/latest/sdk/camera/
- Foreground location: https://docs.expo.dev/versions/latest/sdk/location/
- Android light sensor: https://docs.expo.dev/versions/latest/sdk/light-sensor/
- Local biometric authentication: https://docs.expo.dev/versions/latest/sdk/local-authentication/

Recheck provider/library-specific choices when implementing; PDF/map adapters are compatibility proposals rather than claims of completed validation.

## Execution handoff

Review this master plan and the linked task plans before implementation. Recommended execution is native/inline, one module at a time, because the initial data and authorisation contracts are tightly coupled. Subagent-driven execution is an option only if the user selects it. No automatic merge, publishing or deployment is authorised by this document.
