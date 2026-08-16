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
| Rendered inspection | Color Splash state transitions and Bloom restoration/Fresh flow were exercised in the in-app browser on 2026-08-16. Details below. Other game/device matrices remain incomplete. |
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

## External guidance boundary

The external sources cited in `PRODUCT.md` and `CONCEPTS.md` inform safety, co-play, and claim restraint. They do not establish that SuperSimpleGames teaches a developmental skill, is suitable for every child in an age band, or produces a developmental outcome.

## Recording future evidence

Add an entry only when it can change a claim, constraint, implementation, or next decision. Include the source, context, observed signal, consequence, and remaining uncertainty. Do not turn routine passing test runs into prose; CI already preserves them.
