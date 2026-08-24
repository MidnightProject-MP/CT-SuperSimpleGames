# Evidence and feedback ledger

This document preserves decision-relevant provenance. It is not a test-results archive and does not duplicate current product behavior. `PRODUCT.md` owns current truth; `ROADMAP.md` owns sequencing.

## Evidence classes

- **Child observation:** directly observed behavior from an identified playtest context. Formative, not generalizable.
- **Caregiver report:** the caregiver's words, concerns, or conditions for offering the experience again.
- **Product-owner feedback:** hands-on product judgment or product direction from the repository owner. Valuable direction, but not child evidence.
- **Rendered inspection:** visible behavior exercised in a browser at a named viewport and revision.
- **Deterministic verification:** tests, static invariants, syntax, and pure-state checks.
- **Deployment verification:** CI, hosting, and public asset availability for an exact revision.
- **External guidance:** sources that constrain safety or framing without validating this product.

Missing child or caregiver evidence limits claims; it does not prohibit bounded, reversible experiments.

## Current evidence state

| Evidence | Current state |
|---|---|
| Child observation | No structured SuperSimpleGames child sessions are recorded in the repository. |
| Caregiver report | No structured caregiver reports are recorded in the repository. |
| Product-owner feedback | Substantial hands-on feedback has shaped replay, forgiving input, spatial stability, construction, persistence, merging, and storytelling. Key decisions are summarized below. |
| Rendered inspection | Color Splash state transitions, Bloom restoration/Fresh flow, Stack's bridge-resident flow, and Peekaboo's themed reunions were exercised in the in-app browser on 2026-08-16. Details below. Other game/device matrices remain incomplete. |
| Deterministic verification | The current suite covers game-state bounds, input resolution, offline shell, safety policy, persistence fallback, control contracts, and layout-source invariants. Exact results belong to CI for each commit. |
| Deployment verification | GitHub Verify and Pages runs and public release markers were confirmed for the current foundation releases. |

## Decision-relevant feedback

