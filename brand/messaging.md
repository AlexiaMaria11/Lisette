# Messaging Framework

> Built from `context.md`, `audience.md`, `positioning.md` and `voice.md`. Romania is the first market, with Romanian and English available from launch. Existing English copy is reference material; Romanian interface and campaign copy still need to be developed and reviewed; the Romanian tagline below is approved. Preserve meaning and tone rather than translating word for word. Proof points are **planned capabilities, subject to final release scope**, not live results (Lisette is pre-launch). Don't publish a claim until the feature works. Publishers are simulated in the competition prototype, so don't claim real publisher partners.

## 01 — Core Message

**Approved central promise — Romanian (2026-10-17):**
> Am creat Lisette deoarece credem cu tărie că poveștile sunt menite să fie auzite. De aceea, Lisette îi aduce pe scriitori mai aproape de editurile care le pot da o șansă și de cititorii care se vor regăsi în paginile lor.

This is the canonical Romanian promise. The existing English message below is working reference copy, not an approved translation of this promise. The promise describes connection and opportunity, not guaranteed publication.


*"Lisette helps writers get their work read and readers help the authors they love get found, by bringing both together in one place."*

## 02 — Value Proposition

Lisette is a literary hub connecting writers, readers and publishers as equally important participants. Writers send a manuscript once, track every reply, and connect with readers through shared excerpts. Readers build a shelf, follow the authors they love, and read new pages early. Publishers discover authors, review submissions and connect with their community. Each group contributes to the shared literary space, and full manuscripts stay private to selected publishers, while authors choose which excerpts to share with readers, subject to any submission restrictions they have explicitly accepted (see `../docs/product/requirements.md`, Confirmed Sharing Policy).

## 03 — Taglines

**Approved Romanian tagline (2026-10-17):**
*"Unde editurile își găsesc autorii, iar cărțile, cititorii."*

**Approved English tagline:**
*"Writers find their way. Readers find their writers."*

Use the tagline matching the communication language. The Romanian expression emphasizes discovery and possibility through publisher-author and book-reader connections. Neither tagline guarantees acceptance or publication. The two are intentionally localized expressions, not literal translations.

### Earlier English options and supporting phrases

Historical explorations only: these are not additional approved taglines. Use the approved language-specific tagline above by default.

| Tagline | Style | Rationale |
|---|---|---|
| **Writers find their way. Readers find their writers.** | Emotional / functional | Two parallel halves: the writer finds a path to publishers and readers, the reader finds the author they will love. Covers both sides and the connection between them. |
| **Find your way. Find your writer.** | Emotional (short form) | Earlier short-form idea; not the approved default. |
| **Where every book finds its people.** | Emotional | Speaks to both sides at once and is warm without hype, but doesn't name the writer's journey or the reader's discovery. |
| **Where writers and readers meet.** | Functional | The plainest statement of the positioning. Earlier descriptor idea; not the approved default. |
| **Write it. Read it. Pass it on.** | Aspirational / light | Rhythmic, covers writing, reading and sharing, and suggests readers spreading the word. |
| **Books are better together.** | Warm / witty | Captures the interdependence and fits the casual, bookish tone. |
| **From first draft to first readers.** | Functional | Clear about the journey, but leans toward writers. Use mainly in writer-facing copy. |

**English usage:** use the approved English tagline by default. Earlier short forms, descriptors and alternatives above remain reference ideas, not additional approved slogans. Audience-specific campaign copy can focus on its intended audience.

## 04 — Messaging Hierarchy

**Level 1: Brand headline**
- Romanian: Unde editurile își găsesc autorii, iar cărțile, cititorii.
- English: Writers find their way. Readers find their writers.

**Level 2: Supporting statement**
Working English supporting copy: Lisette connects writers, readers and publishers. Discover manuscripts, share selected excerpts, build your shelf and find literary events and surprises near you.

**Level 3: Key messages**

1. **Send once. Know where you stand.**
   One manuscript package goes to several publishers, adapted to each one's requirements. A status tracker uses the confirmed states: Submitted, In review, On hold, Selected by publisher, Rejected and Withdrawn. Publisher-facing Maybe corresponds to author-facing On hold; an evaluation is not a separate status.
   *Proof:* multi-publisher submission with a status tracker (MVP).

2. **Your work stays yours.**
   Full manuscripts are encrypted and visible only to the publishers the author chooses. The submitter declares authorship or permission from all rights holders. Device authentication confirms the upload and protects local access, using biometrics or the phone PIN/password; it does not verify authorship.
   *Proof:* encrypted storage, device-authenticated upload, author-controlled visibility (MVP).

3. **Back the authors you love.**
   Follow authors, read author-selected excerpts early, after any approvals required by accepted submission restrictions, review, share, and recommend. Your reading helps books get found.
   *Proof:* follow and feed, excerpt reading as a beta-reader, notifications, reviews and shared shelves (MVP and later).

