# Lisette functional specification

Status: functional direction approved in conversation on 2026-10-17; consolidated product decisions incorporated. Technical implementation proposals require separate plan review. This document organises confirmed decisions from `../../product/requirements.md`; it does not approve unresolved choices, select a backend or schedule implementation. Approved identity and copy remain in `../../../brand/`.

## 1. Purpose and delivery boundaries

Lisette connects writers, readers and publishers through manuscript discovery, community, personal book collections and literary experiences. Publisher selection leads to direct contact outside Lisette, not an in-app editorial process.

Android phones and tablets are the primary deliverable. Web serves all three audiences and provides a larger-screen manuscript-management and review workspace, with secondary delivery priority. iOS is excluded. The team consists of two people using substantial AI assistance over eight calendar weeks with intermittent availability. A task schedule must reflect actual work capacity, not assume full-time availability or a fixed AI productivity multiplier.

Both Romanian and English are available at launch through explicit language selection, changeable in settings. Manuscript language is independent of interface language. Brand choices, approved wording and warm, calm tone apply across platforms.

Reported assessment: CRUD 5 points, sensors 2 points, complexity 3 points. Three qualifying sensors/capabilities are required; acceptance of the exact set remains to be confirmed.

## 2. Roles and permissions

| Role | Confirmed capabilities | Boundaries |
|---|---|---|
| Reader | Personal library, reviews and ratings, follow, post, react, comment, reshare public content, beta-read when invited, opt into reading patterns, discover events, mark interest/intent, unlock discoveries, report | No private manuscript access |
| Author | Reader capabilities plus author profile, portfolio, manuscript versions, submissions, permitted excerpts for public/followers/beta-reader audiences, own reading patterns (shareable with chosen publishers), events and discoveries | Author activation does not verify identity or ownership |
| Publisher | Public profile, community participation, events/discoveries, submission settings/calls, review and selection | Manual team approval required before receiving submissions; recipient-specific access |
| Administrator | Approve publisher accounts; review reports; hide content or suspend accounts | Moderation is not a legal ruling or blanket permission to read private manuscripts |

People start as readers and activate author features in the same account. One administering user per publisher is confirmed for the first version; multi-user teams are deferred. Application content requires authentication; no signed-out public content pages are planned.

## 3. Functional modules and proposed screen inventory

These screens are a functional grouping, not an approved navigation layout or fixed screen count. Android tablet and web layouts may combine list/detail views.

| Module | Proposed screens or views | Main responsibilities |
|---|---|---|
| Access and settings | Language selection, registration/sign-in, email verification, role activation, settings | Language persistence, account access, author activation |
| Profiles | Reader profile, author profile/portfolio editor, publisher profile/settings, association request | Public presentation; explicitly shared collection items; author confirmation of publisher relationship |
| Manuscripts | Own manuscripts, versions/upload, publisher catalogue, submission composer/review, author tracking/detail | Externally authored file upload; immutable submission versions; per-recipient requirements and consent |
| Publisher workspace | Inbox/status lists, submission reader/detail, evaluation/decision, calls, sharing requests | Authorised review, mandatory evaluation at selection, recipient-specific access and policies |
| Community | Followed feed, post composer/detail, excerpt reader, work page, beta-reader invitations and reader | Chronological feed, text/images, reactions, comments, attributed reshares, explicit work links, excerpt audiences, follower notices |
| Reading patterns | Author excerpt heatmap, reader opt-in setting, share-with-publisher action | Aggregated, opt-in patterns and reading context (motion, noise level) on public excerpts, visible to the author and to publishers the author chooses; 10-reader threshold unless a reader chooses the no-threshold level |
| Personal library | Collection/shelves, ISBN scanner/manual add, book/work detail, review/rating editor | Private defaults, selected public entries, connected people and relevant events, one rating and review per account and work |
| Map and events | Map/filter, event detail/editor, interest/going state | Public event discovery with followed accounts highlighted; external registration links |
| Literary discoveries | Map preview, discovery creator/variants, unlock, personal collection/detail | Text/artwork variants, location-gated initial access, stable assigned variant |
| Notifications | In-app inbox and linked context | Confirmed submission, evaluation and sharing decisions with email counterpart; in-app follower and beta-reader notices |
| Search | Categorized search and result links | Authors, publishers, public books/works and events; authenticated visibility filters |
| Administration | Publisher requests, reports queue/detail, moderation action | Restricted manual approval and moderation |

