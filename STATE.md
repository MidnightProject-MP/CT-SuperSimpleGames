# SuperSimpleGames — project state

## Objective

A local-only collection of six no-fail web worlds for toddlers (~18–42 months, three developmental regimes) playing with a nearby caregiver: safe under unrestricted tapping, playable offline after first load, private by design, with no accounts, analytics, or external consequences. **Priority hierarchy (owner-set 2026-08-24):** child engagement and delight → immediate responsiveness → discoverability/agency → replay/variation → interaction polish → developmental value → robustness → abstraction; privacy/safety/offline/accessibility are hard constraints outside the ordering. A mechanic is finished only when its presence improves the child's experience.

## Current milestone

**Portfolio replan accepted by owner (2026-08-24) and in autonomous execution.** Trigger: first real child evidence (owner-relayed: children engage with Bloom; accidental pinch-zoom materially interferes; resident concept validated in Bloom but weak in Color Splash). Active portfolio: **Bloom, Color Splash, Peekaboo Pockets, Story Scenes + Memory and Numbers as experimental replacements for Stack & Settle and Together Tones** (retired from launcher immediately per owner decision; sources inert in-tree). Epic G = retained-world interaction polish (G1 gesture protection → G3 protected completion → G2 world-local resident life → G4 control simplification → G5 hygiene); Epic H/I = Memory ("Memory Pairs", matching + spatial recall) and Numbers ("Number Nibbles", quantity-as-event) playable experiments with hard stop-and-wait evidence gates after each; E1 identity deferred until G completes.

## Decisions

- Owner direction 2026-08-24 (recorded in `EVIDENCE.md`): interaction polish outranks mechanic breadth; Memory/Numbers replace Stack/Tones (B3 keep-all-six superseded); Fresh/reset controls live behind the caregiver surface — same principle for all application-management UI; E1 waits; residents are world-local experiments first, shared abstraction only from proven common behavior (Bloom is quality reference, not architecture reference).
- Child play surfaces reject accidental scale/pan gestures (`touch-action` policy + Safari gesture guard); caregiver page stays fully zoomable; OS accessibility zoom is the preserved path. Supersedes the old in-page browser-zoom guarantee.
- Memory lead concept is matching + spatial recall (witnessed intro → hide → find pairs), explicitly distinct from Peekaboo search/reveal; owner revised away from the "Who's hiding?" request variant.
- Planning hierarchy Project → Epic → Story carries intent; disposable execution plans live in `docs/plans/`; personas remain active decision instruments; routine experiential gates self-adjudicated via rendered evidence + persona review; human escalation reserved for taste, authority, inaccessible real-world information, consequential judgment.
- Per-game Round-3 depth milestones stay paused/frozen; retired-world roadmap sections are history only.

## Open questions

- Physical device availability for K2 touch-device + airplane-mode passes.
- Child/caregiver availability for K3 observation sessions (also the Story Scenes depth-unfreeze gate).
- H2/I2 gates: do toddlers act on remembered locations (Memory) and treat quantity change as their own doing (Numbers)? Owner/child hands-on decides before any hardening.

## Evidence gaps

- Only one informal child-evidence source exists (owner-relayed); structured observation still pending (K3).
- Real-device airplane-mode exercise has never been performed (K2).
- Rendered verification for new work uses local headless probes; physical-device feel remains unobserved everywhere.

## Next action

Execute Epic G stories in order, then H1/H2 and I1/I2 experiments, stopping at each evidence gate for owner/child hands-on. Update this file at milestone boundaries; record decision-changing evidence in `EVIDENCE.md`.
