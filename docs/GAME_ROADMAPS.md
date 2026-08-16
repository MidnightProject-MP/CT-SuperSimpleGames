# Per-game development roadmaps

This document defines how each SuperSimpleGames experience should become deeper and more specialized. It is an implementation roadmap, not a claim that proposed mechanics have been validated with children.

The portfolio roadmap in `ROADMAP.md` governs shared product direction and evidence. This document governs the ordered development of each individual game.

## Portfolio specialization

Each game should provide a different kind of agency and a different route into early concepts.

| Experience | Primary specialization | Supporting concepts |
|---|---|---|
| Bloom | Living systems and visual pattern-making | color, size, growth, grouping, variation, simple quantity |
| Color Splash | Connected-region puzzles and reversible planning | color-symbol matching, boundaries, sequence, prediction, part and whole |
| Peekaboo Pockets | Search, evidence, containment, and perspective | hidden/visible, inside/outside, location, clues, thematic categories |
| Stack & Settle | Construction and spatial problem solving | above/below, beside, inside, size, support, symmetry, revision |
| Story Scenes | Symbolic storytelling and causal narratives | characters, settings, sequence, roles, emotion, cooperation, cause and effect |
| Together Tones | Temporal patterns and shared turn-taking | repetition, alternation, order, high/low, same/different, anticipation |

“Learning” means exposure through understandable play. It never means a quiz, a mastery claim, a performance score, or pressure to produce an adult-defined answer.

## Rules shared by every roadmap

1. Preserve immediate play. A new child should still receive a complete response from the first ordinary touch.
2. Add one central question per milestone. Do not combine a new input model, content system, and progression system in one release.
3. Keep every important state reversible or revisitable. The child’s work should not disappear as punishment or housekeeping.
4. Pair concepts across channels. Color should also have shape, position, motion, pattern, quantity, or a local visual identity.
5. Prefer stable relationships over surprise rewards. Replay should come from testing an understandable world.
6. Introduce numbers as visible quantities before numerals, and letters as meaningful marks inside a theme before asking for recognition.
7. Treat caregiver language, turn-taking, and storytelling as invitations rather than required instructions.
8. Keep state, motion, sound, and generated objects strictly bounded.
9. Continue to prohibit scores, streaks, timers, lives, locked content, rarity, autoplay, nagging, analytics, accounts, advertising, and external actions.
10. Availability is not validation. A roadmap milestone may be public for testing while its child, device, and caregiver evidence remains pending.
11. Every finite or round-based experience must offer an obvious in-game replay after its restful completion pause. Open-ended creations must offer a deliberate, confirmed fresh start when clearing prior work would be destructive.

## Delivery cadence

Development should proceed in rounds so every game becomes more distinctive before any one game accumulates a large content catalog.

### Round 1 — Strengthen the core worlds

**Status:** implemented and automatically verified across all six games; rendered, device, caregiver, and child observation pending.

Implement the first gameplay milestone for each game, including the technical foundation required by that milestone:

1. `BL-1` Growth stories
2. `CS-1` Puzzle families
3. `PP-1` Themed searches
4. `STK-1` Structural relationships
5. `SCN-1` Scene grammar and backgrounds
6. `TT-1` Visual motifs

### Round 2 — Add revision and intentional experimentation

**Status:** implemented and automatically verified across all six games; rendered, device, caregiver, and child observation pending.

Proceed after each Round 1 mechanic is technically verified and any obvious interaction failures are corrected:

1. `BL-2` Garden neighborhoods
2. `CS-2` Reversible planning
3. `PP-2` Legible clue chains
4. `STK-2` Open-ended idea cards
5. `SCN-2` Stateful, redirectable interactions
6. `TT-2` Touchable recent history

### Round 3 — Deepen social and conceptual play

Use observation to choose the strongest order within this round:

- garden visitors and simple ecological relationships;
- two-anchor Color Splash boards;
- child-hides/caregiver-seeks Peekaboo;
- themed construction kits;
- character roles and child-directed sides;
- cooperative tone relationships.

### Round 4 — Expand content only where the mechanic has earned it

Add theme packs, larger vocabularies, or more complex combinations only when children understand and revisit the underlying interaction. A new theme should add a useful relationship or concept, not merely replace artwork.

---

## Bloom roadmap

### Experience identity

Bloom should become a small living garden rather than a general sticker canvas. Its pleasure comes from making something grow, revisiting it, noticing variation, and discovering how nearby living things affect one another.

The child currently receives immediate creation, color and size variation, broad drag trails, tending, and one nearby relationship. Preserve the absence of a toolbar or explicit objective; Story Scenes owns selection and symbolic composition.

### Concepts Bloom can expose