### 3.1 Public profiles

Authors expose a name or pen name, photo, biography, public posts, permitted excerpts grouped by work, events and self-managed publication portfolio. Portfolio includes books, newspaper/magazine contributions, anthologies and external blog/site/social links. These are author-provided claims without automatic verification.

Dedicated author sections are Work in progress, Recently published and Inspirations, alongside the ordinary private reader library. Private manuscript files, recipients, status, contact details and evaluations are never profile content.

Publisher profiles expose an introduction, associated authors/books, open calls, events, posts and discoveries. An existing Lisette author must confirm a publisher's published-author association before it appears publicly. Selection of a manuscript does not automatically establish a published relationship. Book association confirmation remains open.

### 3.2 Manuscripts and submissions

1. Author prepares the manuscript externally and uploads a PDF version to the private collection. PDF is the only supported manuscript upload format in the first version; reject unsupported or invalid files rather than relying on the filename alone. Lisette does not edit manuscript content.
2. Author discovers approved publishers through search and genre/language/availability filters.
3. In one submission flow, author selects recipients and a manuscript version, completing each recipient's requirements: full manuscript, synopsis, sample, genre and author introduction as configured.
4. Before confirmation, show each recipient's materials, sharing restrictions and disclosure of mandatory email/phone contact; require the rights declaration and agreement. Provide a read-only in-app preview of the selected PDF before sending so the author can check its version.
5. Record independent submissions with immutable submitted versions, recipient-specific policy acceptance and status. Updating a source manuscript cannot change a submitted copy. Preserve successful recipients if others fail, show per-recipient outcomes and retry only unsuccessful recipients without duplicating recorded submissions. Unknown outcomes must be resolved before creating a replacement attempt.
6. Publisher reviews, may place the submission On hold, reject finally or select with a short qualitative evaluation. Selection means interest in direct discussion, not a contract. Other submissions remain unaffected.

Block duplicate active submissions of the same work to the same publisher across submission routes and file versions; point the author to the existing submission. Active for this check includes Submitted, In review, On hold and Selected. After withdrawal or final rejection, resubmission is allowed only if enabled by the publisher setting, applying also to its calls/competitions and their ordinary availability. A permitted resubmission is a new independent record; earlier history is retained.

Each publisher can enable ongoing submissions independently of time-bound calls/competitions. Event creation is separate from opening submissions. Revision requests, manuscript editing, contracts and editorial production are outside scope.

### 3.3 Status and access contract

| Status | Meaning | Publisher file access | Author withdrawal | Sharing restrictions |
|---|---|---|---|---|
| Submitted | Successfully recorded | In-app reading and PDF download | Yes | Accepted policy applies |
| In review | In the publisher's evaluation period; Opened/Unopened is a publisher-only marker | In-app reading and PDF download | Yes | Accepted policy applies |
| On hold / Maybe | Still considering; visible to author | In-app reading; no file download | Yes | Accepted policy applies |
| Selected by publisher | Wants direct discussion; evaluation required | In-app reading and PDF download | Yes | Existing policy remains; changes require author agreement |
| Rejected | Definitive rejection | No future reading or downloads for this submission | Not applicable to active review | This submission no longer restricts sharing |
| Withdrawn | Author withdrew an eligible submission | No future reading or downloads for this submission | Already withdrawn | This submission no longer restricts sharing |

