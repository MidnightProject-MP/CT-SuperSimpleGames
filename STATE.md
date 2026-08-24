# SuperSimpleGames — project state

## Objective

A local-only collection of six no-fail web worlds for toddlers (~18–42 months, three developmental regimes) playing with a nearby caregiver: safe under unrestricted tapping, playable offline after first load, private by design, with no accounts, analytics, or external consequences. **Priority hierarchy (owner-set 2026-08-24):** child engagement and delight → immediate responsiveness → discoverability/agency → replay/variation → interaction polish → developmental value → robustness → abstraction; privacy/safety/offline/accessibility are hard constraints outside the ordering. A mechanic is finished only when its presence improves the child's experience.

## Current milestone

**Round-1 experiment feedback processed; Numbers rebuilt as v2; both worlds back at their gates (2026-08-24).** Launcher portfolio: Bloom, Color Splash, Peekaboo Pockets, Story Scenes, Memory, Numbers. Stack & Settle and Together Tones retired from launcher/shell/settings; sources inert in-tree.

- **Epic G — interaction polish: COMPLETE**, plus one post-release regression fixed (launcher `touch-action: pan-y` so touch scrolling works while pinch stays blocked).
- **Memory: gate PASSED on owner hands-on** ("great, super simple"). H3 restrained to the caregiver-level third pair (rich = 3 pairs, three-column layout); nothing more until child observation.
- **Numbers v1 rejected at gate** (word-count text instead of numerals; visually quiet). **I2b redesign shipped the same day:** oversized tappable numeral bubbles (1·2·3; rich 1–5); tapping a number flashes a giant ghost digit and bursts that many friends into a meadow with staggered arrivals and per-item rising tones; every friend is individually touchable. Rendered-verified end-to-end; deterministic core tested. **Gate re-armed for next hands-on round.**
- Launcher-scroll lesson recorded in `EVIDENCE.md`: menu surfaces pan, play surfaces don't.

## Decisions

- Owner direction 2026-08-24 (recorded in `EVIDENCE.md`): interaction polish outranks mechanic breadth; Memory/Numbers replace Stack/Tones; Fresh/reset controls live behind the grown-ups surface (generalized to all management UI); E1 identity deferred until retained worlds feel excellent; residents are world-local experiments first — `residents.js` deliberately unchanged this phase.
- Child play surfaces reject accidental scale/pan gestures; the caregiver surface stays fully zoomable; OS accessibility zoom is the preserved path.
- Memory lead concept is matching + spatial recall (owner-revised away from a "who's hiding?" request variant to stay distinct from Peekaboo).
- Rendered verification tooling now exists: playwright-core + system Edge probes against `npm run dev` (temp workspace, not repo). Probe harnesses have caught two real pre-release defects (Memory matched-face visibility; Numbers friend placement) — rendered checks are mandatory before release claims.
- Numbers v2 direction (owner, round-1 feedback): big real numerals are the interface — owner taste overrode the research-informed "numerals later" stance.

## Open questions (evidence gates)

1. **Memory (gate passed on owner signal):** do the *children* return to it voluntarily, and does the rich-level third pair get used? Observation pending.
2. **Numbers v2 gate (re-armed):** do children connect the numeral they pressed with how many friends appeared — re-tapping deliberately to make "two" or "three"?
3. Physical device pass (zoom-fix feel, drag ease, airplane mode) — needs hardware.
4. Observation sessions (Story Scenes depth unfreeze; persona revision) — needs participants.

## Evidence gaps

- Only one informal child-evidence source exists (owner-relayed Bloom engagement + zoom interference); structured observation pending (K3).
- Real-device feel unobserved everywhere (K2); all new-world evidence is deterministic + headless-rendered only.

## Next action

**Paused at the re-armed evidence gates.** Resume only on: (a) owner/child hands-on signal for Numbers v2 → I3 hardening/widening per what survived; child-interest signal for Memory → only then consider more; (b) testing feedback on any shipped change → bounded corrections first; (c) hardware/participants → K2/K3. Do not add mechanics to retained worlds; E1 stays deferred until real-use quality is confirmed. Update this file at milestone boundaries; record decision-changing evidence in `EVIDENCE.md`.
