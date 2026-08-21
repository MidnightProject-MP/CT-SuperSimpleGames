# SuperSimpleGames — project state

## Objective

A local-only collection of six no-fail web games for toddlers (~18–36 months) playing with a nearby caregiver: safe under unrestricted tapping, playable offline after first load, private by design, with no accounts, analytics, or external consequences.

## Current milestone

Experiential simplification — **Milestone 6A implemented, awaiting the owner's hands-on decision gate**. Bloom was revised so ordinary play reaches every layer: multi-color triple merges into bouquets (median tap ~15–18), three bouquets become a tree (median tap ~55–63; ≥93% of traces by tap 100), six-color ancestry triggers a rainbow-tree celebration, and three nearby trees dissolve in a send-off that declutters (~11–12 live objects at session end). Tending pulls blooms toward kin, planting between two blooms resolves to their midpoint, and new bouquets settle toward neighbours. CI guards these rates via seeded ordinary-play traces; headless-Edge rendered traces confirmed arrivals at taps 50–130 on both reference viewports.

## Decisions

- No new feature layers until existing depth is reachable and controls earn their attention cost (`ROADMAP.md` owns sequencing).
- Colors are no longer merge gates; they are the celebration: multi-color merging removed dead zones, and a rainbow tree (all six ancestry colors) is the rare climax. "Flowers cycle through named colors" remains true.
- Aggressive decluttering by owner direction: tier cap stays at trees; three nearby trees dissolve together instead of escalating to a third merged object.
- Familiar World shared meanings are implemented without cross-game progression, collection, or unlock state.
- App icon: flat centered six-petal flower on white, plus a dedicated maskable variant for Android launchers; splash `background_color` white.

## Open questions

- Does hands-on play now reproduce bouquets, trees, and a rainbow tree comfortably (the 6A decision gate)?
- Which physical device(s) are available for the pending touch-device and airplane-mode observation pass?
- When can caregiver/child observation sessions be arranged, and with how many children?

## Evidence gaps

- Nothing is child-validated; every passing claim is mechanical, simulated, or rendered only.
- The 6A rates come from seeded trace models plus rendered synthetic taps; real toddler thumbs differ in rhythm and precision.
- Real-device airplane-mode exercise (launcher → each game → Home) has never been performed.
- Physical touch-device checks (e.g., Color Splash frame geometry) pending.

## Next action

Owner plays Bloom on a device and confirms the decision gate (encounters and deliberately reproduces bouquet, tree, rainbow). On confirmation, update `EVIDENCE.md`/`ROADMAP.md` and start Milestone 6B (Story Scenes transition friction).