- color families and gradual color change;
- small, medium, and large;
- seed, sprout, bud, bloom, and rest as a reversible visual cycle;
- near/far, cluster/space, same/different;
- repeating visual patterns;
- small quantities such as one, two, and three visitors;
- simple living-system relationships such as flowers attracting a bee.

### BL-0 — Garden resilience and scale

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** technical foundation supporting all Bloom milestones.

- Separate stable garden state from presentation animation so lifecycle changes remain deterministic and testable.
- Replace repeated full-scene DOM searches with indexed object and relationship lookup before adding more plant types.
- Make visual size and neighborhood distance use viewport-relative physical geometry in portrait and short landscape.
- Define explicit budgets for plants, links, visitors, particles, active pointers, and simultaneous audio.
- Add stress tests for dense gardens, simultaneous touches, repeated tending, resize, and restored sound preference.
- Preserve tap, keyboard, sound-off, and reduced-motion equivalence.

**Gate:** Dense gardens remain responsive and calm; no resize or pointer sequence can move a plant out of bounds, duplicate an identity, or erase prior work.

### BL-1 — Growth stories

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** core gameplay improvement; Round 1.

- Keep the first empty-space tap as an immediately satisfying flower.
- Give each flower a short, circular lifecycle revealed through revisiting: fresh bloom, taller bloom, full bloom, seed sparkle, and renewed bloom.
- Make each state visually complete so stopping at any point never resembles unfinished work.
- Pair lifecycle states with size, petal structure, leaf count, and motion—not text or sound alone.
- Let five variants remain recognizable across the lifecycle rather than replacing the current color identity.

**Experience question:** Do children intentionally revisit the same flower to see it change?

**Learning exposure:** sequence, change over time, relative size, and “again.”

**Gate:** A child who only creates new flowers still has the complete current experience; lifecycle discovery requires no mode, precision gesture, or instruction.

**Implementation note:** The first touch still creates a complete flower. Revisiting now advances deterministically through fresh, taller, full, seed-ready, and renewed states, with bounded size, leaves, petal treatment, seed marks, visual announcements, and optional tone changes. Bloom objects and links use indexed runtime collections, relationship reach follows the shorter viewport dimension, transient sparks are capped, and lifecycle and geometry invariants are tested.

### BL-2 — Garden neighborhoods

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** new relational mechanic; Round 2.

- Let close groups form one of a few legible neighborhood patterns: matching colors harmonize, alternating colors form a visible rhythm, and three nearby mature blooms form a calm shared canopy.
- Make the same arrangement always produce the same relationship.
- Keep relationships editable: tending or adding a neighbor can change the pattern without deleting plants.
- Use persistent, low-contrast structure rather than repeated celebration effects.

**Experience question:** Do children vary placement or color because they anticipate a neighborhood response?

**Learning exposure:** grouping, same/different, alternation, near/far, and part/whole.

**Gate:** Dense gardens remain visually readable; a relationship never obscures the individual flowers that caused it.

**Implementation note:** Neighborhoods are now derived deterministically from current garden state after creation, tending, and resize. Nearby matching colors receive a soft harmony line, differing colors an alternating rhythm, and mutually nearby full-stage triples a low-contrast shared canopy. All forms remain editable as flowers change, with explicit caps of 32 links and four canopies; dense and order-independent behavior is tested.

### BL-3 — Garden visitors

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** system expansion; Round 3.

- Introduce at most one calm visitor at a time, earned by stable garden conditions rather than random rarity.
- Example relationships: three mature blooms invite a bee; a spaced pair invites a butterfly; a seed-stage flower invites a small bird.
- Visitors should move locally, respond to touch, and leave without taking or damaging anything.
- Show quantities through visible visitors or markings—one bee, two wings, three spots—without counting prompts.
- Ensure sound adds warmth but never carries the visitor’s meaning.

**Experience question:** Do children connect a garden arrangement with the visitor it invites and try it again?

**Learning exposure:** simple ecological cause and effect, quantity, classification, and anticipation.

**Gate:** Visitors do not become rare rewards, collectibles, or a reason to prolong play.

**Implementation note:** Deterministic garden conditions now invite exactly one local CSS-drawn visitor: three nearby mature blooms invite a bee, a seed-stage bloom invites a three-spotted bird, and a deliberately spaced pair invites a two-winged butterfly. The visitor has an 84-pixel touch target, moves among four bounded local positions, and leaves after a short four-touch visit without changing any flower. Dismissal persists while the same condition remains, so the visitor cannot become a collectible or attention loop.

### BL-4 — Garden seasons and themes

**Kind:** gameplay expansion; Round 4.

