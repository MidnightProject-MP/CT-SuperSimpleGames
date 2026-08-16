# Product roadmap

This is the authoritative cross-game execution order. `PRODUCT.md` owns the product contract; `GAME_ROADMAPS.md` owns detailed per-game possibilities; `EVIDENCE.md` owns what has actually been observed or verified.

## Current position

- **Active phase:** Familiar World
- **Next milestone:** pilot one recurring resident outside Bloom
- **Last reconciled:** 2026-08-16
- **Behavior baseline:** commit `408f751`

The collection has six distinct playable worlds. The shared control and preservation foundation is implemented, and Color Splash now uses a stable board frame. The next useful question is whether one deterministic resident can recur across worlds without becoming a reward, distraction, or metagame.

## Governing direction

SuperSimpleGames should grow from simple reactions into simple, dependable worlds.

- The first ordinary action is effortless and immediately acknowledged.
- Imprecise but plausible input is treated as intent, not failure.
- Repetition reveals understandable relationships rather than more valuable rewards.
- Children can revisit and alter earlier actions; their work is not silently erased.
- Games remain distinct forms of agency: creation, connected-region reasoning, search, construction, storytelling, and temporal play.
- Completion creates a restful pause. Finite games offer deliberate replay; open-ended games confirm before clearing.
- Scores, streaks, timers, unlocks, rare rewards, autoplay, nagging, analytics, accounts, and external consequences remain out of scope.

## Familiar World

This phase gives the six games a few transferable meanings without creating progression, currency, collectibles, or a shared reward layer.

### Completed foundation

1. **Shared control meanings — implemented.** Home leaves without clearing. Again replays a finite experience. Different changes a bounded prompt without erasing unrelated work. Fresh is reserved for destructive clearing.
2. **Bounded preservation — implemented.** Bloom, Stack & Settle, and Story Scenes restore one versioned local creation. Fresh requires “Keep playing” or “Start fresh.” Invalid, incompatible, oversized, or unavailable storage cannot prevent play.
3. **Stable Color Splash frame — implemented and rendered.** Prompt, board, and Back one own fixed grid rows; teaching boards and later boards share one outer frame; completion overlays the board. Automated checks and rendered 390×844 portrait and 640×360 short-landscape checks pass. Physical touch-device and child evidence remain pending.

Implementation detail and evidence belong in `PRODUCT.md`, `GAME_ROADMAPS.md`, and `EVIDENCE.md`; this roadmap records only sequencing and decision state.

### Next: recurring resident pilot

Introduce the existing bird into one additional world only where a visible child-created condition makes its arrival understandable and reproducible.

The smallest coherent pilot must:

- reuse a recognizable visual identity without requiring memory or explanation;
- arrive because of stable local state, never elapsed time, rarity, or random reward;
- remain non-collectible, bounded, optional, and locally responsive;
- preserve the host game's distinct agency and complete sound-off behavior;
- leave without deleting or rearranging child-authored work;
- be verified in rendered portrait and short landscape before release.

Do not add the bird to several games at once. One additional world is enough to learn whether recurrence feels familiar or merely decorative.

### Then

4. Introduce shared relationship meanings only where they fit existing agency—such as home, bridge, rain, sun, repetition, together, and rest.
5. Add one caregiver-triggered, non-automatic closing ritual that leaves the product at rest.
6. Observe whether children transfer control meanings, recognize and reproduce a resident condition, recover saved work, avoid accidental resets, and disengage naturally.
7. Resume the strongest per-game Round 3 milestone from `GAME_ROADMAPS.md`; choose using current evidence, not document age.

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