| Source and context | Signal | Consequence |
|---|---|---|
| Founding real-world observation, recorded in `INCEPTION.md` | Toddlers tap freely, while an adult smartphone can expose purchases, settings, messages, and other serious consequences. | Established the local-only, no-account, no-purchase safety boundary and the expectation that a caregiver still uses device-level single-app controls. This is motivation, not a structured product playtest. |
| Product owner, hands-on review of the collection | Re-entering a game just to obtain a fresh round was friction; destructive restart controls must not move the play surface. | Finite games gained in-game replay. Open-ended creations gained consistent confirmed Fresh controls and bounded local restoration. Spatial stability became a cross-game invariant. |
| Product owner, Color Splash review | Young children are imprecise; dead-looking taps are frustrating. The board also moved when controls appeared. | Board gaps resolve to a nearby cell, repeated identities respond visibly, and the board now owns a fixed frame across undo, completion, and replay. |
| Product owner, Peekaboo review | The experience was appealing but bare; friends should emerge, some locations may contain clues, and another search should be available without leaving. | Emerged friends, deterministic target/clue searches, greetings, and Hide again were implemented. Deeper child-hides and clue-chain work remains in the per-game roadmap. |
| Product owner, Stack & Settle review | Collision behavior felt messy and forming a bridge was disproportionately hard because pieces snapped and shared similar widths. | Collision resolution, a wider beam, forgiving support-pair detection, and structural recognition were implemented. Rendered physical-device ease remains unobserved. |
| Product owner, Bloom review | Visitors added delight; merge-three could declutter dense gardens and create a surprising repeatable discovery. | Deterministic flower-to-bouquet and bouquet-to-tree merging was implemented with a two-tier cap that preserves the garden rather than creating an upgrade ladder. |
| Product owner, Story Scenes review | Repeated taps should rotate object families; casts should be limited; castle ingredients should combine into rider/armor/rescue stories; silhouettes must remain recognizable. | Automatic palette rotation, per-family limits, clearer dragon art, and reversible castle compositions were implemented. Broader causal story chains remain a hypothesis. |
| Product owner, deliberate hands-on Bloom use after merge implementation | Despite careful attempts, the second-tier flowering-tree merge could not be reproduced. A mechanically present relationship may not meaningfully exist for a child when placement cannot be corrected and the required spatial/color combination is too unlikely. | `BL-3A` is now recorded as mechanically implemented but experientially incomplete. Ordinary-play reachability must be measured and revised before further Bloom expansion; adding instructions or a child-facing placement mode is not the default remedy. |
| Deterministic trace measurement, 2026-08-21 | Seeded ordinary-play traces (120 runs × 600 taps × two phone viewports) reproduced the owner's experience: baseline gardens reached tier one in only 8–18% of runs and tier two in 0%. The binding constraint was supply arithmetic: the garden caps at 24, post-cap tending froze evolution, and rigid six-color cycling yielded fewer than six same-color flowers per session against the nine a same-color tree required. Owner direction then reframed the goal: trees within ~50 taps, aggressive decluttering, and colors as celebration rather than gate. | Merging was revised to its current shape: any three mutually nearby flowers form a bouquet regardless of color; three bouquets form a tree; a tree spanning all six ancestry colors is celebrated as a rainbow tree; three nearby trees dissolve together in a send-off that frees space; tending leans blooms toward kin, planting between two blooms resolves to their midpoint, and new bouquets settle toward neighbours. Corrected traces (growth advance modelled): first bouquet median tap 15–18, first tree median tap 55–63 and ≥93% by tap 100, send-offs every ~130 taps, end-garden size ~11–12 of 24. A seeded ordinary-play regression test guards these rates in CI. Owner hands-on reproduction remains the 6A decision gate. |
| Product owner, collection-level interface review | Child-facing clutter competes with play; adult software conventions should not be imported without child value. Story Scenes' selector and confirmation may cost more attention than temporary scene preservation warrants. | The active roadmap now prioritizes a six-world clutter/stability pass and a direct, reversible or state-preserving Story Scenes transition. Destructive friction is proportional rather than categorical. |
| Product owner, longer-term product direction | Explore a more ownable visual identity, caregiver-selected developmental complexity, and thoughtfully designed session wind-down while keeping sophistication hidden from the child. | These remain bounded design hypotheses after the simplification milestone. Developmental depth must not become scoring, locks, opaque performance inference, or forced progression; the closing ritual moves behind caregiver-layer architecture rather than remaining the immediate build target. |
| Product owner, hands-on Bloom play after the reachability revision, 2026-08-21 | Bouquets, trees, and the rainbow arrived within ordinary tapping ("love the new pace of merge and all the new merge results"). Owner directed the rainbow's full-screen cutscene treatment, founder-color petals, softer launcher padding, then approved moving on. | The 6A decision gate is passed and Bloom is closed for this phase. Cutscene, petals, and icon padding shipped as directed. |
| Product owner, operating requirement | The collection needs to work in airplane mode. | Offline-shell automation remains necessary but is not sufficient evidence; a loaded installation must eventually be exercised in device airplane mode across the launcher, every game, and Home navigation. |
| Product owner, consolidated final product and operating direction, 2026-08-23 | Design from the child's observable experience outward; clutter (gameplay and interface) degrades play; simplicity and depth are not opposites; the educational thesis needs an intentional, researched developmental territory per experience; the portfolio itself is a hypothesis to reassess (Stack & Settle and Together Tones placement explicitly uncertain); a game earns placement through delivered quality, not potential; question whether the touchscreen medium improves each activity; prefer caregiver-selected developmental levels over conventional difficulty; special events should move from surprise to intentional reproduction and create session rhythm; discoverability of triggers matters as much as determinism; protected moments should not be dismissible before unfolding; shared grammar and recurring inhabitants build continuity without collectibles; caregiver concerns belong behind a caregiver layer; stopping deserves as much design as starting; visual identity should become ownable; curation before expansion. Operating shift: human feedback is input to investigate rather than a backlog item; routine experiential gates are adjudicated by Celestan through rendered evidence and persona review instead of awaiting owner approval. | Roadmap restructured into Project → Epic → Story with personas ([`PERSONAS.md`](./PERSONAS.md)) used at decision boundaries; the 6B owner-review gate was closed by Celestan adjudication under this directive (implementation retained; surprise/snap feel remains child-observation questions); research was delegated and recorded below; portfolio composition review became an explicit Epic. |
| Product owner relaying first real child use, portfolio replan, 2026-08-24 | **This is the first child evidence in the repository**, relayed by the owner from home testing of the released iterations — informal observation, not a structured session. Signals: (1) children engage with Bloom and return to it — Bloom's core loop is child-validated as engaging at the "do they want to keep touching it" level; (2) accidental pinch-zoom during play materially interferes with the children's experience — toddler two-finger gestures scale/pan the active game surface and break play continuity; (3) Bloom's resident concept (visitors) is engaging enough to merit deeper investment; (4) Color Splash's resident implementation does not provide comparable gameplay value — fixed position, minimal response, then gone. Owner direction accompanying the observations: interaction polish outranks mechanic breadth; Memory and Numbers replace Stack & Settle and Together Tones in the portfolio; Fresh/reset controls belong behind the grown-ups surface; E1 identity work waits until retained worlds feel excellent. | Supersedes the B3 keep-all-six verdict (Stack & Tones archived from the launcher immediately; sources left inert). Reopens the browser-zoom availability invariant for child play surfaces. Converts Bloom from hypothesis to protected core. Reframes resident work as world-local life experiments rather than framework expansion. Roadmap replaced by the Epic G/H/I/J/K structure in [`ROADMAP.md`](./ROADMAP.md); Memory's lead concept revised by the owner to matching + spatial recall after review. Residual uncertainty: all four signals are single-source informal observation; structured observation (Epic K) still needed for generalization, comfort thresholds, and the Memory/Numbers hypotheses themselves. |