Submission history remains after rejection/withdrawal. Different active submissions retain independent access rights, including to the same file. File access checks must enforce policy, not merely hide buttons. Downloaded copies and content already seen cannot be erased remotely. Reading without a download feature is not a copy-prevention guarantee.

From On hold, the publisher can resume In review, select (with mandatory evaluation), or reject finally. Destination access and sharing rules apply, and each change notifies the author in-app and by email. The author can instead withdraw while On hold.

Withdrawal and publisher blocking are separate. Confirmed blocking behaviour is recorded in section 7. Selected is not final: the author may withdraw it and the publisher may move it to Rejected; no other transition leaves Selected. Any post-selection policy-amendment flow remains unresolved. Resubmission eligibility follows the publisher setting.

### 3.4 Exact-text sharing approval

Publisher settings are author-controlled sharing, synopsis approval only, or synopsis and excerpt approval. Capture the accepted rules at submission; opening a manuscript or moving it On hold cannot introduce new restrictions.

For newly selected synopsis/excerpt text, determine all applicable submissions and collect each required publisher approval before public visibility. Approval covers that exact text, not a different or edited selection. Withdrawal and final rejection remove only their own restrictions; On hold and Selected keep accepted restrictions. Existing public text must be visible to publishers before submission, not silently hidden by new restrictions.

Each shared synopsis or excerpt has an audience: public, followers only, or invited beta-readers. Beta-readers can receive chosen chapters or a page range from a manuscript version, up to the whole manuscript; required publisher approvals apply to that exact selection as to an excerpt. Beta-readers read in the app only, without download, and the author can revoke their access. A narrower audience never bypasses a required approval.

The policy applies to submitted-manuscript excerpts in ordinary publication and location discoveries. Unrelated original artwork is not automatically subject to manuscript restrictions. Removal or permission changes must also be honoured in search, work pages and reshares.

### 3.5 Community and work pages

Readers, authors and publishers publish public text/image posts. The followed feed is chronological. Posts and excerpts share multiple qualitative reaction types; final labels/icons need design; each person has one changeable/removable reaction per content item. Comments apply at post/excerpt level, not paragraph annotations. Reshares can be plain or include commentary and retain original attribution and visibility constraints.

The person posting explicitly selects a related book/work. Lisette does not infer that relationship. Work pages collect linked public posts and permitted excerpts. Unpublished public works do not require ISBNs. Saving the parent work does not grant access to its private manuscript. Private chat, audio/video posts and recommendation feeds are excluded from the first version.

Authors see an aggregated reading-pattern heatmap for their own public excerpts (confirmed 2026-10-18 for the competition version) and may share the patterns of selected excerpts with chosen publishers. Signals are reading position, time, rereads and stopping points, plus reading context from motion sensors and an on-device microphone noise level; audio is never recorded, stored or transmitted. Readers opt in explicitly; collection happens only while the excerpt is open; standard-consent patterns appear only once at least 10 readers opted in, while readers who separately choose the no-threshold level can appear below it; no view ever names readers, including when shared with publishers. Private manuscripts and submitted copies are never tracked. Patterns are not presented as attention, comprehension, quality or an audience score. Only public excerpts are tracked. Retention and opt-out deletion remain to be defined.

Followers receive an in-app notice when a followed author publishes a new excerpt visible to them or adds a publication to their portfolio.

### 3.6 Personal library and discovery

Scan ISBNs or add a book manually; organise into To read, Currently reading and Read. Collections are private by default, with explicit per-entry public sharing. Author Inspirations uses explicitly selected public books, not the whole private library.

A scanned/saved book links to reliably matched Lisette authors and publishers and relevant events. Distinguish events about the book from other events involving its author/publisher. No matching profile or event should be invented. Readers can rate and review a book/work, with one editable, deletable rating and review per account; reviews are reportable public content. Ratings use a 1–5 scale with no average shown; only published books can be rated or reviewed for now. Custom shelves/notes remain undecided.

