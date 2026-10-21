# 03 Sharing, profiles and community

Owners: Person B (03.2, 03.3), Person A (03.1, 03.4, 03.5). Read the [delivery plan](2026-10-17-lisette-delivery.md) rules first. Tables: database design §7 and `lisette-schema.html`, module "Comunitate și partajare" and "Heatmap de citire". Requirements: Sharing Policy, Public Author Profile and Portfolio, Public Publisher Profile, Community Scope, Reading Patterns.

### 03.3 Posts, reactions, comments, follows (B)

- **Needs:** 01.2.
- **Builds:** chronological feed of followed accounts, post composer (text and/or up to four images), post page, comments with replies, one reaction per account per content, attributed reshares with an optional comment, follow and unfollow for persons and publications. Owners edit and soft-delete their posts and comments.
- **Tables:** `contents`, `posts`, `post_images`, `reactions`, `comments`, `follows`.
- **Functions:** `create_post({text?, imageIds?, workId?, reshareOf?}) → uuid`, `set_reaction(content_id, kind | null)`, `add_comment(content_id, parent_id?, body)`, `set_follow(target_id, following)`; feed paginated by `(created_at, id)`.
- **Rules:** `work_id` only when the author picks it, never guessed. Blocks (`is_blocked`) stop following, comments and reactions both ways and hide posts. A reshare shows nothing once its source is deleted, hidden or no longer visible. Limits: text 3000, four images, 5 MiB each (proposals). Reaction IDs love / okay / dislike; labels and icons come from design.
- **Acceptance:** `community_permissions`: a reaction changes and is removed as one row; a reshare loses its source when the source is hidden or deleted; blocked accounts cannot follow, react or comment either way; no work link is added unless chosen; a client cannot create content for another account.

### 03.2 Profiles and portfolio (B)

- **Needs:** 03.3.
- **Builds:** person profile (name or pen name, photo, bio, links, posts, events); author sections Work in progress, Recently published, Inspirations; portfolio editor; publication profile (intro, kind, profile genres, confirmed authors and books, open calls, posts, events, discoveries); association request from a publication and confirmation by the author.
- **Tables:** `portfolio_entries`, `author_publisher_associations`.
- **Functions:** `save_portfolio_entry(...)`, `delete_portfolio_entry(id)`, `propose_association(author_id)` (publication), `confirm_association(id, accept)` (author). A new portfolio entry emits `author_published` to followers.
- **Rules:** Work in progress = the author's works with `visibility = public` and `is_published = false`, plus their permitted excerpts (empty until 03.1 merges). Inspirations = public library entries marked as inspiration (empty until 04.1 merges, then add the real-row test). Never show files, submissions, contacts, evaluations or pending associations.
- **Acceptance:** `profile_preserves_private_data`: WIP shows only permitted excerpts; a pending association is absent; an author edits and deletes their own portfolio entry but not someone else's.

### 03.1 Exact-text approvals and publisher quotes (A)

- **Needs:** 02.3 and 03.3.
- **Builds:** authors share a synopsis or excerpt of their work. Publications share quotes as previews, choosing the source: a book confirmed as theirs in `work_publishers` (no approval), or a manuscript submitted to them while the submission is active (the author approves the exact text first). Approval inbox for publications and for authors.
- **Tables:** `excerpts`, `text_versions`, `sharing_requests`, `sharing_decisions`.
- **Functions:** `create_excerpt(work_id, share_kind, source, submission_id?, body, audience) → uuid`, `request_sharing(text_version_id) → uuid` (creates one decision row per active submission whose accepted policy covers the kind, excluding the requesting publication), `decide_sharing(request_id, submission_id, approved)`, `author_decide_quote(request_id, approved)`, `publish_excerpt(text_version_id)` (emits `author_published` to the creator's followers).
- **Rules:** publish only when every required decision is approved (and the author's, for a received-manuscript quote). Editing creates a new text version that needs fresh approval; the approved public version stays visible meanwhile. Withdrawal or rejection of a submission ends its restrictions; on_hold and selected keep them. A new submission never hides text already public. Every decision emits one event to the requester (in-app and email).
- **Acceptance:** `all_applicable_approvals_required`: A approves and B is pending → hidden; withdraw B → publish allowed; edited text → old approval does not apply; on_hold and selected still restrict; already public text is not hidden by a later submission; repeating a decision does not duplicate the event. `publisher_quote_rules`: an own-book quote needs a confirmed `work_publishers` row; a received-manuscript quote is hidden until the author approves, and is impossible without an active submission to that publication.

### 03.4 Excerpt audiences and beta-readers (A)

- **Needs:** 03.1.
- **Builds:** audience per excerpt (everyone or followers); beta shares of chosen page ranges from one version, sent to invited readers who accept first; read in the app only, revocable by the author.
- **Tables:** `beta_shares`, `beta_share_readers`.
- **Functions:** `set_excerpt_audience(excerpt_id, audience)`, `create_beta_share(work_id, version_id, page_ranges, reader_ids) → uuid`, `respond_beta_invite(share_id, accept)`, `revoke_beta_share(share_id, reader_id?)`. The gateway gains purpose `beta_read` and serves a derived PDF with only the granted pages. Each invitation emits an in-app `beta_shared` event.
- **Rules:** a beta share needs the same publisher approvals as an excerpt. Followers-only and beta content never appear in search, reshares or public work pages for others.
- **Acceptance:** `audiences_respect_access`: a followers-only excerpt is hidden from a non-follower in feed, work page, reshare and search; unfollowing removes access; a pending approval blocks a beta share; a beta-reader gets only the granted pages; a non-invited account gets 403; revocation makes an old reference fail; a beta download request is denied.

### 03.5 Opt-in reading patterns (A)

- **Needs:** 03.4.
- **Builds:** consent setting (off, standard, no threshold; plus noise permission), session recording on public excerpts while open in the foreground, the author heatmap (single hue Paper to Burgundy, text labels, copy rules in `brand/voice.md`, no scores), sharing an excerpt's patterns with chosen publications.
- **Tables:** `reading_consents`, `reading_sessions`, `pattern_shares`.
- **Functions:** `set_reading_pattern_consent(level, noise)`, `record_reading_session(excerpt_id, text_version_id, segments, stop_segment?, context)`, `get_excerpt_patterns(excerpt_id)` (aggregate only), `share_excerpt_patterns(excerpt_id, publisher_id, shared)`.
- **Rules:** segments are paragraphs of the exact text version. Standard sessions count only from 10 consenting readers; no-threshold sessions count at any size. No reader identity ever leaves the database. Motion is reduced on the phone to still/moving; noise to quiet/moderate/loud. Before building noise, verify an Android API that gives the input level without writing audio to storage and record it in `docs/technical/reading-context.md`; if only a temporary recording is possible, stop and ask. No retention period until decided.
- **Acceptance:** `patterns_are_opt_in_and_aggregate`: without consent nothing is stored; below 10 readers the author gets `belowThreshold` unless no-threshold readers exist, then only theirs; results carry no reader IDs; a publication sees patterns only while shared; followers-only, beta, manuscripts and submissions cannot be recorded; opting out stops new sessions; denied microphone still records position with noise empty. Device check: no audio file exists after a session.
