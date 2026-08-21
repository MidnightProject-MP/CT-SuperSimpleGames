# Product roadmap

This is the authoritative cross-game execution order. `PRODUCT.md` owns the product contract; `GAME_ROADMAPS.md` owns detailed per-game possibilities; `EVIDENCE.md` owns what has actually been observed or verified.

## Current position

- **Active phase:** Experiential simplification
- **Next milestone:** six-world clutter and stability review (6C)
- **Last reconciled:** 2026-08-21
- **Current milestone state:** 6A closed by owner gate; 6B implemented, rendered-verified, awaiting owner review

The collection has six distinct playable worlds. Shared control, preservation, spatial stability, the first recurring resident, and the first shared relationship meaning are implemented. The current need is not another layer of features. It is to ensure that existing depth is reachable, visible controls earn their attention cost, and the six worlds feel simpler to a child as their underlying systems become more capable.

## Governing direction

SuperSimpleGames should grow from simple reactions into simple, dependable worlds.

- The first ordinary action is effortless and immediately acknowledged.
- Imprecise but plausible input is treated as intent, not failure.
- Repetition reveals understandable relationships rather than more valuable rewards.
- Children can revisit and alter earlier actions; their work is not silently erased.
- Every object, control, state, confirmation, and rule competes with the play itself. Add one only when its child-facing value exceeds that attention cost.
- Complexity belongs behind the experience when forgiving resolution, reversible state, stable layout, or deterministic assistance can preserve intent without exposing another mode.
- A mechanic is not experientially available until it can be encountered and deliberately reproduced through ordinary play. Mechanical implementation, rendered reachability, and child understanding are separate claims.
- Games remain distinct forms of agency: creation, connected-region reasoning, search, construction, storytelling, and temporal play.
- Completion creates a restful pause. Finite games offer deliberate replay. Destructive actions receive friction proportional to the value and replaceability of what would be lost; prefer making an action reversible or nondestructive underneath the interface.
- Scores, streaks, timers, unlocks, rare rewards, autoplay, nagging, analytics, accounts, and external consequences remain out of scope.

## Familiar World

This phase gives the six games a few transferable meanings without creating progression, currency, collectibles, or a shared reward layer.

### Completed foundation

1. **Shared control meanings — implemented.** Home leaves without clearing. Again replays a finite experience. Different changes a bounded prompt without erasing unrelated work. Fresh is reserved for destructive clearing.
2. **Bounded preservation — implemented.** Bloom, Stack & Settle, and Story Scenes restore one versioned local creation. Fresh requires “Keep playing” or “Start fresh.” Invalid, incompatible, oversized, or unavailable storage cannot prevent play.
3. **Stable Color Splash frame — implemented and rendered.** Prompt, board, and Back one own fixed grid rows; teaching boards and later boards share one outer frame; completion overlays the board. Automated checks and rendered 390×844 portrait and 640×360 short-landscape checks pass. Physical touch-device and child evidence remain pending.
4. **Recurring resident pilot — implemented and rendered.** A child-built Stack & Settle bridge deterministically invites Bloom's spotted bird. It has one recognizable identity, four bounded local responses, no collection state, and no effect on the construction. The bridge and bird survive portrait-to-landscape reflow; rebuilding the condition can invite it again. Child recognition and intentional reproduction remain unobserved.
5. **Shared “together” meaning — implemented and rendered.** Two open Peekaboo friends derive one visible connector and a scene-specific reunion: snuggle, move, float, or swim. Either friend repeats it; closing either home removes it. This aligns with existing Bloom links, Story relationships, and Together Tones pairs without sharing state or forcing identical animation. Child transfer of the meaning remains unobserved.

Implementation detail and evidence belong in `PRODUCT.md`, `GAME_ROADMAPS.md`, and `EVIDENCE.md`; this roadmap records only sequencing and decision state.

## Active sequence

### Milestone 6A — make existing depth reachable — closed 2026-08-21