### 3.7 Events and location discoveries

Authors and publishers create events associated with books and participating profiles. Discover all public events, with followed accounts highlighted and a followed-accounts filter. Interested and Going represent intent, not tickets or proven attendance. Use external registration links; no in-app ticketing.

Discoveries can exist without events. Map previews expose title, creator and hint, not hidden content. A creator supplies multiple text/image variants, including standalone artwork. An eligible reader initially present at the location receives one random variant, assigned persistently for that reader/discovery. Repeated visits do not reroll it. Unlocked variants are available from anywhere in the personal discovery collection; offline downloads and backend storage-retention periods remain undecided. Full removal revokes collection access, while stopping new unlocks preserves existing access.

Participants associated by others must confirm before public listing. Unlock uses an explicit foreground action; no background tracking is planned. Variant edits affect future unlocks only. Proximity thresholds still need design; full removal revokes existing collection access while stopping unlocks preserves it. Sensor-based experiences are optional literary discoveries without points, streaks or ranking pressure.

### 3.8 Notifications and administration

Submission-status changes, added evaluations and approval/refusal of sharing requests generate in-app notifications and email in the person's selected language. Describe confirmed events and combine notices from one decision when appropriate. Followers and beta-readers receive in-app community notices; email and OS push for these are not agreed.

People report accounts, posts, comments, excerpts, events or discoveries with a reason and explanation. Administrators review manually; a report alone does not automatically delete content. Publisher onboarding approval precedes receiving any manuscript.

## 4. Conceptual data relationships

This is a domain inventory, not a database schema or technology selection.

| Concept | Required relationships and distinctions |
|---|---|
| Account / role / profile | Account has language and reader access; author activation; one administering user per publisher; multi-user teams deferred |
| Work / published book reference | Public presentation separate from private manuscript; ISBN optional for unpublished work |
| Manuscript / version | Owned private collection; externally authored immutable versions |
| Submission / submitted materials | Author, recipient publisher, optional call, fixed version/materials, status/history, accepted policy and private contact disclosure |
| Publisher / call / policy | Approval state, ongoing intake flag, call dates/requirements and policy accepted per submission |
| Evaluation | Private to author and recipient submission; selection requires meaningful content |
| Sharing request / decision | Exact content version, author, applicable recipient approvals and decision history |
| Post / excerpt / comment / reaction / reshare | Creator, explicit work association, original source and visibility |
| Reading-pattern consent / aggregate | Reader opt-in state; per-excerpt aggregates without per-reader exposure to the author |
| Beta-reader share | Author, work, manuscript version, page/chapter selection, invited readers, approval state, revocation |
| Review / rating | Account, book/work, one each per pair, edit history, moderation state |
| Follow / library entry / portfolio entry | Account relationships; selected public entries; self-reported publications |
| Author-publisher association | Pending/confirmed relationship; public only after author confirmation |
| Event / participation intent | Creator, place/time, linked books/profiles; separate interest/going intentions |
| Discovery / variant / unlock | Creator/place, preview, private variant assets, persistent per-account assigned variant |
| Notification / report / moderation action | Recipient/event/delivery context or report target/reason/admin action |

## 5. Acceptance criteria for confirmed behaviour