- Add a small number of coherent garden conditions such as sunny meadow, rainy garden, and quiet night.
- Change available plant forms and relationships, not only colors and backgrounds.
- Keep the same first-touch and revisit grammar across every garden.
- Let weather be visible and bounded; never use automatic day/night progression or attention-driven events.

**Possible themes:** meadow flowers and bees; pond-edge reeds and dragonflies; night blossoms and moths.

**Gate:** Each theme must add at least one meaningful relationship and remain understandable without a theme-selection explanation.

### Bloom should not become

- an inventory, farming economy, care obligation, or collection checklist;
- Story Scenes with a plant-only palette;
- a counting quiz or color-naming test;
- an idle garden that changes while the child is away.

---

## Color Splash roadmap

### Experience identity

Color Splash should become the collection’s clearest puzzle world: a stable rule, visible consequences, reversible experimentation, and gradually richer connected-region reasoning without wrong-answer pressure.

The child currently receives a forgiving board touch, a growing corner region, designed and generated boards, repeated-color acknowledgement, and a held completion state. Preserve direct contact with the board and the absence of move limits.

### Concepts Color Splash can expose

- color and symbol identity;
- connected/not connected and boundary/bridge;
- part becoming whole;
- sequence and one-step prediction;
- same/different and grouping;
- visible quantities paired with identities;
- simple planning through reversible choices.

### CS-0 — Explainable input and board engine

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** technical foundation supporting all Color Splash milestones.

- Represent designed boards, identity sets, anchors, and completion rules through validated declarative board definitions.
- Keep touch resolution, flood transitions, preview calculations, and completion pure and deterministic.
- Add property tests for every board family, identity count, anchor count, and orientation.
- Maintain one immediate contact response before any region animation.
- Define animation interruption rules so rapid choices settle into the correct final board without queued motion.

**Gate:** Every accepted input can identify the resolved cell, selected identity, prior region, and resulting region without relying on timing.

### CS-1 — Puzzle families

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** core gameplay improvement; Round 1.

- Replace undifferentiated procedural variety with recognizable board families: bridges, islands, stripes, rings, paths, and small pockets.
- Begin with four-cell teaching boards embedded in the normal play surface, then use the existing 4×4 scale.
- Let the visual structure suggest a possibility without arrows, narration, or required instructions.
- Preserve free choice and accept completion in any final identity.
- Use stable board ordering for the earliest experiences and varied generation later.

**Experience question:** Do children notice and exploit a bridge, boundary, or connected patch?

**Learning exposure:** connectedness, grouping, boundaries, and simple multi-step cause.

**Gate:** A child can still complete every board through experimentation; no family depends on reading or color alone.

**Implementation note:** The board sequence now begins with three enlarged four-cell teaching boards, then presents stable bridge, islands, stripes, rings, path, and pockets families before deterministic mixed boards. Definitions validate dimensions, identities, family, and labels. Every accepted move produces a pure explanation of its resolved cell, identity, prior region, and resulting region; symbols continue to pair with color, and rapid animation classes are interrupted before current state is rendered.

### CS-2 — Reversible planning

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** new puzzle mechanic; Round 2.

- Add one oversized, pictorial “back one step” control after the first effective move.
- Keep only one reversible prior board initially; do not introduce a history timeline.
- Show a brief, optional region preview when a child rests on a choice, but execute immediately on an ordinary tap.
- Make undo restore the exact prior board and region without penalty, score change, or “mistake” language.

**Experience question:** Do children revisit a choice or use one-step reversal to test a different consequence?

**Learning exposure:** prediction, revision, before/after, and alternative paths.

**Gate:** The back control does not compete with the board’s primary action or become required for completion.

**Implementation note:** After each effective move, one large “Back one” control can restore the exact prior board once, with no score or mistake language. Mouse, pen-hover, and keyboard focus can preview the resulting connected region without changing state; ordinary touch and click still execute immediately. Pure planning and restoration functions copy board storage, validate matching dimensions and identities, and are covered by immutability tests.

### CS-3 — Two growing corners

**Kind:** advanced new mechanic; Round 3.

- Introduce a separate board family with two visually distinct anchors growing from opposite corners.
- A broad touch near either region selects which one acts; ambiguous touches resolve visibly and consistently.
- Regions may meet and harmonize but never attack, steal, or erase one another.
- Completion may mean the board has joined into two touching regions, not that one side wins.

**Experience question:** Can children choose between two active causes and anticipate which region will change?

**Learning exposure:** two-part systems, comparison, spatial planning, and cooperation.

**Gate:** Do not ship this family if anchor selection feels like a hidden mode or boundary touches feel arbitrary.

### CS-4 — Identity vocabularies

**Kind:** conceptual and thematic expansion; Round 4.

