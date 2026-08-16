# Product ideas

These are promising directions, not commitments or architecture requirements. Validate current games before promoting an idea into the product plan.

## Scene maker: an evolution of Bloom

Bloom's tap-anywhere creation could expand into open-ended scene making inspired by children's sticker play.

- A small edge palette offers broad themes rather than individual assets: flowers, children, cars, planes, and similar recognizable categories.
- Tapping the scene places the selected theme. Repeated placements cycle through roughly five visually distinct variants, like Bloom's current flower variation.
- A simple background selector changes the setting so children can construct different scenes.
- There is no correct composition, score, inventory, precision placement, or failure state; free creation remains the point.

The deeper opportunity is storytelling rather than a larger sticker library. Each scene could offer a deliberately small cast of compatible object types instead of every available category. A castle scene, for example, might contain a dragon, castle, princess, and knight. A different setting would offer another small vocabulary for making a story.

Objects could have simple, discoverable relationships inspired by combination or alchemy games. Placing or revisiting two related objects might create a shared animation, sound, transformation, or new situation. These consequences should be understandable and repeatable rather than rare or arbitrarily rewarded. The child should be able to wonder "what happens if these meet?" and test the idea without a wrong answer.

Some scenes could also explore two visible sides whose relationships range from cooperative to gently adversarial. This need not introduce winning, health, combat, or scoring: sides could help, chase, protect, hide from, negotiate with, or transform one another. The important design question is whether the child remains the storyteller, rather than being pushed through a predetermined conflict.

Questions to validate before implementation:

- Whether toddlers understand selecting a theme and then placing it, or whether this adds too much mode state.
- Whether the palette and background control can remain large without shrinking the creative canvas.
- Which themes feel inclusive, recognizable, and flexible without creating an unbounded asset library.
- Whether cycling variants should follow placement order, repeat taps on an existing sticker, or both.
- Whether moving, removing, or clearing stickers is needed, and how to keep those actions forgiving.
- Whether object relationships are legible enough for a child to discover and intentionally repeat without instructions.
- Whether a limited cast encourages storytelling or feels restrictive.
- How cooperative and adversarial relationships can remain emotionally safe, open-ended, and under the child's control.
- Whether the child can revisit or redirect an interaction instead of merely triggering a canned animation.

## Peekaboo search and emergence

Peekaboo Pockets could grow from opening static containers into a small game of anticipation, inference, and reunion.

- Revealed objects could visibly emerge from their pouches, linger in the shared scene, respond to another object, and return when the pouch closes.
- A round could sometimes invite the child to wonder which pouch contains one familiar target, such as the cat or sun.
- Some pouches could be empty. An empty reveal must still be lively and emotionally neutral—a flutter, funny lining, footprint, sound, or clue—so an ordinary guess never feels like failure.
- The target and its location should remain stable throughout the round. Moving it after a guess would undermine the child's ability to form and test an expectation.
- Once found, the object could remain available for a short interaction rather than reducing discovery to a completion message.
- Open pouches, empty clues, and emerged objects could affect one another, giving the child reasons to revisit the scene after the initial reveal.

Questions to validate before implementation:

- Whether empty pouches increase playful anticipation or instead create frustration for younger children accustomed to every pouch revealing an object.
- Whether a target is communicated through a simple visual example rather than spoken or written instruction.
- Whether finding one target should end anything at all, or simply change the scene and allow continued exploration.
- How much emergence animation clarifies containment without delaying the immediate response to touch.
- Whether children intentionally use prior reveals or clues when choosing another pouch, without turning the experience into an assessment of memory.

## Color Splash: forgiving intent

Color Splash should challenge noticing shapes, colors, and connected regions—not precise targeting. A child who makes a plausible touch should never be left wondering whether the device noticed them.

The current grid has two different ways to produce an apparently ineffective touch: landing in the visual spacing around a cell produces no action, while choosing the growing corner's current color produces only a small pulse and no board transformation. Those cases may be technically different, but they can feel identical to a young child.

Directions worth prototyping:

- Treat the entire board as one continuous touch surface. Resolve touches in borders and gaps to the nearest cell, so decorative spacing never becomes a dead zone.
- Give every accepted touch an immediate response at the contact point before the broader region changes. If the resolved cell differs from the literal contact point, make that connection visible rather than snapping invisibly.
- When the child's contact overlaps a boundary, consider the size of the touch and nearby cells instead of assuming a pinpoint coordinate. Prefer a clearly actionable nearby color only when the resulting visual response remains understandable.
- Make a repeated/current-color choice visibly trace or animate the whole connected region. It need not advance the board, but it should communicate "this touch worked; these already belong together."
- Test an alternative in which each color has one oversized selector while the board remains the visual puzzle. This separates the motor target from the spatial reasoning challenge, although it may weaken the satisfying act of touching the shape itself.
- Explore region-sized targets rather than cell-sized targets: touching anywhere within a connected patch selects that patch's color, making larger visual shapes naturally easier to activate.

Questions to validate before implementation:

- Whether missed-looking taps come primarily from grid gaps, unintended neighboring cells, repeated colors, delayed/remote feedback, or a combination.
- Whether forgiving resolution feels helpful or unpredictable when a touch is near two colors.
- Whether the child understands that color—not the exact square—is the meaningful choice.
- Whether direct board touch or a small set of oversized color controls produces better agency and clearer cause and effect.
- Whether precision should be absent from this game entirely and explored later in a separate experience designed around gradual motor practice.
