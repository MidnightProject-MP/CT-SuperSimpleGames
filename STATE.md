# SuperSimpleGames — project state

## Objective

A local-only collection of six no-fail web worlds for toddlers (~18–42 months, three developmental regimes) playing with a nearby caregiver: safe under unrestricted tapping, playable offline after first load, private by design, with no accounts, analytics, or external consequences. **Priority hierarchy (owner-set 2026-08-24):** child engagement and delight → immediate responsiveness → discoverability/agency → replay/variation → interaction polish → developmental value → robustness → abstraction; privacy/safety/offline/accessibility are hard constraints outside the ordering. A mechanic is finished only when its presence improves the child's experience.

## Current milestone

**Portfolio replanned and executed through Epic G; Memory and Numbers experiments live at their evidence gates (2026-08-24).** Launcher portfolio: Bloom, Color Splash, Peekaboo Pockets, Story Scenes, Memory (experiment), Numbers (experiment). Stack & Settle and Together Tones retired from launcher/shell/settings per owner direction; sources inert in-tree pending deletion.

- **Epic G — interaction polish: COMPLETE.** G1 gesture protection (`touch-action` policy + Safari gesture guard on every child page; caregiver page zoomable); G3 protected Color Splash completion hold; G2 world-local resident life (butterfly hops real squares of the finished board; snail travels the garden edge facing travel direction); G4 direct scene chips + Fresh relocated behind the grown-ups ("Clear saved creations"); G5 hygiene (mojibake arrows repaired, single live region per world, dead CSS removed, softened tone endings, alternating Peekaboo greetings).
- **Epics H/I — experiments SHIPPED, gates ACTIVE.** Memory Pairs (matching + spatial recall over witnessed info) and Number Nibbles (quantity as add/remove event with tone steps and creature reactions) are live behind launcher slots. Deterministic cores tested (196 checks green); rendered childlike playthroughs verified headlessly. Per owner instruction: **no hardening, widening, or polish on either until children/owner play them.** H3/I3 blocked on that signal.

## Decisions

- Owner direction 2026-08-24 (recorded in `EVIDENCE.md`): interaction polish outranks mechanic breadth; Memory/Numbers replace Stack/Tones; Fresh/reset controls live behind the grown-ups surface (generalized to all management UI); E1 identity deferred until retained worlds feel excellent; residents are world-local experiments first — `residents.js` deliberately unchanged this phase.
- Child play surfaces reject accidental scale/pan gestures; the caregiver surface stays fully zoomable; OS accessibility zoom is the preserved path.
- Memory lead concept is matching + spatial recall (owner-revised away from a "who's hiding?" request variant to stay distinct from Peekaboo).
- Rendered verification tooling now exists: playwright-core + system Edge probes against `npm run dev` (temp workspace, not repo). Probe harnesses caught one real pre-release defect (Memory matched-face visibility).

## Open questions (evidence gates)

1. **Memory gate:** do toddlers act on remembered locations after mismatches reveal them, and does the loop delight without instruction?
2. **Numbers gate:** does free add/remove play stand alone, and does quantity change read as the child's own doing?
3. Physical device pass (zoom-fix feel, drag ease, airplane mode) — needs hardware.
4. Observation sessions (Story Scenes depth unfreeze; persona revision) — needs participants.

## Evidence gaps

- Only one informal child-evidence source exists (owner-relayed Bloom engagement + zoom interference); structured observation pending (K3).
- Real-device feel unobserved everywhere (K2); all new-world evidence is deterministic + headless-rendered only.

## Next action

**Paused at the H2/I2 evidence gates.** Resume only on: (a) owner/child hands-on signal for Memory or Numbers → resume H3/I3 respectively (harden what survived, widen via caregiver level); (b) testing feedback on Epic G changes → bounded corrections first; (c) hardware/participants → K2/K3. Do not add mechanics to retained worlds; do not touch E1 until real-use quality is confirmed. Update this file at milestone boundaries; record decision-changing evidence in `EVIDENCE.md`.
