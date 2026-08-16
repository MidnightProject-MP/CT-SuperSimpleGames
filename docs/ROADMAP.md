# Product roadmap

This roadmap is the durable execution plan for SuperSimpleGames. It translates the product principles in `PRODUCT.md` and the exploratory directions in `IDEAS.md` into ordered, independently shippable milestones.

Detailed specialization and expansion milestones for each available experience live in `GAME_ROADMAPS.md`. This portfolio roadmap remains authoritative for shared principles, evidence boundaries, and cross-game sequencing.

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
- After that pause, finite games provide a clear in-game replay action; open-ended games require deliberate confirmation before clearing child-created work.
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

## Next phase — Familiar World

**Status: agreed product direction; implementation pending**

Before the remaining isolated Round 3 expansions, make the collection feel like six places in one familiar world. This is not a metagame, progression layer, or shared reward system. It is a small set of dependable meanings that children can recognize, predict, and carry from one experience to another.

### Shared invariants

- **Respect the child's work.** Leaving a game does not imply destruction. Bloom, Stack & Settle, and Story Scenes preserve one bounded local creation; clearing it requires a deliberate, confirmed fresh start. Finite rounds remain fresh unless observation shows that restoring them is useful.
- **Use consistent controls for consistent meanings.** Home always leaves the current place. Again replays a finite experience after its restful pause. Different changes a bounded prompt, pattern, or suggestion without erasing unrelated work. Fresh start is reserved for destructive clearing and is never a casual completion action.
- **Make discovery reproducible.** Interesting responses come from visible child-created state, not elapsed time, rarity, or random rewards. A child who repeats the relationship should be able to reproduce the response.
- **Let familiar residents recur without becoming prizes.** A bird, frog, and snail may visit more than one world when understandable conditions invite them. They remain deterministic, non-collectible, and locally responsive; they do not create a roster, currency, unlock, or completion checklist.
- **Share a small relationship vocabulary.** Home, bridge, rain, sun, repetition, together, and rest should retain compatible meanings across games while each game expresses them through its own agency.
- **Leave six different kinds of play intact.** Bloom remains living-system creation; Color Splash connected-region reasoning; Peekaboo search and evidence; Stack & Settle spatial construction; Story Scenes symbolic narrative; Together Tones temporal pattern and turn-taking.
- **Add depth in layers, not panels.** The first touch stays complete. Further meaning emerges through repeated action, nearby relationships, and revisiting—not instructions, menus, inventories, or mastery gates.
- **Allow natural stopping.** Completion and closing rituals become calm resting places. The product never automatically launches another activity or pressures the child to continue.

### Spatial stability and zoom

The child's working surface is a place, not a moving target.

- User-initiated browser and accessibility zoom remains available.
- Game-directed camera zoom, automatic fit changes, and animated reframing are used only when a mechanic materially benefits from changing scale and the change remains understandable.
- A control appearing, disappearing, or changing state must not unexpectedly move, resize, or recenter the primary play surface. Reserve its space from the first render or overlay it without changing child-authored geometry.
- Restarting or moving between render states may change content, but stable anchors and tap-target geometry should remain in place unless movement is itself the legible mechanic.
- Orientation changes may reflow a world, but the reflow must be deterministic, preserve relative meaning, and avoid collisions or lost work.
- Color Splash is the first correction target: its board bounds, cell size, center, and accepted tap geometry must remain stable before, during, and after completion, including when Back one or New board controls appear.

### Delivery order

1. Define and test the shared home, again, different, fresh-start, and bounded local-state contracts.
2. Add bounded local persistence to Bloom, Stack & Settle, and Story Scenes, with explicit confirmed clearing and safe schema fallback.
3. Correct Color Splash's board-frame stability before adding its two-anchor mechanic.
4. Pilot one recurring bird across a small number of worlds using deterministic child-state conditions.
5. Introduce shared relationship meanings only where they fit each game's existing agency.
6. Add one caregiver-triggered, non-automatic closing ritual that leaves the product at rest.
7. Observe whether children transfer meanings, recognize and predict a resident, recover saved work, avoid accidental resets, and disengage naturally.
8. Resume per-game Round 3 work only where the shared direction strengthens rather than blurs the experience.

### Evidence gates

Do not call the Familiar World successful merely because its parts are implemented. Look for whether children reuse a learned control without prompting, reproduce a resident condition, retain a game's distinct purpose, understand what will be preserved or cleared, and experience no unexpected movement of the active play surface. Record rendered, device, caregiver, and child evidence separately from deterministic mechanical verification.

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

**Status: implementation and automated verification complete; device and child observation pending**

**Objective:** Turn opening a pouch into the beginning of an interaction rather than the entire interaction.

Minimum coherent slice:

- Animate each object visibly emerging from its pouch without delaying the initial acknowledgement.
- Let emerged objects remain touchable and return when the pouch closes.
- Give two simultaneously emerged objects one simple, deterministic shared reaction.
- Replace platform-dependent emoji with a small cohesive local visual set.
- Replace checklist-like completion language with a brief whole-scene response that leaves play available.

Implementation note: the minimum coherent slice is present. Friends are independent controls backed by a local vector set, opening visibly lifts them from their pouches, touching them produces a greeting, two open friends share a deterministic reaction, and the three-friend moment leaves the scene interactive.

Follow-up experiment:

