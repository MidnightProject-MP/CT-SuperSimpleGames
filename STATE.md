# SuperSimpleGames — project state

## Objective

A local-only collection of six no-fail web worlds for toddlers (~18–42 months, now modeled as three developmental regimes) playing with a nearby caregiver: safe under unrestricted tapping, playable offline after first load, private by design, with no accounts, analytics, or external consequences. Each world is gaining an explicit researched developmental territory; portfolio composition itself is under review.

## Current milestone

Durable planning runs **Project → Epic → Story** (`docs/ROADMAP.md`), with personas as active decision instruments (`docs/PERSONAS.md`) and disposable story execution plans in `docs/plans/`. **Epics B and C are complete (B1–B4, C1–C3 closed by 2026-08-24).** Released to production: 2bf9860 (A3/A4 fixes, caregiver layer, wind-down; v43) and 76695da (C3 gentle-level adoption) — both CI-green and live on Pages. **D2 discoverability audit done 2026-08-24; one redesign slice remains:** every deep trigger is discoverable through ordinary clustered play except Stack & Settle's bridge + bird (never fired in 160 plausible gestures across four strategies; shelters fire at gesture ~9 every run). 173 deterministic checks green. Next: bridge-snap redesign, then re-probe until clustered play reaches the bird.

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

Run the **D2 bridge-redesign slice**: make a beam released near two supports reliably bridge them (the beam "wants" to span — widen the snap in `src/stack.js` placement logic), keep the causal story intact, re-probe with the clustered harness (`ssa-d2/probe-stack-clustered.mjs` pattern) until ordinary play reaches the bird within a normal session; verify shelters still dominate non-bridge arrangements; then commit, push, and close D2.
