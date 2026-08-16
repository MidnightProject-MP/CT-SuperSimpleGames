# Product roadmap

This roadmap is the durable execution plan for SuperSimpleGames. It translates the product principles in `PRODUCT.md` and the exploratory directions in `IDEAS.md` into ordered, independently shippable milestones.

The order is intentional. Improve the clarity and depth of the existing collection before adding experiences, then add one genuinely new form of agency at a time. Findings may change a later milestone, but adding content alone is not a reason to change the order.

## Governing direction

SuperSimpleGames should grow from a collection of simple reactions into a small set of simple worlds.

- The first action is effortless and immediately acknowledged.
- Repeated actions reveal understandable relationships.
- Imprecise but plausible input is treated as intent, not failure.
- Safe choices can have different consequences without introducing wrong answers.
- Children can revisit and alter earlier actions; their work is not silently erased.
- Replay comes from expressing agency differently in a stable world, not from pursuing a more valuable reward.
- Games support shared attention and turn-taking without quizzes or required adult instruction.
- Completion creates a restful pause rather than pressure to begin another round.
- Scores, streaks, timers, unlocks, rare rewards, autoplay, nagging, analytics, accounts, and external consequences remain out of scope.

## Execution protocol

Work through the first incomplete milestone unless repository evidence shows that a prerequisite is missing.

For each milestone:

1. Preserve the existing safety, privacy, offline, sound, reduced-motion, and accessibility boundaries.
2. Implement the smallest coherent interaction that tests the milestone's central hypothesis.
3. Add deterministic tests for state transitions, input handling, bounds, and invariants before expanding content.
4. Verify portrait and short-landscape layouts, touch behavior, keyboard behavior, sound-off behavior, and reduced-motion behavior.
5. Update the relevant product and playtest documentation with what actually exists.
6. Keep speculative extensions in `IDEAS.md`; do not present an unobserved hypothesis as validated.
7. Complete and verify one milestone before beginning the next, except when an external child-observation dependency is unavailable. In that case, record the evidence gap and continue with a bounded, reversible prototype rather than blocking all useful work.

Stop for user input only when progress requires credentials, external authority, unavailable real-world evidence, a destructive or irreversible decision, or a product choice whose alternatives would materially change the project's intent.

## Milestone 0 — Foundation collection

**Status: complete**

- Bloom establishes immediate open-ended creation.
- Color Splash establishes connected-region transformation.
- Peekaboo Pockets establishes reversible hide and reveal.
- The launcher, local-only browser boundary, offline shell, shared sound preference, reduced-motion handling, automated tests, and deployment verification are in place.

The collection demonstrates polish and safety. Its main limitation is that most actions still produce isolated responses instead of relationships with existing state.

## Milestone 1 — Color Splash: forgiving intent

**Status: implemented; automated verification complete, device observation pending**

**Objective:** Make Color Splash about colors, symbols, and connected shapes rather than tapping precision.

Minimum coherent slice:

- Treat the whole board as a continuous input surface; resolve contacts in decorative gaps to a nearby cell.
- Acknowledge every plausible contact immediately at its location.
- Make the causal path from the selected identity to the growing corner visible.
- Give a repeated/current-color selection an unmistakable connected-region response even when state does not advance.
- Hold the completed board until a deliberate restart action rather than interpreting any immediate tap as a reset.
- Add a small set of deliberately structured board seeds alongside procedural boards so bridges, islands, and boundaries can be recognized.

Acceptance focus:

- No touch inside the visible board appears ignored.
- Forgiving resolution does not make a boundary touch feel arbitrary.
- Visual feedback remains complete with sound off and reduced motion enabled.
- Flood-fill invariants and solvability remain deterministic and tested.

## Milestone 2 — Peekaboo: emergence, search, and reunion

**Status: planned**

**Objective:** Turn opening a pouch into the beginning of an interaction rather than the entire interaction.

Minimum coherent slice:

- Animate each object visibly emerging from its pouch without delaying the initial acknowledgement.
- Let emerged objects remain touchable and return when the pouch closes.
- Give two simultaneously emerged objects one simple, deterministic shared reaction.
- Replace platform-dependent emoji with a small cohesive local visual set.
- Replace checklist-like completion language with a brief whole-scene response that leaves play available.

Follow-up experiment:

- Present one visually communicated target and keep its pouch stable for the round.
- Allow some pouches to contain playful clues or an explicitly lively empty state.
- Finding the target changes the scene but does not force an ending or restart.