- Add carefully paired identity sets rather than color reskins.
- Possible sets: colors plus shapes; weather symbols; leaves with one to four lobes; stars with one to four visible points or companions.
- Introduce visible quantities as dots or repeated items before optional numerals.
- Keep exactly four identities in the first expansions so the puzzle rule stays stable.
- Never require spoken names, letter recognition, or counting to choose successfully.

**Gate:** Every identity remains distinguishable in grayscale and at small size, and changing identity vocabulary does not alter flood logic.

### CS-5 — Larger and composed boards

**Kind:** later gameplay expansion.

- Consider 5×5 boards only after 4×4 planning is comfortably understood.
- Add composed scene-like boards whose regions reveal a simple picture when joined, while preserving normal completion in any color.
- Keep complexity in topology, not smaller targets, move efficiency, or timers.

### Color Splash should not become

- a minimum-moves challenge, leaderboard, daily puzzle, or escalating level ladder;
- a precision grid game;
- a color-only assessment inaccessible to children who distinguish identities differently;
- a hidden tutorial sequence where experimentation appears wrong.

---

## Peekaboo Pockets roadmap

### Experience identity

Peekaboo should become the collection’s search-and-evidence world. Its pleasure comes from wondering, revealing, retaining stable locations, using gentle clues, and sharing the roles of hider and finder.

The child currently receives three stable containers, one visual target, two friends, one lively clue, reversible opening, independent emerged objects, and a reunion. Preserve stable locations and the emotional neutrality of every reveal.

### Concepts Peekaboo can expose

- open/closed, hidden/visible, in/out;
- stable location and spatial memory without scoring;
- clue and consequence;
- matching patterns, categories, and small quantities;
- left/middle/right through position rather than verbal testing;
- perspective and turn-taking through hiding and finding.

### PP-0 — Container and round architecture

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** technical foundation supporting all Peekaboo milestones.

- Define scenes, containers, target sets, clues, emergence behavior, and relationships through validated local data.
- Keep round generation seed-deterministic and guarantee that target, clue, and non-target states never change after a guess.
- Generalize container layout for three and later four oversized containers without shrinking touch targets below the product minimum.
- Test rapid open/close, simultaneous pointers, orientation changes, short landscape target visibility, and animation interruption.
- Keep every local illustration available offline and independent of platform emoji.

**Gate:** No generated scene can contain an ambiguous target, duplicate essential identity, silent empty state, moving answer, or unreachable control.

### PP-1 — Themed searches

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** core gameplay and content improvement; Round 1.

- Add a small number of coherent search scenes whose containers and contents belong together.
- Initial sets: animals in patterned beds; vehicles in garages; weather friends behind clouds; sea creatures in shells.
- Each scene uses two or three familiar targets, selected one per round, plus lively non-targets and a clue.
- Pair categories with visual setting and container form; do not merely replace friend artwork.
- Keep three containers and the same open/close grammar initially.

**Experience question:** Does a coherent theme invite naming, anticipation, or shared conversation without requiring it?

**Learning exposure:** categories, familiar objects, containment, and stable location.

**Gate:** A child who ignores the target still receives satisfying, complete play from every container.

**Implementation note:** Four validated, seed-deterministic local scenes now group cozy animals in beds, vehicles in garages, weather friends behind clouds, and sea creatures in shells. Each scene declares its container vocabulary, item pool, patterns, emergence, and relationship behavior; the target and empty clue location remain stable. Every item has offline vector art, each theme changes the playfield and container silhouette, and thematic subset generation and scene invariants are tested.

### PP-2 — Legible clue chains

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** new inference mechanic; Round 2.

- Give the lively clue a direct visual relationship to the target or its container: matching tracks, a visible color-pattern fragment, a feather, wheel mark, or trail direction.
- Use at most one clue step before the target in the first implementation.
- Keep the clue stable and revisitable after target discovery.
- Let touching the clue produce a brief directional or relational response without moving the target.
- Never narrate a correct answer or mark another container wrong.

**Experience question:** Do some children revisit or use the clue when choosing another container?

**Learning exposure:** evidence, matching, direction, and inference.

**Gate:** Children who do not infer the clue remain fully successful explorers; the clue must not resemble a locked instruction.

**Implementation note:** The lively empty-container clue now carries a fragment of the target container’s stable pattern plus a clear left or right mark. Touching it repeats a brief directional response and accessible description without moving the target, closing containers, or changing discovery. The descriptor is derived purely from immutable round state and remains identical before and after target discovery.

**Replay improvement:** Finding the target now reveals a large “Hide again” control. It starts a fresh search in the next theme without requiring a trip through the launcher, while leaving the found round available until the child deliberately chooses it.

### PP-3 — Child hides, caregiver seeks