- Present one visually communicated target and keep its pouch stable for the round.
- Allow some pouches to contain playful clues or an explicitly lively empty state.
- Finding the target changes the scene but does not force an ending or restart.

Implementation note: the search experiment is present. Each session has one visually communicated target, two real friends, and one lively footprint clue. Target and clue locations are deterministic and stable, all reveals remain interactive, and finding the target changes the prompt without ending the scene. The essential target remains visible as a compact cue in short landscape layouts.

Acceptance focus:

- Empty or non-target reveals never appear broken or punitive.
- The target never moves in response to a guess.
- Children can continue interacting after discovery.
- Search remains curiosity and inference, not a scored memory assessment.

## Milestone 3 — Bloom: a relational garden

**Status: implemented and automatically verified; device and child observation pending**

**Objective:** Preserve Bloom's immediate simplicity while allowing the garden to develop understandable relationships.

Minimum coherent slice:

- Tapping empty space continues to create a flower immediately.
- Existing flowers become revisitable and respond to touch.
- Near, far, and overlapping placements produce at least one predictable relational response, such as leaning, harmonizing, or exchanging color.
- The garden's object limit no longer causes meaningful work to disappear silently.
- Ambient invitation motion settles after play begins.

Implementation note: existing flowers are now direct touch targets and grow to a bounded maximum when revisited. A new flower within a forgiving neighborhood connects to its nearest neighbor with a persistent garden link and the pair leans together. At the 24-flower bound, touches tend the nearest existing flower instead of deleting prior work. The invitation animation stops after the first interaction.

Acceptance focus:

- The first-touch experience remains at least as clear as the current Bloom.
- Relationships are discoverable and intentionally repeatable without instructions.
- Flower interaction does not require a palette, mode, or precision gesture.
- Dense gardens remain calm, bounded, and responsive.

## Milestone 4 — Stack & Settle

**Status: implemented and automatically verified; device and child observation pending**

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

Implementation note: five fixed pieces now support tap placement, broad drag positioning, floor settling, forgiving stacks, side-by-side arrangements, and a special ball-and-nest relationship. Pieces remain reusable, drag cancellation restores the prior arrangement, and the pure state model is bounded and deterministic.

## Milestone 5 — Comparative observation and portfolio review

**Status: technical portfolio review complete; real-world observation required for validation**

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

Technical review recorded after Milestone 4:

- The four games and their complete offline application shell pass 72 deterministic tests.
- The public launcher, Stack & Settle page, and Stack & Settle logic asset were verified reachable after the matching GitHub Pages deployment completed.
- Creation, connected-region transformation, reversible search, and direct manipulation now have distinct state models and observation protocols.
- Recent depth changes have not yet been observed with children or caregivers. Discoverability, touch comfort, sensory comfort, intentional repetition, shared play, and natural stopping therefore remain evidence gaps rather than passed criteria.
- Wiggle Way remains conditional and is not promoted to the launcher until observation supports broad dragging or shows that a tap-authored path would be independently satisfying.

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

**Status: available launcher prototype; automated verification complete; rendered, device, and child observation pending**

**Objective:** Evolve the strongest parts of Bloom, Peekaboo, and Stack & Settle into open-ended symbolic storytelling.

- Each background provides a deliberately limited, coherent cast rather than a universal asset catalog.
- Objects can be placed, moved, revisited, and combined.
- Simple repeatable relationships act like gentle alchemy: rain grows a flower, sun and cloud make a rainbow, or two characters begin a shared action.
- Scenes may contain cooperative or gently adversarial sides, but the child directs the story.
- There is no health, combat score, fixed winner, inventory economy, or predetermined narrative.

Advance this concept only after earlier milestones clarify whether children understand mode selection, object revisiting, dragging, and relational consequences. Story Scenes should be a synthesis of proven interactions, not Bloom with a larger toolbar.

Prototype note: one garden scene now defaults to immediate flower placement and offers four oversized object families: flowers, friends, clouds, and suns. New placements cycle through five variants, existing objects can be changed or broadly moved, and nearby pairs produce four stable relationships: watering, warming, greeting, and a rainbow. The scene is capped at 16 objects; further placement tends a nearby object of the selected kind instead of deleting work. It is available from the launcher for testing. Background selection and additional casts remain deliberately excluded until observation shows that selecting and then placing is understandable.

## Milestone 8 — Temporal and cooperative play

**Status: available launcher prototype; automated verification complete; rendered, device, and child observation pending**

Explore a restrained musical experience in which large characters or objects contribute simple sounds and combinations. Touching, holding, and taking turns may alter the shared result. Silence remains available; sound is never required for understanding.

Avoid imitation tests, escalating tempo, audio dependence, automatic performance, and stimulation used only to prolong attention.

Prototype note: Together Tones presents four oversized visual voices. A first touch produces a local visual and optional tone, repeating one voice creates an echo response, and choosing a different voice connects the last pair. Four colored beads preserve only the recent action order. Visual levels, recent history, and the active pair are strictly bounded; there is no playback, tempo, prompt sequence, score, completion, or sound-only meaning. It is available from the launcher for testing; validation and expansion remain conditional on observing clear first use, comfortable repetition, sound-off comprehension, and natural turn-taking.

## Portfolio rule

A new game earns a permanent place only when it introduces a distinct form of agency or curiosity. Content themes, visual reskins, larger grids, and additional random variants do not by themselves justify another launcher card.
