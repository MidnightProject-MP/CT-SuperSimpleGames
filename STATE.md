# SuperSimpleGames — project state

## Objective

A local-only collection of six no-fail web worlds for toddlers (~18–42 months, now modeled as three developmental regimes) playing with a nearby caregiver: safe under unrestricted tapping, playable offline after first load, private by design, with no accounts, analytics, or external consequences. Each world is gaining an explicit researched developmental territory; portfolio composition itself is under review.

## Current milestone

Durable planning runs **Project → Epic → Story** (`docs/ROADMAP.md`), with personas as active decision instruments (`docs/PERSONAS.md`) and disposable story execution plans in `docs/plans/`. **Epics B, C, and D are complete (through D1, closed 2026-08-24).** Released: 2bf9860 (fixes + caregiver layer + wind-down), 76695da (C3 gentle levels), 3b8c46b (D2 audit), 4fafdd7 (bridge redesign — bird discoverable). D1 shipped the resident cast: the Bloom butterfly lands on completed Color Splash boards and a new snail visits Story Scenes' garden at 3+ objects — both derived deterministically with a 3-touch budget via a shared `src/residents.js` primitive; 178 deterministic checks green, rendered-verified. Next story: **E1 identity-directions exploration** (Epic E).

## Decisions

- Planning hierarchy Project → Epic → Story carries intent only; disposable execution plans live in `docs/plans/` and are rewritten freely.
- Routine experiential gates are self-adjudicated by Celestan through rendered evidence and persona review; the 6B owner-review gate was closed this way on 2026-08-23. Human escalation is reserved for taste, authority, inaccessible real-world information, or genuinely consequential judgment.
- Educational-thesis research (delegated, recorded in `EVIDENCE.md` 2026-08-23) resolved the audience band into three regimes, flagged Together Tones as highest-risk for under-30-month play and Story Scenes as R3-skewed, elevated the caregiver/joint-media-engagement layer to evidence-backed core, and added the celebrate-events-not-child principle.
- B2 territory map (2026-08-23): every world's surface is complete play for younger regimes; depth (merges, planning, narrative, patterns) serves older regimes without gates. Uncovered agencies identified for B3: visible matching/classification and explicit small quantities; vocabulary/spatial talk is caregiver-layer work (C1), not a new world.
- Per-game Round-3 depth milestones are **paused** until story B3 decides world placement (curation before expansion).
- Deferred by A3 with rationale: launcher short-landscape scrolling (C1/E1), Stack Fresh accidental-trigger exposure (C1), text-carried control meaning (B2 + child observation).

## Open questions

- Physical device availability for the touch-device pass and airplane-mode exercise (Epic F1) — now also the Stack & Settle archive trigger.
- Child/caregiver availability for observation sessions (Epic F2) — also the Story Scenes depth-unfreeze gate.
- Whether a B4 matching/classification concept proves stronger than Together Tones in explicit comparison.

## Evidence gaps

- Nothing is child-validated; every passing claim is mechanical, simulated, or rendered only.
- Real-device airplane-mode exercise has never been performed.
- Color Splash completion overlay was not reached by the wave-2 harness (cell-targeting limitation); prior rendered evidence for the stable frame and completion hold stands.

## Next action

Run story **E1 identity-directions exploration**: prototype two or three opinionated visual alternatives on representative screens via a temporary global skin (not a product feature), judge against the screenshot-recognition test, and report directions with screenshots; shipping nothing is acceptable. Then the roadmap is observation-driven pending F1 hardware / F2 participants. Commit and push D1 immediately (owner releases for testing).