**Kind:** social and perspective mechanic; Round 3.

- Add an optional, pictorial role-reversal round after ordinary search play.
- The child chooses a container for one familiar friend; all containers then close visibly without shuffling.
- The caregiver or another child explores to find it, after which roles can reverse again.
- Keep the chosen location visible long enough to understand the hiding action.
- Do not score finder accuracy, count guesses, or reward deception.

**Experience question:** Does choosing the hidden location create understandable shared play and perspective-taking?

**Learning exposure:** hiding/finding roles, stable location, anticipation, and another person’s perspective.

**Gate:** Role reversal must be optional and understandable without a reading-dependent handoff screen.

### PP-4 — Interactive reunions

**Kind:** gameplay expansion.

- Give revealed sets one or two deterministic reunion actions beyond greeting: animals cuddle or follow; vehicles park side by side; weather friends combine; sea creatures swim together.
- Let the child redirect or repeat the reunion by touching either participant.
- Keep all containers reversible after the relationship appears.
- Use quantities such as one friend, two friends, and three open homes visually, without completion pressure.

### PP-5 — Four-place search

**Kind:** later puzzle expansion.

- Consider four containers only after three-place search remains comfortable in portrait and short landscape.
- Increase evidence richness before memory burden: add a clearer clue or category relationship rather than merely another wrong location.
- Maintain target size and a complete lively response in every location.

### Peekaboo should not become

- a shell game that moves the answer;
- a scored memory test or “wrong cup” routine;
- a spoken-instruction quiz;
- a large random catalog whose contents have no thematic relationship.

---

## Stack & Settle roadmap

### Experience identity

Stack & Settle should become the collection’s construction and spatial-problem-solving world. Its pleasure comes from arranging a small reusable set, seeing pieces form stable relationships, revising a structure, and optionally pursuing a visual idea without losing free play.

The child currently receives five reusable pieces, tap-complete placement, broad dragging, floor/stack/nest settling, side-by-side responses, and recoverable arrangements. Preserve magnetic forgiveness and the absence of collapse as punishment.

### Concepts Stack & Settle can expose

- above/below, beside, inside/outside;
- big/small, wide/narrow, tall/short;
- support, bridge, roof, enclosure, and symmetry;
- whole structures made from parts;
- planning, revision, and multiple solutions;
- small visible quantities of reusable pieces.

### STK-0 — Generalized settling engine

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** technical foundation supporting all Stack milestones.

- Replace special-case pair logic with validated piece capabilities: supports, rests-on, nests-with, spans, covers, rolls-with, and decorates.
- Compute settling in physical layout units across orientations.
- Add deterministic multi-support handling for bridges and roofs.
- Preserve the prior valid arrangement through pointer cancellation, resize, and interrupted movement.
- Add randomized invariant tests for every piece set: bounds, support, recoverability, identity uniqueness, and no consumption.
- Keep tap-only placement meaningful for every future piece capability.

**Gate:** Every released piece reaches a visible valid state, and every structure can be revised without clearing the scene.

**Collision refinement:** Every release and orientation change now ends with a deterministic clearance pass. An occupied drop first tries the nearest valid support, then the nearest clear horizontal space; an already placed piece returns to its prior valid position if neither is available. Ball-and-nest overlap remains intentional, while randomized alternating portrait/landscape tests reject every other intersecting pair. This strengthens the technical foundation before adding themed kits.

### STK-1 — Structural relationships

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** core gameplay improvement; Round 1.

- Add bridge recognition when a beam spans two broad supports.
- Add shelter recognition when a roof sits over an open space or friend-sized piece.
- Add enclosure when two sides and a top create a visible inside area.
- Keep relationships forgiving and persistent rather than requiring exact alignment.
- Give each structure a brief local response, then let it rest.

**Experience question:** Do children reposition pieces to intentionally recreate a bridge, shelter, or enclosure?

**Learning exposure:** support, spanning, inside/outside, part/whole, and spatial planning.

**Gate:** Near-miss placements still settle safely and remain interesting; recognition cannot be the only satisfying outcome.

**Implementation note:** Every piece now declares bounded construction capabilities for support, resting, spanning, covering, and nesting. The physical-layout settling engine can place a beam or roof across two forgiving supports, while pure structure recognition identifies bridges, shelters, and enclosures without consuming or locking pieces. Local responses acknowledge a discovered structure per placement, and randomized portrait/landscape placement tests protect identity, bounds, and recoverability.

### STK-2 — Open-ended idea cards

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** optional puzzle mechanic; Round 2.

- Offer one large pictorial idea at the edge of the scene: bridge, tall tower, home, nest, or side-by-side pattern.
- Treat the card as an invitation, not a required objective; the full building surface remains available.
- Recognize multiple arrangements that express the idea rather than one exact silhouette.
- Let the card be changed or hidden through a large pictorial control.
- A matched idea receives one quiet acknowledgement and never locks, advances, or scores.

