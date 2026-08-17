# Product roadmap

This is the authoritative cross-game execution order. `PRODUCT.md` owns the product contract; `GAME_ROADMAPS.md` owns detailed per-game possibilities; `EVIDENCE.md` owns what has actually been observed or verified.

## Current position

- **Active phase:** Familiar World
- **Next milestone:** caregiver-triggered closing ritual
- **Last reconciled:** 2026-08-16
- **Current milestone state:** first shared relationship meaning implemented and rendered

The collection has six distinct playable worlds. Shared control, preservation, spatial stability, the first recurring resident, and the first shared relationship meaning are implemented. The next useful question is whether a caregiver can deliberately bring an experience to rest without creating an automatic stopping prompt or taking control away from the child.

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
4. **Recurring resident pilot — implemented and rendered.** A child-built Stack & Settle bridge deterministically invites Bloom's spotted bird. It has one recognizable identity, four bounded local responses, no collection state, and no effect on the construction. The bridge and bird survive portrait-to-landscape reflow; rebuilding the condition can invite it again. Child recognition and intentional reproduction remain unobserved.
5. **Shared “together” meaning — implemented and rendered.** Two open Peekaboo friends derive one visible connector and a scene-specific reunion: snuggle, move, float, or swim. Either friend repeats it; closing either home removes it. This aligns with existing Bloom links, Story relationships, and Together Tones pairs without sharing state or forcing identical animation. Child transfer of the meaning remains unobserved.

Implementation detail and evidence belong in `PRODUCT.md`, `GAME_ROADMAPS.md`, and `EVIDENCE.md`; this roadmap records only sequencing and decision state.

### Next: milestone 6 — caregiver-triggered closing ritual

Add one calm, deliberate way for a caregiver to signal that play is resting. It must not become an automatic prompt, countdown, session limit, reward summary, or child-facing demand to stop.

The smallest coherent slice must:

- require an intentional caregiver gesture or control unlikely to be triggered by ordinary play;
- settle motion and sound immediately while leaving child-authored work intact;
- offer a clear return to play and preserve the existing Home/Fresh meanings;
- avoid recording time, enforcing a duration, praising disengagement, or implying the child failed to finish;
- work consistently in one pilot game before any collection-wide rollout.

The first candidate should be an open-ended world where visible work can remain peacefully on screen. The ritual must be tested for accidental activation, spatial stability, sound-off meaning, reduced motion, and safe restoration.

### Then

7. Observe whether children transfer control and relationship meanings, recognize and reproduce a resident condition, recover saved work, avoid accidental resets, and disengage naturally.
8. Resume the strongest per-game Round 3 milestone from `GAME_ROADMAPS.md`; choose using current evidence, not document age.

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
