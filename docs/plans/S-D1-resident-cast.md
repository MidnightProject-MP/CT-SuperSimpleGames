# Execution plan — D1 recurring-resident cast expansion

Disposable machinery for [`ROADMAP.md`](../ROADMAP.md) story D1. Delete after commit.

## Current state (inspected 2026-08-24)

- Existing resident pattern (Bloom): pure derivation (`gardenVisitorFor`), `#visitor-layer` + `.garden-visitor[data-type]` button, CSS art per type, bounded touch budget, per-type tones, never mutates work. Stack reuses the bird identity.
- D2 finding: invitation conditions must be reachable through ordinary clustered play.
- Worlds without residents: Color Splash, Peekaboo (level-neutral, friends are the cast — skip), Story Scenes (surface verified; residents are visitors, not depth), Together Tones (first replacement candidate per B3 — do not invest).

## Design (this slice)

1. **Butterfly → Color Splash** (existing character reappearing — strongest continuity): invitation = board completion (guaranteed reachable, no-fail). Perches near the board's top-right; 3 touches (flap + small hop) then flies home; gone when a new board starts. Same visual identity as Bloom's butterfly (CSS values duplicated into `color-splash.css`; identical art).
2. **Snail → Story Scenes, Garden weather only**: invitation = 3+ objects placed (ordinary clustered play reaches this in ~6 taps per D2). Slides in at bottom-left; 3 touches (slow slide + wobble) then slides home; leaves if the object count drops below 3.
3. Both: derived deterministically per render; never move or consume work; no persistence or collection state; visual-only this slice (tones documented as follow-up); reduced-motion instant states.
4. New `src/residents.js`: tiny pure helpers (`colorSplashResidentFor(completion)`, `storyResidentFor({scene, objectCount})`) + a spawn/attach DOM helper shared by both worlds. Bloom/Stack keep their existing implementations (no refactor of working code).

## Exit condition

Both residents live, discoverable through ordinary play (rendered probe), identity consistent with Bloom's butterfly, deterministic tests green, docs updated, released.