**Experience question:** Can a visual idea support planning without making free arrangements feel wrong?

**Learning exposure:** representation, planning, comparison, and multiple solutions.

**Gate:** Children who ignore the card must receive the same complete construction experience.

**Implementation note:** A large optional card now offers five CSS-drawn ideas—bridge, tall tower, home, nest, and side-by-side row. The child can cycle or hide it without affecting the reusable pieces. Pure relationship matching accepts broad structural solutions, gives each matched idea one quiet acknowledgement, and never advances, locks, scores, or clears the build.

### STK-3 — Themed construction kits

**Kind:** gameplay and content expansion; Round 3.

- Add small coherent piece sets whose capabilities create different spatial questions.
- **Home kit:** walls, beam, roof, round window, friend.
- **Vehicle kit:** body, two broad wheels, cab, cargo, road piece.
- **Creature kit:** body, head, feet, tail, decorative spot.
- Keep five to seven pieces, oversized targets, and the same tap/drag grammar.
- Use visible quantities and size contrasts within the kit rather than asking for a number.

**Gate:** Every kit adds at least two new meaningful arrangements; it cannot be a color reskin of blocks.

### STK-4 — Gentle moving relationships

**Kind:** advanced system expansion.

- Let completed relationships support one reversible action: a vehicle rolls along a broad path, a door opens, a friend enters a shelter, or a balanced rocker tilts gently.
- Movement must remain child-triggered, bounded, and recoverable.
- Never simulate destructive collapse, damage, or lost pieces.

### Stack & Settle should not become

- a precision physics simulator;
- a tallest-tower score or correctness puzzle;
- a cleanup task;
- a catalog of tiny pieces or a construction economy.

---

## Story Scenes roadmap

### Experience identity

Story Scenes should become the collection’s symbolic-play and narrative world. Its pleasure comes from choosing a small cast, placing characters and objects, changing what they are doing, and discovering causal relationships that remain under the child’s direction.

The child currently receives one garden, four object families, five variants, tap placement, revisiting, broad movement, and four proximity relationships. Preserve immediate default placement and the bounded, reversible scene.

### Concepts Story Scenes can expose

- setting, character, object, and event;
- before/after and simple story sequence;
- categories and thematic vocabulary;
- near/far, movement, direction, and location;
- helping, greeting, chasing, hiding, protecting, and sharing;
- weather and environmental cause and effect;
- emotion and perspective through visible character state, never forced labels.

### SCN-0 — Declarative scene grammar

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** technical foundation supporting all Story Scenes milestones.

- Define backgrounds, casts, variants, object capabilities, pair relationships, state changes, and presentation through validated local scene data.
- Separate visual art from interaction identity so multiple inclusive variants share the same predictable behavior.
- Resolve competing pair relationships deterministically and cap simultaneous scene effects.
- Use physical layout distance across orientations and preserve positions through viewport changes.
- Add invariant tests for every scene pack: local assets, unique IDs, valid cast size, reversible states, bounded objects, and complete relationship definitions.
- Do not extract a universal game engine; build only the grammar Story Scenes demonstrably needs.

**Gate:** A malformed scene pack cannot load partially or create an object with missing behavior, art, label, or offline asset.

### SCN-1 — Scene grammar and backgrounds

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** core gameplay and content improvement; Round 1.

- Add one oversized background selector with three coherent starting scenes.
- **Garden weather:** flower, friend, cloud, sun.
- **Town trip:** child, car, bus, home.
- **Castle tale:** dragon, knight, princess or prince, castle.
- Each background supplies only four large object families and starts with one safe default selected.
- Changing background starts a new empty scene only after a deliberate, clearly previewed choice; never erase a scene through an incidental tap.
- Give every scene at least three repeatable relationships unique to its theme.

**Experience question:** Do children understand that the setting changes the available story vocabulary?

**Learning exposure:** setting, categories, thematic objects, and context.

**Gate:** The background control and palette remain large in portrait and short landscape; selection does not crowd the storytelling surface.

**Implementation note:** Story Scenes now loads three validated, local scene packs: Garden weather, Town trip, and Castle tale. Each pack declares exactly four large object families, five visual variants, labels, tones, a safe default, and at least three deterministic theme relationships. A large setting control opens a preview panel; changing scenes requires selecting a different setting and then activating a separate “Start new story” confirmation before the existing scene is cleared. Relationship effects are capped, palette contents follow the setting, and physical-distance, cast, presentation, and relationship invariants are tested.