| ID | Observable acceptance condition |
|---|---|
| AC-01 | Choosing Romanian or English persists and can be changed; manuscript-language eligibility is independent. |
| AC-02 | Reader activation of author features retains the same account/library; no identity document is requested. |
| AC-03 | An unapproved publisher cannot receive a direct or competition submission. |
| AC-04 | Authors can preview the selected PDF read-only before sending; uploading a revised manuscript cannot change an already submitted version. |
| AC-05 | A multi-recipient submission validates and displays each recipient's requirements, restrictions and contact disclosure. |
| AC-06 | Missing email, phone, required materials or accepted declaration prevents a submission from being accepted. |
| AC-07 | Selection without a short evaluation fails; selection of one submission does not close others. |
| AC-08 | On hold is visible to the author, permits reading, blocks downloads and remains eligible for author withdrawal. |
| AC-09 | Withdrawn/rejected submissions retain history but deny further manuscript/material access, including a previously obtained retrieval reference. |
| AC-10 | Ending one submission's restrictions does not waive another applicable submission's required approval. |
| AC-11 | An excerpt requiring approval stays private until all required approvals cover its exact text; edits do not inherit approval. |
| AC-12 | Private manuscript/contact/evaluation data never appears in public profiles, search, reshares or work pages. |
| AC-13 | Posts and excerpts support the agreed shared reaction set, comments and attributed public reshares. |
| AC-14 | Content appears on a work page through the posting person's explicit work association, not automatic inference. |
| AC-15 | Scanning/saving a book keeps its library entry private unless explicitly shared; connected events accurately identify the relationship. |
| AC-16 | A publisher-author relationship remains non-public until confirmed by that author. |
| AC-17 | Event discovery includes unfollowed accounts and supports the followed filter; Going does not create a booking. |
| AC-18 | A locked discovery preview does not expose variant content; repeat unlocks retain the same assigned variant. |
| AC-19 | After initial unlock, the collection presents the assigned variant without requiring the reader to remain at the location. |
| AC-20 | Confirmed manuscript events create in-app and email notifications without exposing private data in public views. |
| AC-21 | Reporting queues manual review and does not automatically remove content. |
| AC-22 | Android phone and tablet layouts support the core flows; no manuscript-content editor is presented on Android or web. |
| AC-23 | No reading data is collected from a reader who has not opted in; an author, and any publisher the author shares with, sees standard-consent patterns only once 10 readers opted in, sees below-threshold patterns only from readers who chose the no-threshold level, and never sees names; no audio is recorded; private manuscripts are never tracked. |
| AC-24 | A followers-only excerpt is invisible to non-followers, including in search and reshares; a beta-reader sees only the pages shared with them; a required publisher approval applies to every audience. |
| AC-25 | A reader has at most one rating and one review per book/work and can edit or delete them; reviews can be reported. |
| AC-26 | Following an author produces an in-app notice when that author publishes a new excerpt visible to the follower or adds a publication. |
| AC-27 | The author sees In review but never whether or when the publisher opened the manuscript; the publisher's inbox shows Unopened/Opened. |

Criteria describe future validation; no application exists or has passed these checks yet.

## 6. Delivery dependencies and technical questions

Functional dependency order: accounts/permissions and public work identities; manuscript versions/submission lifecycle and approval; community/library connections; events/map/discoveries; notification/admin integration. Shared identifiers and permissions should support Android and web. This is sequencing guidance, not a task plan or estimate.

Candidate sensor experiences: camera ISBN scanning, location unlocks/event map, ambient-light reading adaptation, motion sensors and microphone noise level for reading context in the heatmap. Device authentication additionally protects local manuscript access. The exact qualifying set, actual test-device availability and detailed adaptive-reading behaviour require confirmation. No feature should infer attention or writing quality from sensor or reading signals. The author reading-pattern heatmap is confirmed (section 3.5); its motion and noise signals describe reading context only.

Before implementation, investigate PDF in-app reading on Android/web, access revocation/file delivery, exact-content approval storage, map/location support, ISBN data coverage and email delivery. React Native is required by the user. Expo, React Native Web and Supabase are technical delivery proposals; backend and tooling approval remains separate from functional approval. Technical choices must be verified against current documentation when evaluated.

Web includes library management, map viewing and viewing unlocked discoveries. ISBN camera scanning and initial location unlock are Android-only in the first version. Other agreed web functions remain in scope; browser sensor parity is not required.

## 7. Consolidated decisions and remaining review


