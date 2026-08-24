# SuperSimpleGames — project state

## Objective

A local-only collection of six no-fail web worlds for toddlers (~18–42 months, three developmental regimes) playing with a nearby caregiver: safe under unrestricted tapping, playable offline after first load, private by design, with no accounts, analytics, or external consequences. **Priority hierarchy (owner-set 2026-08-24):** child engagement and delight → immediate responsiveness → discoverability/agency → replay/variation → interaction polish → developmental value → robustness → abstraction; privacy/safety/offline/accessibility are hard constraints outside the ordering. A mechanic is finished only when its presence improves the child's experience.

## Current milestone

**Epic L in progress: adaptive envelopes (L1), Memory adaptive prototype plus session-ramp refinement (L2), and fixed-level retirement (L4) shipped; L2 hands-on gate remains open (2026-08-24).** Launcher portfolio: Bloom, Color Splash, Peekaboo Pockets, Story Scenes, Memory, Numbers. Stack & Settle and Together Tones are retired and their active sources, pages, styles, and tests are deleted.

- **Numbers v2 gate PASSED** on owner hands-on ("really like… preserve its core direction"); hardening restrained.
- **Memory gate PASSED for the core loop** ("great"); adaptive behavior gate remains open after the owner refined the persistence model.
- **Epic G — interaction polish: COMPLETE**, plus launcher-scroll regression fixed (`pan-y`: menu surfaces pan, play surfaces don't).
- **Epic L:** L1 envelopes closed (see `GAME_ROADMAPS.md` § Adaptive progression envelopes; Bloom/Peekaboo/Story deliberately stable). **L2 shipped and refined:** `supersimplegames.memory.adaptive` record drives pair count 2–3, witnessed preview 1.9→1.4s, mismatch window 1.05→0.85s, arrangement variety — EMA α=0.3, hysteresis tiers (enrich ≥0.72 / simplify ≤0.45), one notch per completed round, ~28% comfort rounds one step simpler; every fresh entry starts at minimum, while historical fluency controls ramp speed; maximum uses a purposeful 3×2 field; grown-ups "Reset playful growth" clears it. Verified by deterministic tests and rendered launch/ramp/reset probes. **Gate remains re-armed for hands-on.**
- Fixed Default/Gentle/Rich levels **retired (L4)**: control and settings field removed with graceful fallback for stored data; Bloom unified at 24-object garden; Color Splash fixed at four identities until L3 adaptation; Numbers row stays 1·2·3 until L5. Retired Stack/Tones sources, pages, styles, and tests deleted from the tree (git retains history). Grown-ups surface now owns "Reset playful growth."

## Decisions

- Owner round-2 direction (in `EVIDENCE.md`): **adaptive progression replaces fixed levels** — hidden, continuous, game-specific, slow/reversible, distribution-not-point-estimate, no cliffs, no generic metrics, no shared engine until game-specific implementations prove shape; caregiver keeps reset/start-simpler/cap-style controls, never a global child classification; fluency records are local gameplay state, never assessment.
- Owner direction 2026-08-24: interaction polish outranks mechanic breadth; Memory/Numbers replaced Stack/Tones; management UI lives behind grown-ups; E1 deferred; residents are world-local experiments (`residents.js` untouched).
- Child play surfaces reject accidental scale/pan; launcher menu pans vertically while blocking zoom ("menu surfaces pan, play surfaces don't"); caregiver page fully zoomable; OS accessibility zoom preserved.
- Rendered verification tooling exists (playwright-core + system Edge vs `npm run dev`, temp workspace). Probes have caught three real pre-release defects (Memory matched-face; Memory rich-card count wiring; Numbers friend placement) — rendered checks mandatory before release claims.

## Open questions

1. **Memory adaptive behavior gate:** do children experience minimum-on-entry plus evidence-gated ramping as "meeting them where they are" — and does the fluency record move for the right reasons? (Owner/child hands-on.)
3. Physical device pass (gesture feel, drag ease, airplane mode) — needs hardware (K2).
4. Observation sessions (Story Scenes depth unfreeze; adaptive-signal validation for Bloom/Peekaboo) — needs participants (K3).

## Evidence gaps

- Child evidence remains informal/owner-relayed plus owner hands-on of both experiments; structured observation pending (K3).
- Adaptation *behavior* is entirely unproven: envelopes and tempo are design hypotheses until the Memory prototype survives hands-on; mechanical EMA correctness proves nothing about child experience.
- Real-device feel unobserved everywhere (K2).

## Next action

**Paused at the refined L2 hands-on gate.** L1, L2, and L4 are implemented, verified, and pushed. Next justified work is L3 Color Splash only if hands-on confirms that minimum-on-entry plus historical ramp-speed behavior feels right; L5 Numbers remains observation-gated. Testing feedback on shipped worlds takes bounded-corrections priority. E1 stays deferred; K remains opportunistic.
