# Naming

**Chosen name: Lisette** (decided by the user; this file records the brief, the vetting, and the follow-ups).

## Brief
- **What it does:** a literary hub where writers submit manuscripts, readers support the authors they love, and publishers discover new voices.
- **Audience:** writers, readers and publishers, equally central; debut writers are the initial recruitment group.
- **Name feel:** warm, literary, soft. The name is French, by choice.
- **Competitive calibre:** assumed brand-grade (warm and distinctive, like Goodreads, StoryGraph or Substack). Not confirmed with the user.
- **Platforms:** Android phones and tablets, plus web for readers, authors and publishers (no iOS). Detailed scope is in `../docs/product/requirements.md`.
- **Off-limits words:** none.
- **Architecture:** standalone.

## Origin and fit
Lisette is a classic French given name, a diminutive of Élisabeth. It is also a stock character in French theatre, the quick-witted maid in Marivaux's comedies, and appears in literary titles such as *Lisette's List* (Susan Vreeland). A person's name makes the app feel like a companion: someone who reads with you and speaks up for the writers you love. It fits the warm, literary, supportive personality in `context.md`.

## Historical vetting notes (recorded 2026-10-13; not reverified)

These are earlier research notes, not current availability, legal clearance or approval to register a name. Verify relevant facts before external use.

| Check | Result |
|---|---|
| Prior art, GitHub | `ivov/lisette`, a Rust-inspired programming language that compiles to Go (about 1.5k stars). Different product and audience (developers vs readers), so usable, but it will crowd developer search results. `AnswerDotAI/lisette` (an LLM helper, about 38 stars) is minor. |
| Prior art, web | No app, publisher or company called Lisette in books, reading or writing turned up. Results were Goodreads user profiles, the novel *Lisette's List*, a children's book from a French publisher, and a literary agent (Lisette Verhagen, PFD). Nothing in the same category. |
| Domains | `lisette.com`, `lisette.co`, `lisette.dev` and `lisette.io` appear taken (they respond over HTTP, so they may be parked or for sale). `lisette.app` showed no DNS record and `getlisette.com`, `uselisette.com` and `lisetteapp.com` showed none either, so they are probably unregistered. **Not confirmed**, because `whois` isn't installed here. Verify at a registrar. |
| Social handles | `github.com/lisette` is taken. `@lisette` returned 200 on X and Instagram, so it is probably taken (these checks are unreliable behind login walls). `@lisetteapp` returned 404 on GitHub and X. Verify manually before relying on any handle. |
| Google Play | Web search can't query Play Store listings. **Not checked.** Search "Lisette" on Google Play manually. |
| Trademark | **Not checked.** Search USPTO and EUIPO for "Lisette" in classes 9, 41 and 42 before launch. |

## Risks
- **Personal name.** It doesn't say what the product does and is feminine-coded. A tagline has to carry the meaning (see `positioning.md`).
- **Weak search ownership.** The name is shared with people, a novel, a literary agent and a developer tool. Expect to fight for the name in search for a while, so the app name and store listing should include a descriptor.
- **Exact domains are taken.** Plan for a prefix or alternative TLD (`lisette.app`, `getlisette.com` or similar) once confirmed free.

## Follow-ups
- [ ] Confirm `lisette.app` and the `get`/`use` variants at a registrar.
- [ ] Search Google Play for existing "Lisette" apps.
- [ ] Trademark search (USPTO, EUIPO), classes 9, 41 and 42.
- [ ] Claim handles such as `@lisetteapp` or `@getlisette`.
- [x] Romanian and English taglines approved; use the exact versions in `brand.yaml` and `messaging.md`.

## Alternatives explored (2026-10-13), not chosen
The user asked for a less common name, reviewed these, and decided to **stay with Lisette for now**.
- **Lettrine** (drop cap; best score, about 89/110): rejected because it sounds like Romanian "latrina" (latrine). A reminder to check Romanian pronunciation for any future candidate.
- **Trame** (weft and plot, about 77): all domains taken, plus the Kitware Trame framework in search.
- **Incipit** (Latin, "here begins", about 75): not French, domains taken.
- **Filigrane** (watermark, about 70): hard to spell and say.
- Dropped earlier: Treille, Liseron, Primeur, Aparté, Ruche, Cénacle (pronunciation, weak story, or taken).
Revisit the name before any public launch.