Acceptance focus:

- Empty or non-target reveals never appear broken or punitive.
- The target never moves in response to a guess.
- Children can continue interacting after discovery.
- Search remains curiosity and inference, not a scored memory assessment.

## Milestone 3 — Bloom: a relational garden

**Status: planned**

**Objective:** Preserve Bloom's immediate simplicity while allowing the garden to develop understandable relationships.

Minimum coherent slice:

- Tapping empty space continues to create a flower immediately.
- Existing flowers become revisitable and respond to touch.
- Near, far, and overlapping placements produce at least one predictable relational response, such as leaning, harmonizing, or exchanging color.
- The garden's object limit no longer causes meaningful work to disappear silently.
- Ambient invitation motion settles after play begins.

Acceptance focus:

- The first-touch experience remains at least as clear as the current Bloom.
- Relationships are discoverable and intentionally repeatable without instructions.
- Flower interaction does not require a palette, mode, or precision gesture.
- Dense gardens remain calm, bounded, and responsive.

## Milestone 4 — Stack & Settle

**Status: planned**

**Objective:** Add direct manipulation, arrangement, revision, containment, and simple spatial planning to the collection.

Minimum coherent slice:

- Provide three to five oversized reusable pieces.
- Tapping places a piece safely; dragging offers richer positioning.
- Broad magnetic settling accepts imprecise placements.
- Side-by-side, stacked, nested, and separated arrangements produce different gentle reactions.
- Every piece remains movable; nothing collapses as punishment.
- There is no correct arrangement, score, required completion, or cleanup demand.

Acceptance focus:

- Tap-only play remains complete for children who cannot sustain a drag.
- Repositioning is more rewarding than merely spawning additional pieces.
- The state stays bounded and every arrangement is recoverable.
- Two people can naturally alternate actions without a formal multiplayer mode.

## Milestone 5 — Comparative observation and portfolio review

**Status: planned; real-world observation required for validation**

Compare creation, region transformation, hide/search, and direct manipulation using the repository's observation protocols. Do not rank children or optimize session length.

Look for:

- spontaneous discovery of the first action;
- repeated intentional variation rather than mechanical repetition;
- revisiting or changing an earlier action;
- anticipation of a consequence;
- recovery from imprecise input;
- caregiver turn-taking or shared storytelling;
- sensory comfort and natural stopping;
- voluntary interest on a later occasion.

If real-world observation is unavailable, preserve the evidence gap explicitly. Technical and accessibility verification may continue, and later ideas may be built as bounded prototypes, but they must not be described as child-validated.

## Milestone 6 — Wiggle Way

**Status: conditional prototype**

**Objective:** Explore child-authored trajectory, sequence, and anticipation.

- Any drawn path is valid and a friendly character follows it.
- A tap creates a short path so sustained dragging is optional.
- Curves, loops, intersections, and length produce understandable movement differences.
- Objects along the route may respond as the character passes.
- There is no prescribed route, maze failure, or tracing accuracy requirement.

Advance this concept when prior play shows that broad dragging is comfortable or the tap fallback proves independently satisfying.

## Milestone 7 — Story Scenes

**Status: conditional product direction**

**Objective:** Evolve the strongest parts of Bloom, Peekaboo, and Stack & Settle into open-ended symbolic storytelling.

- Each background provides a deliberately limited, coherent cast rather than a universal asset catalog.
- Objects can be placed, moved, revisited, and combined.
- Simple repeatable relationships act like gentle alchemy: rain grows a flower, sun and cloud make a rainbow, or two characters begin a shared action.
- Scenes may contain cooperative or gently adversarial sides, but the child directs the story.
- There is no health, combat score, fixed winner, inventory economy, or predetermined narrative.

Advance this concept only after earlier milestones clarify whether children understand mode selection, object revisiting, dragging, and relational consequences. Story Scenes should be a synthesis of proven interactions, not Bloom with a larger toolbar.

## Milestone 8 — Temporal and cooperative play

**Status: exploratory**

Explore a restrained musical experience in which large characters or objects contribute simple sounds and combinations. Touching, holding, and taking turns may alter the shared result. Silence remains available; sound is never required for understanding.

Avoid imitation tests, escalating tempo, audio dependence, automatic performance, and stimulation used only to prolong attention.

## Portfolio rule

A new game earns a permanent place only when it introduces a distinct form of agency or curiosity. Content themes, visual reskins, larger grids, and additional random variants do not by themselves justify another launcher card.