4. **One shelf for everything you read.** (supporting message)
   Scan a book into your personal collection, then discover linked authors and publishers on Lisette and relevant events associated with the book or those people and organisations. See what followed authors read when they choose to share it. Ratings are a later possibility, not the centre of this experience.
   *Planned capability:* ISBN scan, book collection and reliable book-to-author/publisher/event connections. The three reader shelves and private-by-default, per-entry public sharing are confirmed; detailed UI treatment remains to design.

5. **Literary discoveries beyond the page.**
   Find events attended by authors and publishers you follow, and discover location-based surprises with different author- or publisher-selected content variants.
   *Planned capability:* event map and location discoveries; exact first-release scope remains to define.

**Level 4: Proof point bank (planned, verify before use)**
- Submit one manuscript to multiple publishers from one place.
- Submission status tracking using the confirmed lifecycle in `../docs/product/requirements.md`; use localized labels, including On hold / În așteptare for authors.
- Full manuscripts encrypted and shared only with chosen publishers.
- A file hash and upload timestamp record the uploaded version and time, not proof of authorship.
- Upload confirmation and local manuscript unlock use the phone's authentication system, with biometrics or a phone PIN/password fallback. Lisette does not collect or store biometric templates.
- Scan an ISBN barcode with the camera to add a book.
- Proposed adaptive reading uses ambient light; motion-based adaptations remain exploratory. Device support and the final qualifying sensor set require verification.
- Audio is deleted after transcription (read-aloud feature, if built).
- Account, data export and deletion options.

## 05 — Audience-Specific Messaging

**For writers (debut writers first)**
- *Care most about:* being read, knowing where they stand, and not having their work stolen.
- *Lead with:* "Send once. Know where you stand." and "Your work stays yours."
- *Proof that lands hardest:* the status tracker, encryption and author-controlled visibility.
- *Avoid:* promising a publishing deal, ranking or "get discovered fast".

**For readers**
- *Care most about:* discovering new voices early, one tidy shelf, and feeling that their reading helps authors.
- *Lead with:* "Back the authors you love." and "One shelf for everything you read."
- *Proof that lands hardest:* early excerpts from followed authors, ISBN scan, notifications when authors publish.
- *Avoid:* anything implying payment or "support" in the financial sense, and "another social network" language.

**For publishers and editors (simulated in the prototype)**
- *Care most about:* a consistent submission format, saving time, and respectful, structured replies.
- *Lead with:* "Every submission, one format." and "Structured feedback, without the workload."
- *Proof that lands hardest:* unified submission format and structured feedback to authors.
- *Avoid:* implying real partner publishers before they exist.

**For the competition jury (secondary audience)**
- *Care most about:* a clear idea, a working demo, and real use of phone sensors.
- *Lead with:* the connection between writers, readers and publishers and the sensors that make it possible (camera scan and location-based literary discoveries, with the remaining qualifying sensors to confirm). The event map and location discoveries are priority features; the microphone remains optional.
- *Avoid:* overclaiming. State plainly what is real and what is simulated.

## 06 — Messaging by Channel

| Channel | Headline approach | Tone | Length |
|---|---|---|---|
| Website hero | Approved localized tagline plus relevant benefits for all three groups | Warm, clear | Short |
| Google Play listing | Name + descriptor: a clear localized literary-community descriptor; final store title pending | Plain, accurate | Short title, medium description |
| Social bio | Approved localized tagline | Warm, bookish | Very short |
| Email subject lines | One concrete benefit or moment: "Your submission was received" | Personal, brief | Short |
| Pitch deck / demo | Problem first (silence, scattered submissions, no way to back authors), then the connection | Confident, honest | Medium |
| Paid ads (if ever) | Split by side: "Know where your manuscript stands." / "Read new pages before anyone else." | Warm, specific | Very short |

## 07 — Things Not to Say

- Any promise of outcomes: "get published", "land a deal", "go viral", "bestseller".
- Anything about money for authors (tips, subscriptions, "earn", "monetize"). There is no financial layer for now.
- "Revolutionary", "game-changing", "AI-powered" or other hype and buzzwords.
- Claims that depend on features not yet built, or real partner publishers while they are simulated.
- Reassurance about saved work, uploads or submissions that the app cannot confirm. Distinguish confirmed failure from unknown status; follow the confirmed-state reassurance rule in `voice.md`.
- Presenting the reading heatmap as an existing or committed feature. It is a deferred possibility; see `../docs/product/requirements.md`. Never infer attention or writing quality from scrolling, pauses or rereads.
- Brand-level messaging that consistently sidelines writers, readers or publishers. The homepage and overall brand story represent all three groups equally. Audience-specific screens, notifications and campaigns can focus on writers, readers or publishers; their headlines do not need a paired counterpart.
- "Social network" as the lead description. It is a table-stakes feature, not the differentiator.
- Competitor-adjacent framing such as "the Goodreads for writers" or "the Twitter for books". It borrows someone else's identity.