### SCN-2 — Stateful, redirectable interactions

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** new narrative mechanic; Round 2.

- Let relationships change object state rather than only play an animation.
- Examples: rain makes a flower grow; a car stops at a home; a dragon warms a castle; two characters begin walking together.
- Touching either participant can repeat, pause, reverse, or redirect the relationship.
- Use a small state vocabulary such as resting, active, together, hiding, and transformed.
- Ensure no combination consumes a character or permanently closes a story branch.

**Experience question:** Do children revisit an interaction to change what happens next?

**Learning exposure:** causality, sequence, state change, agency, and revision.

**Gate:** Every state remains understandable with sound off and reduced motion, and every object remains directly usable afterward.

**Implementation note:** Every nearby pair now owns one bounded, immutable interaction record with active, paused, and reversed phases. Theme-specific messages and persistent visual states make the story beat visible. Touching either participant cycles the shared phase, while moving a participant away removes that pairing and lets a new nearby partner begin a fresh interaction. Relationship records remain capped with the scene and never create autonomous motion.

### SCN-3 — Roles and child-directed sides

**Kind:** social storytelling expansion; Round 3.

- Give selected scenes two visible sides or roles without assigning moral value or a winner.
- Relationships may help, follow, chase, hide, guard, trade, or reconcile.
- Let the child redirect a chase into a greeting, move a protected object, or switch who follows whom.
- Avoid health, combat damage, defeat, fixed villains, or scripted rescue requirements.
- Provide inclusive character variants without tying behavior to gender or appearance.

**Experience question:** Does the child remain the storyteller when the scene contains tension or opposing motion?

**Learning exposure:** roles, perspective, cooperation, conflict transformation, and social language.

**Gate:** Gently adversarial play must remain emotionally safe, reversible, and understandable without a predetermined plot.

### SCN-4 — Session story strip

**Kind:** sequence and reflection mechanic.

- Preserve up to four meaningful scene changes as small pictorial moments during the current session.
- Let the child touch a moment to restore that scene state; do not autoplay the sequence.
- Store nothing after the session and collect no images, audio, text, or personal data.
- Use the strip to support “first, then, now” conversation without requiring narration.

**Learning exposure:** temporal sequence, recall, revision, and shared storytelling.

### SCN-5 — Additional scene packs

**Kind:** later content expansion.

Possible packs include ocean journey, farm day, construction town, space visit, and dinosaur valley. A pack earns implementation only if it introduces a new relationship vocabulary, not merely new stickers.

Letters and numerals may appear as meaningful environmental marks—a bus number, house sign, or character initial—but never as required recognition tasks.

### Story Scenes should not become

- an unbounded sticker catalog;
- a fixed branching storybook;
- a combat or rescue game with winners and losers;
- a persistent account-based creation tool;
- a generalized framework that forces the simpler games into its architecture.

---

## Together Tones roadmap

### Experience identity

Together Tones should become the collection’s temporal and cooperative-play world. Its pleasure comes from making a local response, repeating or alternating it, seeing recent order, and naturally sharing turns. It should remain complete with sound muted.

The child currently receives four stable visual voices, five bounded visual levels, echo for repetition, a link for alternation, four recent beads, and one brief tone at a time. Preserve the absence of autoplay, imitation demands, and completion.

### Concepts Together Tones can expose

- same/different, repeat/change;
- first/next/recent and short sequence;
- alternating patterns such as A-B-A-B;
- one, two, three, and four visible events;
- high/low and short/long paired with visual form;
- anticipation, shared attention, and turn-taking.

### TT-0 — Low-latency input and audio safety

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** technical foundation supporting all Together Tones milestones.

- Move ordinary touch acknowledgement as close to pointer-down as platform behavior safely permits while preventing duplicate click activation.
- Define deterministic handling for rapid, repeated, simultaneous, canceled, keyboard, and assistive activations.
- Keep a strict global gain ceiling, stop prior tones reliably, and suspend audio on lifecycle transitions.
- Give every audio envelope a corresponding visual duration; sound may enrich but never explain the state.
- Recompute pair geometry on resize without replaying effects.
- Test sound-off, unavailable audio context, context failure, rapid muting, multi-pointer input, and bounded DOM history.

**Gate:** Every activation produces immediate local visual evidence, and no input rate can accumulate tones, nodes, trail items, or animations without bound.

### TT-1 — Visual motifs

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** core gameplay improvement; Round 1.

- Give short recent patterns a stable visual grammar without labeling them correct.
- Repetition such as A-A creates nested rings.
- Alternation such as A-B-A creates a returning arc.
- Three distinct voices create a gentle triangle.
- Four distinct voices create a closed loop.
- Keep motifs visible briefly, then settle into the four-bead history.

