# SuperSimpleGames — project state

## Objective

A local-only collection of six no-fail web games for toddlers (~18–36 months) playing with a nearby caregiver: safe under unrestricted tapping, playable offline after first load, private by design, with no accounts, analytics, or external consequences.

## Current milestone

Experiential simplification — **Milestone 6A: make existing depth reachable**. Bloom's second-tier merge (flowering tree) is implemented but was never reproduced through ordinary play; treat that as a defect signal. Build a deterministic way to measure tier-1 vs tier-2 encounter rates, revise the merge relationship so the tree is realistically reachable without adding any child-facing mode, counter, or hint, then verify pure behavior plus rendered portrait/short-landscape checks.

## Decisions

- No new feature layers until existing depth is reachable and controls earn their attention cost (`ROADMAP.md` owns sequencing).
- Bloom tier-2 non-reproduction is a revision signal, not a request for instructions or hints.
- Familiar World shared meanings (controls, preservation, resident bird, "together") are implemented without cross-game progression, collection, or unlock state.
- App icon restyled (2026-08-21): flat centered six-petal flower with white ring separation on a plain white background, no stem/hill/gradients — owner wants a clean Google-style mark; manifest splash `background_color` set to `#ffffff` to match; SW cache bumped to v36 so installed clients refresh assets.

## Open questions

- Which physical device(s) are available for the pending touch-device and airplane-mode observation pass?
- When can caregiver/child observation sessions be arranged, and with how many children?

## Evidence gaps

- Nothing is child-validated; every passing claim is mechanical or rendered only.
- Rendered in-app-browser evidence exists (2026-08-16) for Color Splash transitions, Bloom restoration/Fresh, Stack bridge-bird, Peekaboo reunions; other game/device matrices incomplete.
- Real-device airplane-mode exercise (launcher → each game → Home) has never been performed; automation alone is recorded as insufficient.
- Physical touch-device checks (e.g., Color Splash frame geometry) pending.
- Bloom tier-2 merge still unreproduced by ordinary play; new icon not yet seen on an actual device launcher.

## Next action

Start Milestone 6A: implement the deterministic encounter-rate harness and Bloom merge revision, verify with `npm test`, then exercise the result rendered at representative portrait and short-landscape viewports before updating `EVIDENCE.md`.