## Rendered evidence

### 2026-08-16 — Color Splash stable frame

**Method:** In-app browser, direct interaction with the deployed and local static app; geometry read from rendered DOM rectangles.

- At 390×844, the board remained `343.55 × 343.55` at approximately `(23.41, 279.23)` before a move, after Back one appeared, at completion, and after New board.
- At 640×360, browser observation found a residual 3 px shift that deterministic source checks had missed. Investigation showed that hiding the prompt changed automatic grid placement. Assigning prompt, board, and undo to explicit rows removed the shift; the corrected local frame remained `224 × 224` at `(208, 59)` before and after Back one appeared.
- The observation caused commit `408f751`; it was not merely confirmation of an existing assumption.
- Physical touch-device behavior and child response remain unobserved.

### 2026-08-16 — Bloom preservation and Fresh

**Method:** In-app browser at 390×844 against the local static app.

- One created bloom remained after reload.
- Opening Fresh displayed an overlay explaining that the garden would go away.
- Keep playing preserved the bloom; confirmed Start fresh removed it.
- The non-destructive choice received initial focus and the active garden remained visually behind the modal.
- Equivalent rendered flows in Stack & Settle and Story Scenes remain to be exercised.

### 2026-08-16 — Stack bridge resident and orientation reflow

**Method:** In-app browser against the local static app at 390×844 portrait and 640×360 short landscape; direct pointer drags, semantic resident touches, screenshots, rendered rectangles, reload, and console inspection.

- Broadly dragging the block and nest into supports and the beam above them produced a recognized bridge and one spotted bird. The bird's silhouette and colors match Bloom's resident, while its arrival message explicitly relates it to the bridge.
- Three touches kept the bird present and moved it locally. The fourth removed only the bird; all three bridge pieces retained identical positions. Removing and returning a support invited it again.
- Initial orientation testing exposed a real defect: pieces survived reflow, but the bridge relationship collapsed into a stack, so the bird disappeared. The implementation now records layout context and reconstructs recognized bridge supports and top across live resize and saved restoration.
- After correction, the bridge and bird remained in bounds at 640×360: bird `(277.66, 121.29, 84×84)`, beam `(251.26, 172.80, 136.8×43.2)`, with both supports below. Reload preserved the same relationship and produced no console warnings or errors.
- Rendered inspection also found the short-landscape status message overlapping the title control; reserving a narrower centered lane removed the overlap. Physical touch ease, child recognition of the recurring bird, and intentional bridge reproduction remain unobserved.

