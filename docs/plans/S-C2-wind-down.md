# Execution plan — C2 wind-down and stopping ritual

Disposable machinery for [`ROADMAP.md`](../ROADMAP.md) story C2. Delete after commit.

## Current state (inspected 2026-08-23)

- C1 ships `caregiver-settings` with `sessionMinutes` (null/off or 5–60) persisted at `supersimplegames.caregiver-settings`; nothing consumes it yet.
- Seven surfaces need the ritual: launcher + six game pages. Each game page already loads its own module + shared stylesheets; `sw.js` v42 precaches the shell.
- Product constraints: never countdown pressure on the child; no scores/timers visible as such; reduced-motion respect; sound-off completeness; rest must not look like failure or a lock; restart possible with deliberate friction.

## Design (C2 slice)

- **Pure core** (`src/wind-down.js`): `computeWindDown({ startedAt, minutes, now })` → `{ phase: "play"|"evening"|"rest" }`. Off/missing/invalid → play. Evening = final 120 s before the set duration; rest afterwards. Clamps guard clock anomalies.
- **Session anchor:** the caregiver page writes `sessionStartedAt = Date.now()` (key `supersimplegames.session-start`) whenever a duration is chosen; choosing Off clears it.
- **Applier:** polls every 5 s; sets `wind-down-evening` / `wind-down-rest` classes on `<body>`. Evening: slow dim toward warm low light (CSS filter + gradient overlay, animation only when motion allowed). Rest: a calm full-screen good-night veil — per-world line (garden/pockets/board/blocks/stories/tones flavors), moon mark, and one deliberate "Play again" sun control; tapping it starts a fresh session (clears anchor, removes rest) — a decision, not an accidental tap. No countdown numbers anywhere.
- **Wiring:** each page's main module (7 files) imports and starts the applier; pages link `wind-down.css`; `sw.js` bump (v43) with new assets.
- Audio softening and per-world bespoke scenes (animals homeward, flowers closing) are follow-up depth, not this slice.

## Work orders

| # | Order | Executor | Verification |
|---|---|---|---|
| 1 | Pure core + tests | delegated | `npm test` green |
| 2 | Applier, caregiver-page anchor write, 7-page wiring, CSS, SW bump | delegated | rendered: evening class at T-60s, rest veil at T+60s with per-world line, Play again restores play phase, Off never triggers |
| 3 | Adjudicate + docs (PRODUCT, ROADMAP, STATE) | Celestan | docs consistent |

## Exit condition

Ritual functions across launcher + all six worlds offline; no countdown pressure; rest is calm and reversible by deliberate choice; deterministic + rendered verification recorded; docs updated.
