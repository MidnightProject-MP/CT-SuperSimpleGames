# SuperSimpleGames — project state

## Objective

A local-only collection of six no-fail web worlds for toddlers (~18–42 months, three developmental regimes) playing with a nearby caregiver: safe under unrestricted tapping, playable offline after first load, private by design, with no accounts, analytics, or external consequences. **Priority hierarchy (owner-set 2026-08-24):** child engagement and delight → immediate responsiveness → discoverability/agency → replay/variation → interaction polish → developmental value → robustness → abstraction; privacy/safety/offline/accessibility are hard constraints outside the ordering. A mechanic is finished only when its presence improves the child's experience.

## Current milestone

**Round-2 owner direction processed: adaptive progression replaces fixed levels; Epic L defined with envelopes documented (L1 closed) — awaiting acceptance before implementing L2 (2026-08-24).** Launcher portfolio: Bloom, Color Splash, Peekaboo Pockets, Story Scenes, Memory, Numbers. Stack & Settle and Together Tones retired from launcher/shell/settings; sources inert in-tree pending deletion.

- **Numbers v2 gate PASSED** on owner hands-on ("really like… preserve its core direction"); I3 hardening stays restrained.
- **Memory gate previously passed** ("great"); H3 restrained.
- **Epic G — interaction polish: COMPLETE**, plus launcher-scroll regression fixed (`pan-y`: menu surfaces pan, play surfaces don't).
- **Epic L — adaptive progression:** L1 closed (per-game min/max experiences, signals, non-signals, dimensions, tempo documented in `GAME_ROADMAPS.md` § Adaptive progression envelopes; Bloom/Peekaboo/Story Scenes deliberately stable). L2 Memory prototype is the first implementation; L4 retires Default/Gentle/Rich afterward; L3 applies the pattern to Color Splash boards; L5 Numbers deepening waits on observation. Fixed-level control still present in this build until L4.

## Decisions

- Owner round-2 direction (in `EVIDENCE.md`): **adaptive progression replaces fixed levels** — hidden, continuous, game-specific, slow/reversible, distribution-not-point-estimate, no cliffs, no generic metrics, no shared engine until game-specific implementations prove shape; caregiver keeps reset/start-simpler/cap-style controls, never a global child classification; fluency records are local gameplay state, never assessment.
- Owner direction 2026-08-24: interaction polish outranks mechanic breadth; Memory/Numbers replaced Stack/Tones; management UI lives behind grown-ups; E1 deferred; residents are world-local experiments (`residents.js` untouched).
- Child play surfaces reject accidental scale/pan; launcher menu pans vertically while blocking zoom ("menu surfaces pan, play surfaces don't"); caregiver page fully zoomable; OS accessibility zoom preserved.
- Rendered verification tooling exists (playwright-core + system Edge vs `npm run dev`, temp workspace). Probes have caught three real pre-release defects (Memory matched-face; Memory rich-card count wiring; Numbers friend placement) — rendered checks mandatory before release claims.

## Open questions

1. **Epic L acceptance:** does the envelope design (L1) match owner intent before L2 implements it?
2. **Memory adaptive prototype gate:** do children experience the adapting envelope as "meeting them where they are" — and does the fluency record move for the right reasons? (Owner/child hands-on after L2.)
3. Physical device pass (gesture feel, drag ease, airplane mode) — needs hardware (K2).
4. Observation sessions (Story Scenes depth unfreeze; adaptive-signal validation for Bloom/Peekaboo) — needs participants (K3).

## Evidence gaps

- Child evidence remains informal/owner-relayed plus owner hands-on of both experiments; structured observation pending (K3).
- Adaptation *behavior* is entirely unproven: envelopes and tempo are design hypotheses until the Memory prototype survives hands-on; mechanical EMA correctness proves nothing about child experience.
- Real-device feel unobserved everywhere (K2).

## Next action

**Paused awaiting owner acceptance of the Epic L design** (this commit). On acceptance, in order: implement **L2 Memory adaptive prototype** (deterministic core + rendered probes + grown-ups reset control), then **L4 fixed-level retirement**, then **L3 Color Splash application** if Memory's record shape holds. Testing feedback on shipped worlds always takes bounded-corrections priority. E1 stays deferred; K opportunistic.