### 2026-08-16 — Peekaboo themed “together” reunions

**Method:** In-app browser against the local static app at 390×844 portrait and 640×360 short landscape; direct opening/closing, semantic friend touches, screenshots, rendered rectangles, all-theme cycling, and console inspection.

- Two open sea friends produced one `swim` relationship, a visible connector, and the message “fish and turtle swim together.” Touching either friend replayed the bounded motion; closing one shell hid the connector and reopening restored it.
- The initial connector was logically correct but rendered across the container flaps. Measuring emerged-friend centers moved it to the stable resting line: in portrait the link center was `y=440.01` and friend centers were `y=439.62`; in short landscape the link center was `y=164.00` and friend centers were `y=164.09`.
- Cycling the same rendered flow exercised all four declarations: sea `swim`, animals `snuggle`, vehicles `travel`, and weather `float`. Each remained derived from the same two-open-friends state and produced a scene-specific visible message.
- Short-landscape inspection found the status pill extending 3.6 px below the viewport. Reducing the reserved container row by 4 px moved its bottom to `359.6` in a 360 px viewport. No console warnings or errors were observed.
- Physical touch comfort, whether children perceive the connector as “together,” and whether that meaning transfers from other games remain unobserved.

### 2026-08-21 — Bloom reachability revision, rendered

**Method:** Headless Edge driven over the local dev server with seeded synthetic pointer traces on fresh gardens (service worker and storage neutralized per run); portrait 390×844 and short landscape 640×360; DOM composition polled during play; screenshots captured.

- Fresh-garden flowering trees were encountered at tap 50 (portrait seed 11), tap 50 (portrait seed 23), tap 90 (landscape seed 23), and tap 130 (landscape seed 11); three of four runs ended with one tree plus remaining flowers and bouquets.
- Two harness defects were caught by this layer before shipping: garden restoration resurrected prior-run state through `pagehide` persistence (fixed by stubbing storage), and header navigation links intercepted taps mid-trace.
- The rendered arrival times sit inside the deterministic trace distribution for the same seeds' model family. Child comprehension of the rainbow celebration and tree send-off remains unobserved.

### 2026-08-21 — Rainbow cutscene, rendered

**Method:** Same headless-Edge seeded-trace setup; runs polled for the `.rainbow-overlay` element and its computed opacity until a six-color tree formed.

- The cutscene rendered with all six bands at full opacity during its hold (portrait, tap 210 of a fresh garden); other seeds formed trees without six-color ancestry, which is expected variance rather than a defect.
- The rendered layer caught a real interaction defect before release: `animationend` bubbles from the inner rise animation, which dismissed the overlay after one second instead of after the veil. The dismissal now filters on the veil's animation name.
- Maskable launcher icon padding was reduced from near-full safe-zone fill to ~91% after owner feedback that the flower looked oversized on Android.
- Owner feedback on the first cutscene build ("separate color circles, not a rainbow spanning left to right") was correct: the original bands were six bordered rings with percentage gaps and no clipping. The arch is now one hard-stop radial-gradient disc whose center sits below the viewport; a paused-animation rendered screenshot confirmed six contiguous edge-to-edge bands at full hold.

### 2026-08-23 — Six-world clutter/stability audit, wave 1 (story A3)

**Method:** Delegated headless-browser pass over the local dev server: 7 pages (launcher + six worlds) × 2 viewports (390×844, 640×360), fresh storage per run, 25 seeded taps/drags avoiding header controls, control inventories with rect-shift detection, screenshots archived in the session temp workspace.

- All 14 runs produced zero console errors, and no pre-existing element moved more than 4px when new elements appeared — the spatial-stability invariant held at the rendered layer everywhere it could be exercised.
- The audit found two real child-experience defects that lower layers had missed, both fixed in bounded slices and re-verified (rendered geometry + 156 deterministic checks): visible text selection on the launcher under rapid taps; Story Scenes chip artwork overflowing onto its labels in short landscape (container-unit mismatch, also mildly present in portrait).
- An ordinary messy tap reached Stack & Settle's Fresh control; the confirmation protected the build with the non-destructive choice focused — recorded as caregiver-layer (C1) input rather than a defect.
- Restore-state flags for Color Splash/Stack/Story Scenes were measurement artifacts (count heuristic); prior rendered evidence for those flows stands.
- Dense, completion, and overlay states and Bloom's rainbow dismissal were not exercised at 25 taps; wave 2 with seeded long traces remains before A3 closes.