**Experience question:** Do children intentionally repeat or vary a recent pattern to recreate a visual form?

**Learning exposure:** repetition, alternation, sequence, same/different, and simple geometry.

**Gate:** A single arbitrary touch remains complete; motifs cannot become hidden goals or variable rewards.

**Implementation note:** Touch and pen input now activate on pointer-down with bounded per-voice click suppression, while mouse, keyboard, and assistive click activation retain the ordinary path. The pure phrase engine derives four stable recent-pattern motifs: nested rings for repetition, a returning arc for A-B-A, a triangle for three distinct voices, and a loop for four distinct voices. One reused motif layer appears briefly and then leaves the existing four-bead history; reduced motion keeps the form visible without animation. Resize recomputes link geometry without replaying its entrance effect, and audio and trail state remain strictly bounded.

### TT-2 — Touchable recent history

**Status:** implemented and automatically verified; rendered, device, and child observation pending.

**Kind:** revision mechanic; Round 2.

- Make each of the four recent beads a large enough touch target without shrinking the primary voices.
- Touching a bead reactivates that voice once and moves it to the newest trail position.
- Never autoplay the trail or require reproduction.
- Pair bead order with position and size so the most recent action is visually clear without text.

**Experience question:** Do children use visible history to revisit or change a short sequence?

**Learning exposure:** recent order, before/after, and revision.

**Gate:** History remains secondary to the four main voices and usable with sound muted.

**Implementation note:** The four recent marks are now 48-pixel buttons with colored inner beads that grow slightly from oldest to newest. Touching any bead deterministically reactivates its voice once and moves that action to the newest trail position. It uses the same bounded voice, motif, audio, and visual response as a primary pad and never plays the rest of the trail.

### TT-3 — Tone qualities and visible comparison

**Kind:** conceptual expansion; Round 3.

- Give the four voices safely distinct envelopes or tone colors while retaining a shared volume ceiling.
- Pair high and low tones with visible vertical motion; pair short and longer tones with visible duration.
- Keep every choice pleasant in any order and stop prior audio before a new tone unless later device observation supports strictly capped two-voice harmony.
- Add visible quantities through one to four orbiting marks, not counting instructions.

**Experience question:** Do children anticipate a voice’s visual and optional sound quality?

**Learning exposure:** high/low, short/long, one/many, comparison, and anticipation.

### TT-4 — Cooperative relationships

**Kind:** social mechanic; Round 3 or later.

- Let alternating actions from opposite sides of the screen grow one shared bridge or shape.
- Support simultaneous touches only if multi-pointer testing shows calm, legible results and audio remains strictly bounded.
- Avoid identifying players, enforcing turns, tracking participation, or declaring balanced cooperation.
- Let one child play alone with the exact same interaction grammar.

**Experience question:** Does the layout invite natural turn-taking without formal multiplayer rules?

**Gate:** Cooperative play cannot make solo play incomplete or turn another person’s touch into interference.

### TT-5 — Voice themes

**Kind:** later content expansion.

- Consider coherent visual/audio sets such as garden voices, weather voices, friendly instruments, or animal movement rhythms.
- A theme must introduce a useful temporal or comparative relationship, not merely new colors or sounds.
- Spoken letters, numbers, or names remain out of scope until consistent local recordings and sound-off equivalents exist.

### Together Tones should not become

- a repeat-after-me test;
- a rhythm accuracy game;
- an automatic song player or recording tool;
- an escalating sensory spectacle;
- a formal multiplayer system that assigns turns or winners.

---

## Definition of done for any per-game milestone

A milestone is implemented only when:

- its central hypothesis is stated in the relevant roadmap and playtest document;
- state transitions, bounds, invalid input, rapid input, and orientation-sensitive geometry have deterministic tests;
- ordinary taps, repeated taps, imprecise input, keyboard input, sound-off play, and reduced-motion behavior remain complete;
- all runtime assets are local and included in the versioned offline shell;
- the launcher and every playable page retain the no-external-action boundary;
- current product documentation describes what exists without claiming unobserved learning outcomes;
- local syntax, full tests, static asset audit, HTTP checks, CI, deployment, and public endpoints pass;
- rendered browser, device, caregiver, and child evidence are recorded separately and never inferred from automation.

## Roadmap maintenance

- Mark milestones as planned, in progress, implemented, observed, revised, or retired.
- Record implementation facts in this document; keep session protocols in the dedicated playtest files.
- When observation contradicts a roadmap assumption, revise the next milestone rather than defending the plan.
- If a mechanic only works with instruction, precision, pressure, or reward escalation, simplify it or retire it.
- When repeated implementation mechanics become stable across multiple games, consider a small shared primitive. Do not create a generalized engine in anticipation of reuse.
