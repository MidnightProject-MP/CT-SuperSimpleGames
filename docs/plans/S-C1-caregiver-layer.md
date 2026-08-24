# Execution plan — C1 caregiver-layer architecture

Disposable machinery for [`ROADMAP.md`](../ROADMAP.md) story C1. Delete after commit.

## Current state (inspected 2026-08-23)

- `src/settings.js` already provides the storage-injection + restricted-storage-harmless pattern (sound preference, legacy key migration); `test/settings.test.js` covers it.
- Launcher (`index.html` + `src/launcher.js` + `launcher.css`) renders six static cards; no per-world data attributes yet.
- `sw.js` precaches the shell (CACHE_NAME v41); new files must be added and the cache bumped.
- No caregiver surface exists. Child-facing controls today: per-game sound toggle, Fresh (confirmed), back link.

## Design (C1 slice)

- **Settings model** (`src/caregiver-settings.js`, pure): versioned JSON at `supersimplegames.caregiver-settings` — `{ version: 1, sessionMinutes: null|5..60, level: null|"gentle"|"rich", hiddenWorlds: ⊆ WORLD_IDS }`; per-field sanitization, parse-failure/restricted-storage → defaults; `visibleWorlds(settings)` helper. Sound keeps its existing shared key.
- **Gate** (launcher footer): small muted "For grown-ups" control; press-and-hold 1500 ms with visible progress; single taps do nothing; keyboard Enter activates directly (a11y over toddler-gating for keyboard users). Navigates to `caregiver.html`.
- **Caregiver page** (`caregiver.html` + `caregiver.css` + `src/caregiver.js`): adult typography; immediate-persistence controls for Sound (shared key), Session length (off/10/15/20/30 — consumed by C2 later), Developmental level (default/gentle/rich — consumed by C3 later), Worlds shown (six checkboxes; cannot hide the last visible world), and Reset everything (clears all `supersimplegames.*` + legacy keys after confirm).
- **Launcher filtering:** hidden worlds' cards are hidden; if the stored set would empty the launcher, show all.
- **Offline shell:** SW bump + new assets.

C2 (wind-down behavior) and C3 (worlds reading level) are separate stories; C1 only stores their settings.

## Work orders

| # | Order | Executor | Verification |
|---|---|---|---|
| 1 | Settings module + tests | delegated | `npm test` green |
| 2 | Gate, caregiver page, launcher filtering, SW bump | delegated | rendered checks: tap-vs-hold gate, persistence across reload, card hiding, reset |
| 3 | Adjudicate + docs (PRODUCT caregiver section, ROADMAP, STATE) | Celestan | docs consistent |

## Exit condition

Caregiver surface gated and functional offline; child-facing UI unchanged except the muted footer gate; settings survive reload; deterministic + rendered verification recorded; docs updated.