### 2026-08-23 — Wave 2: overlay states, Fresh friction, rainbow hold (stories A3 + A4)

**Method:** Headless-browser runs over the local dev server: deliberate Fresh-dialog flow on Bloom; clustered-burst tap traces (jittered zone centers) until a real rainbow appeared; dismissal timing measured in-page.

- Fresh destructive-friction flow verified rendered: dialog appears, "Keep playing" preserves the garden exactly, "Start fresh" clears it.
- Uniformly random taps (450) reached neither a rainbow nor a Color Splash completion, while clustered-burst traces reached real rainbows at taps 102 and 480 — ordinary-play reachability depends on clustered bursts, consistent with the seeded trace model.
- The rainbow cutscene previously dismissed on **any** pointerdown instantly (code-confirmed). A4 fix shipped: a 1500ms opening hold now absorbs touches; touches after the hold dismiss; the veil's natural self-dismiss and the reduced-motion skip are unchanged. Rendered verification on real rainbows: tap at ~400ms did not dismiss; tap after hold dismissed in 3ms; natural self-dismiss at ~3.2s. 156/156 deterministic checks pass.
- Residual gap: Color Splash completion overlay was not reached by the harness (cell targeting limitation); prior rendered evidence for the stable frame and completion hold stands.

### 2026-08-23 — Orphaned Peekaboo working-tree change reverted

**Method:** Diff inspection of unattributed uncommitted changes found during A3 close-out; deterministic suite; rendered smoke check.

- The tree contained an undocumented Peekaboo behavior change: the deliberate "Hide again" replay control (documented in `PRODUCT.md` acceptance evidence) was removed and replaced by a hidden tap-anywhere restart, and a mojibake regression (`"Everybodyâ€™s here!"`) plus a BOM were introduced. This was the likely source of the mojibake sighting in the first audit run.
- **Consequence:** reverted to the committed last-verified state; selection-guard CSS additions preserved. The tap-anywhere concept is recorded as a B2-input hypothesis (it maximizes directness but silently discards the found state — the surprising-transition class 6B removed). Post-revert verification: 156/156 checks, rendered smoke clean. Unattributed working-tree changes are treated as unverified regardless of apparent intent.

**Remaining uncertainty:** the change's origin is unknown (likely an interrupted delegation from a prior session); delegation mandates now restate the no-uncommitted-side-effects boundary.

## External research

### 2026-08-24 — D2 bridge redesign (rendered + deterministic)

**Method:** Pure-state simulation of clustered placement sequences logging every beam-pair rejection; then headless rendered re-probe (clustered drag gestures, isolated browser contexts).

- Root cause of unreachable bridges: collision resolution collapses supports to identical x, and realistic height differences exceeded the strict pair level tolerance — a qualifying pair almost never existed during clustered play.
- Fix (beam only): the beam now seeks the nearest compatible support pair — all placed supports considered, level tolerance ~2.75×, wider separation window, no release-proximity rejection. Roof/enclosure behavior unchanged.
- Results: pure simulation 6/12 sessions form a bridge (first at gestures 6–20; previously 0/12); rendered clustered probe reaches the bird at gesture 4 and gesture 36; shelters unaffected; 173 deterministic checks green.
- Residual: sessions where all supports stay piled at one spot still produce no bridge (nothing stands apart to span) — correct behavior; observation (F2) confirms real-session rates.

### 2026-08-24 — D2 discoverability probe (rendered)

**Method:** Headless-browser probe, 390×844: per world, seeded clustered-burst and uniform tap/drag strategies (300 taps or 40 gestures per run) with DOM-signal trigger detection; Stack additionally re-probed with clustered drag targets after scattered drags failed.

