# Execution plan — C3 developmental-level adoption

Disposable machinery for [`ROADMAP.md`](../ROADMAP.md) story C3. Delete after commit.

## Current state (inspected 2026-08-24)

- C1 stores `level` (null|"gentle"|"rich") in caregiver settings; nothing consumes it. Release 2bf9860 (v43) is live.
- Constraint from the roadmap: no gates, modes, or child-visible difference; default level must reproduce today's behavior exactly; adopt one parameter per world, gradually.

## Parameter decisions (Celestan judgment)

| World | Parameter | gentle | default (null) | rich |
|---|---|---|---|---|
| Bloom | live-object cap | 16 | 24 | 24 |
| Color Splash | identities on non-teaching boards | 3 | 4 | 4 |
| Peekaboo Pockets | — level-neutral: already targets the youngest regime; documented rationale | — | — | — |
| Stack & Settle | idea-card default visibility | hidden | shown | shown |
| Story Scenes | — level-neutral: depth frozen pending child observation (B3) | — | — | — |
| Together Tones | pattern-motif layer | hidden | shown | shown |

Rationale: gentle reduces density/abstract elements for the youngest regime; rich stays at today's behavior until evidence supports widening (no clutter-permitting parameter increases). Peekaboo/Story Scenes neutrality is a documented decision, not an omission.

## Work orders

| # | Order | Executor | Verification |
|---|---|---|---|
| 1 | Level resolution helper + per-world parameter wiring + tests | delegated | `npm test` green; default === today exactly |
| 2 | Rendered verification (gentle changes visible, default unchanged) | delegated | screenshots + assertions both viewports |
| 3 | Adjudicate + docs (PRODUCT, GAME_ROADMAPS, ROADMAP, STATE) + release | Celestan | CI green, Pages live |

## Exit condition

Level adopted where meaningful, neutrality documented elsewhere, default behavior byte-equivalent, verification recorded, released.