### Blocking
- Blocking hides each account's posts from the other and prevents following, comments and reactions between them. This limits interactions inside Lisette, not information already seen or copied.
- Blocking a publisher prevents new submissions to it but does not automatically withdraw existing submissions. Manage withdrawal separately under the agreed eligibility rules.
- Blocking can be reversed. Restoration of previous follows/reactions is not implied and remains a detailed design choice.

### Event participation and cancellation
- Authors or publishers linked by someone else as event participants must confirm before they appear publicly as participants. The creator's own participation does not require a separate invitation.
- Event creators can modify or cancel events. Notify people marked Interested or Going in-app when an event changes or is cancelled; delivery and grouping details remain implementation design.
- Cancelled events retain a clearly marked Cancelled page instead of silently disappearing.

### Discovery unlocks and updates
- Initial discovery unlock requires an explicit button action while sufficiently close to the location. No background location tracking is required. Define proximity thresholds and location-quality handling during detailed design.
- Creators can stop new unlocks while preserving previously assigned variants in readers' personal collections.
- Variant updates affect future unlocks, not previously assigned variants. Keep the assigned content version stable; this is distinct from a later decision to remove content completely.
- Provide a separate full-removal action for creators and authorised moderators. After explicit confirmation for creator removal, revoke access to the removed text/images in existing unlocked collections as well as blocking future unlocks. Show an unavailable-content explanation instead of the removed content. This is distinct from stopping new unlocks, which preserves existing collections. Previously captured or externally saved copies cannot be revoked.

### Community editing and access
- An account may have one reaction per post or excerpt, change it or remove it. Use the same reaction set on both content types.
- People can edit or delete their own ordinary posts and comments. Excerpt editing must still respect the exact-text approval policy; existing approvals do not automatically cover revised text. The pending-revision presentation remains to be designed.
- Application content requires authentication on Android and web. Public means visible to other eligible signed-in accounts under the relevant policies, not anonymous browsing. No signed-out public content pages are planned. Necessary sign-in/recovery screens are not public content browsing.

### Publisher administration and account lifecycle
- A publisher account has a single administering user in the first version. Multi-user publisher teams are deferred.
- Include password recovery, a request to delete the account and personal-data export. Retention rules for submission history and relationships require a separate design decision; these functions do not promise erasure of copies already downloaded outside Lisette.

### Android sensors and web boundary
- Proposed sensor set (updated 2026-10-18): camera ISBN scanning, location-based discovery unlocks, ambient-light reading adaptation, motion sensors (accelerometer/gyroscope) and microphone noise level for the reading-pattern heatmap. At least three must qualify under the assessment rules and work on the test devices.
- Biometric protection is also included, with the agreed phone PIN/password fallback for manuscript upload confirmation and local private-manuscript unlock. It is additional to the sensor set above, not deferred.
- Web supports library management, map viewing and viewing already unlocked discoveries. ISBN camera scanning and initial discovery unlock are Android-only in the first version. Other agreed web functions, including manuscript management and review, remain in scope.

### Remaining product decision
All consolidated product questions in the latest review batch are approved, including separate stop-unlocks and full-removal actions. Full removal revokes access to previously unlocked content; stopping unlocks preserves it. Remaining items below are detailed design work, not unapproved answers to that batch.

### Detailed design work before implementation
Choose architecture and shared Android/web boundaries, verify PDF reading and access controls, define remaining status transitions, association management, text/file limits, location thresholds and notification handling. Specify account-deletion retention and post-selection permission changes. These must be explicit design proposals, not silently treated as approved product decisions. Preserve the product vision; sequence work around Android-first delivery and actual team availability.

The functional direction has been approved and a technical delivery proposal now exists in `../plans/2026-10-17-lisette-delivery.md`. Review its proposed stack and task-specific decision gates before executing the relevant tasks. Acceptance criteria remain future checks, not claims of completed implementation.
