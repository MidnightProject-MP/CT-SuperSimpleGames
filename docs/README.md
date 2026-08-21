# Documentation map

The documentation is a decision system, not a stack of equally authoritative notes.

## Authority order

1. **[`INCEPTION.md`](../INCEPTION.md) — founding intent.** Why the project exists. Historical context, not a current feature list or roadmap.
2. **[`PRODUCT.md`](./PRODUCT.md) — current product contract.** Audience hypothesis, safety boundary, experience principles, current game behavior, non-goals, and claim limits.
3. **[`ROADMAP.md`](./ROADMAP.md) — current cross-game sequence.** The active milestone and what comes after it. This overrides older sequencing elsewhere.
4. **[`GAME_ROADMAPS.md`](./GAME_ROADMAPS.md) — per-game depth.** Detailed implemented and proposed mechanics. It supplies candidates; the portfolio roadmap chooses when they run.
5. **[`EVIDENCE.md`](./EVIDENCE.md) — evidence and feedback provenance.** What was observed, by whom or by what method, what it changed, and what remains unknown.
6. **Playtest files — observation protocols.** They describe how future evidence should be gathered. Blank sheets and thresholds are not evidence that a game passed.
7. **[`IDEAS.md`](./IDEAS.md) — uncommitted exploration.** Only ideas not yet promoted into a roadmap or rejected.
8. **[`CONCEPTS.md`](./CONCEPTS.md) — historical design decision.** Why early interaction models were selected or deferred. It does not direct current sequencing.

`README.md` is the public project entry point. It summarizes rather than owning product or roadmap truth.

## Maintenance rule

- Put a fact in the document that owns it and link to it elsewhere.
- When an idea ships, remove its competing speculative description from `IDEAS.md`.
- When a plan is superseded, replace the active plan; preserve only decision-relevant history in `EVIDENCE.md` or `CONCEPTS.md`. Git preserves the rest.
- Label evidence by source: child observation, caregiver report, product-owner feedback, rendered inspection, deterministic verification, deployment verification, or external guidance.
- Implementation permits “mechanically implemented” claims. Rendered reachability, ordinary-play reproducibility, physical-device comfort, caregiver interpretation, and child understanding are separate evidence layers; do not infer one from another.
- At milestone boundaries and after material feedback, ask: **What has changed since this plan was formed, what new evidence have I received, and does the project’s documented understanding still reflect what I now know?**

This reconciliation should remain lightweight: correct stale truth, record consequential evidence, and continue building.
