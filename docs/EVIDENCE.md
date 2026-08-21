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
| Product owner, operating requirement | The collection needs to work in airplane mode. | Offline-shell automation remains necessary but is not sufficient evidence; a loaded installation must eventually be exercised in device airplane mode across the launcher, every game, and Home navigation. |

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

## External guidance boundary

The external sources cited in `PRODUCT.md` and `CONCEPTS.md` inform safety, co-play, and claim restraint. They do not establish that SuperSimpleGames teaches a developmental skill, is suitable for every child in an age band, or produces a developmental outcome.

## Recording future evidence

Add an entry only when it can change a claim, constraint, implementation, or next decision. Include the source, context, observed signal, consequence, and remaining uncertainty. Do not turn routine passing test runs into prose; CI already preserves them.