Bloom's second-tier merge was mechanically implemented but unreachable through ordinary play. Deterministic traces located the cause in supply arithmetic (post-cap freeze plus rigid color cycling) rather than merge radius, and the owner set a ~50-tap reachability target with aggressive decluttering. The revision ships: multi-color merging, ancestry-color rainbow trees with a full-screen skippable cutscene, three-tree send-off dissolution, tending pull, midpoint planting, and bouquet gathering. Seeded ordinary-play traces reach the first bouquet by tap 50 in ~98% of runs and a tree by tap 100 in ≥93%; rendered headless-Edge traces confirmed arrivals at taps 50–130 on both reference viewports; CI guards these rates.

**Decision gate:** passed by the product owner on 2026-08-21 after hands-on reproduction of every layer.

### Milestone 6B — remove management friction from Story Scenes — implemented, awaiting owner review

Shipped: choosing a setting now switches immediately — the preview-and-confirm dialog is gone. Each scene parks in its own slot and switching restores it exactly, so background changes never destroy work (older single-scene snapshots migrate losslessly; Fresh clears only the visible scene). Per owner feedback, related placements and moves now snap the touched object snugly beside its partner, and combined tableaux render at an anchor clear of the participants instead of overlapping them. 156 deterministic checks pass, including world round-trip, legacy migration, snap-gap, and anchor validation; an 11-check rendered headless-Edge pass covers empty, sparse, dense, parked-restore, reload persistence, orientation change, and rendered snap geometry.

**Decision gate:** retain this transition only if the owner finds it more direct without scene loss ever feeling surprising; confirm the snap distance feels friendly rather than grabby.

### Milestone 6C — six-world clutter and stability review

Review every world as a child encounters it, not merely as a set of completed mechanics. Use representative empty, active, dense, completion, replay, restored, and short-landscape states where applicable.

For each visible element ask:

- Does it support the central action now?
- Is its meaning available through position, shape, motion, or consequence rather than text alone?
- Can the same protection or assistance happen invisibly?
- Does appearing, disappearing, or changing state move the child's working surface?
- Does dense play settle, combine, reuse, or otherwise remain readable?

Record only decision-changing rendered evidence. Correct clear interaction failures in bounded slices; do not turn the review into a visual redesign or content pass.

### Then — shared grammar and caregiver architecture

Reconcile Home, Again, Different, Fresh, persistence, familiar/new choices, residents, relationship meanings, wind-down, and caregiver controls as one small product grammar. The caregiver-triggered closing ritual remains a strong candidate, but should be designed within that layer rather than added as another isolated child-facing control.

After that:

1. Observe whether children transfer control and relationship meanings, recognize and reproduce resident conditions, recover saved work, avoid accidental resets, and disengage naturally.
2. Choose the strongest per-game depth milestone using current evidence, not document age or the historical round order.
3. Explore developmental complexity as caregiver-selected changes to tolerance, density, and relationship depth—not scores, locks, performance inference, or forced progression.
4. Explore a small number of coherent visual-identity directions on representative screens before considering a collection-wide change. Do not ship a theme selector merely to support design comparison.

## Spatial stability and zoom

The child's working surface is a place, not a moving target.

- Browser and accessibility zoom remain available.
- Game-directed zoom or reframing is used only when a mechanic materially benefits from it.
- Controls reserve space or overlay content; appearing controls must not unexpectedly move the active surface.
- Orientation reflow is deterministic and preserves relative meaning, identity, and work.
- Rendered geometry is checked whenever layout state changes; HTTP availability or source inspection is not a substitute.

## Evidence and execution

Incomplete child evidence does not stop bounded, reversible experimentation. It limits the claims that may be made.

For each milestone:

1. Check `EVIDENCE.md` and ask: **What has changed since this plan was formed, what new evidence has arrived, and does the documented understanding still reflect it?**
2. Implement the smallest coherent interaction that tests the current question.
3. Verify deterministic state, bounds, safety, offline behavior, accessibility, and relevant rendered interactions.
4. Record new evidence in `EVIDENCE.md`; update current truth only in its owning document.
5. Reconcile this roadmap when evidence changes the next decision. Do not preserve obsolete active plans merely as history; Git already preserves their wording.

Stop for user input only when progress requires authority, credentials, unavailable real-world participation, an irreversible decision, or a product choice whose alternatives materially change the intent.