- Discoverable through ordinary play: Peekaboo target + reunion (3rd opening), Together Tones motifs (~4 varied taps), Story pair beats (tap 6), Stack structures/shelters (gesture ~9, every run), Bloom bouquet/tree/rainbow (CI traces; rainbow at taps 102/480 clustered), Color Splash completion (no-fail).
- Conditionally discoverable: Story castle compositions — fired at tap 6 under favorable clustering, never in 300 spread taps; accepted for now, revisit under F2 observation.
- **Not discoverable: Stack & Settle's bridge + bird.** 160 plausible gestures across four strategies and both seeds produced shelters every run but never a bridge; the snap's release-geometry requirements (beam above two near-paired supports near their midpoint) are not met by ordinary play. Because the spotted bird — the recurring-resident pilot — is gated behind the bridge, a bounded snap redesign is the active D2 slice.

### 2026-08-23 — Developmental-domain synthesis

**Method:** Delegated web research over CDC milestones, AAP policy, Head Start ELOF, executive-function literature, transfer-deficit meta-analyses, and early-math/pattern research. Sources recorded in the session briefing; key citations below.

- The 18–36 month band contains roughly three developmental regimes (<24 / 24–30 / 30–42 months) with materially different memory spans, symbolic-play readiness, and classification ability. Face-down memory exceeds most under-30-month children; matching identical *visible* pairs arrives ~28–32 months; subitizing emerges mostly at 3–4 years.
- The video/transfer deficit peaks in year two and largely resolves by ~3; joint media engagement is the strongest documented moderator of whether screen time teaches before age 3. Responsive contingent touchscreens help, but gratuitous interactivity measurably degrades comprehension.
- "No-fail" is professionally praised, but evidence does not support total *outcome neutrality*: gentle, non-penalizing outcome distinction carries information; uniform success animations remove it. Person-praise at toddler ages has measurable long-term costs; celebration should target events and artifacts, never the child.
- Blanket resistance to progression is contradicted in spirit by the Four Pillars literature: challenge should widen self-paced (parameters, not unlocks). Top toddler apps score badly on exactly this pillar.

**Consequence:** Personas codified as three regimes; Together Tones flagged highest-risk for under-30-month play (arbitrary sequence recall exceeds span); Story Scenes recognized as skewing toward R3; spatial/construction and connected-region work confirmed as strongest differentiation; caregiver layer and co-play affordances elevated from nicety to evidence-backed core. Feeds Epic B stories.

### 2026-08-23 — Competitive and interaction-pattern landscape

**Method:** Delegated web research across Sago Mini, Toca Boca, Khan Academy Kids, Busy Shapes, LEGO DUPLO World, Thinkrolls, Endless Alphabet, Peekaboo Barn, and industry consolidation history.

- Portfolio consolidation precedes expansion across the industry (Toca Life → World; Sago delisted standalones; Duck Duck Moose frozen): retiring or folding weaker worlds is normal practice, not failure.
- Proven no-levels complexity patterns exist (adaptive difficulty, mastery paths, caregiver-set levels); a gated grown-ups area with co-play prompts is table stakes; wind-down/bedtime rituals are rare and differentiating (Peekaboo Barn's night-fall ending, DUPLO's caregiver bedtime freeze).
- Small recurring casts with one signature color/shape each create cross-game recognition, supported by parasocial-character learning research. One recognizable visual system is what makes leading products identifiable without a logo.
- Free/ad-free/no-account positioning is scarce (Khan Academy Kids is the only major analog) and real, but sets a high polish bar.

**Consequence:** Validates the archive hypotheses, wind-down epic, caregiver-layer epic, recurring-inhabitant cast, and visual-identity exploration as researched directions rather than speculative ones; informs B3 portfolio-composition criteria (medium value, regime fit, delivered quality).

## External guidance boundary

The external sources cited in `PRODUCT.md` and `CONCEPTS.md` inform safety, co-play, and claim restraint. They do not establish that SuperSimpleGames teaches a developmental skill, is suitable for every child in an age band, or produces a developmental outcome.

## Recording future evidence

Add an entry only when it can change a claim, constraint, implementation, or next decision. Include the source, context, observed signal, consequence, and remaining uncertainty. Do not turn routine passing test runs into prose; CI already preserves them.
