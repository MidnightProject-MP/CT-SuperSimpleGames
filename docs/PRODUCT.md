# Product direction

This document turns the intent in `INCEPTION.md` into explicit, testable hypotheses. It should change when observation provides better evidence.

## Audience hypothesis

SuperSimpleGames is initially designed for children roughly 18–36 months old playing with a nearby caregiver. That range is a hypothesis, not a release claim; toddlers' motor, language, sensory, and attention needs vary substantially.

## Core safety invariant

Unrestricted tapping inside SuperSimpleGames must never expose an action with adult consequences: no purchase, message, call, account change, permission grant, settings change, destructive action, or navigation into another service. This is the central meaning of “safe” for the product.

That invariant has a device boundary. A web app cannot prevent operating-system gestures or secure the rest of a phone. When a caregiver hands over a device that contains sensitive apps or accounts, use the operating system's single-app control—[Guided Access on iPhone or iPad](https://support.apple.com/en-us/111795) or [screen pinning on Android](https://support.google.com/android/answer/9455138)—or use a dedicated non-sensitive device. Never market the game itself as device lockdown.

## Experience principles

1. **Play starts immediately.** No account, onboarding flow, start button, or reading is required.
2. **Exploration succeeds.** Ordinary taps and imprecise drags create immediate positive feedback. There are no penalties, dead ends, or precision requirements.
3. **Stimulation stays bounded.** Motion is local and brief, only one generated tone plays at a time, and visual objects have a hard limit.
4. **Meaning is multimodal.** Color is paired with position, size, petal count, animation, and optional sound rather than carrying instructions alone.
5. **Every in-product path stays inside play.** There are no external links, ads, purchases, permissions, or attractive navigation controls.
6. **Privacy is the default.** There are no accounts, analytics, identifiers, third-party SDKs, or data transmission.
7. **Accessibility is part of resilience.** The app supports keyboard activation and assistive labels, leaves browser zoom available, exposes a sound toggle, and respects reduced-motion preferences.
8. **Engagement is not the objective.** Do not add streaks, nagging, notifications, variable rewards, or autoplay. Caregiver-observed delight and repeat interest matter more than session length.

## Bloom: first product slice

Every tap on empty space grows a large flower at or near the contact point. Flowers cycle through named colors and vary in size and petal count. Touching an existing flower advances a circular visual growth story—fresh, taller, full, seed-ready, and renewed—making earlier work revisitable without leaving any stage unfinished. Nearby matching colors form a soft harmony, differing colors form an alternating rhythm, and three mutually nearby full blooms share a calm canopy. These relationships update without deleting flowers. A short synthesized tone reinforces each result, and a visible sound control disables it. Dragging produces a deliberately rate-limited trail. The garden remains bounded at 24 flowers, but reaching the bound converts new touches into tending the nearest flower instead of silently erasing prior work.

Bloom supports exposure to cause and effect, colors, spatial position, relative size, and variation. It does **not** claim to teach or assess mastery of those concepts.

## Color Splash: second product slice

Color Splash begins with enlarged four-cell boards using two to four color-and-symbol identities, then moves to 4×4 boards using four. Tapping anywhere inside the visible board resolves to a nearby square, changes the connected region anchored at the top-left to that square's identity, and absorbs adjacent matches. A local response and traveling color make the resolved choice visible. Repeating the current identity traces the connected region rather than appearing ignored. There is no move limit, wrong choice, score, or automatic restart. A completed board holds its state until the child activates an explicit large new-board control. Stable bridge, islands, stripes, rings, path, and pockets families introduce legible spatial structures before later rounds use procedural variation.

Color Splash supports exposure to color and symbol matching, connected regions, cause and effect, and simple multi-step planning. It does **not** assess reasoning or claim that completion demonstrates mastery.

## Peekaboo Pockets: third product slice

Peekaboo Pockets presents one large visual target and three oversized containers whose contents remain stable for the round. Four coherent scenes pair cozy animals with beds, vehicles with garages, weather friends with clouds, and sea creatures with shells. Two containers hold familiar friends and one holds a playful clue. Tapping opens or closes a container. A friend visibly emerges as its own large control, can be greeted independently, and exchanges one deterministic greeting with the other emerged friend. The clue is also touchable and lively, so a non-target choice never resembles failure. Finding the target changes the prompt but leaves every interaction available and reveals a deliberate “Hide again” control for an in-game fresh search; nothing shuffles during an active round.

Peekaboo Pockets supports exposure to open/closed, visible/hidden, containment, stable location, and revisiting. It does **not** assess memory or claim to teach object permanence. Its larger purpose is to test whether a reversible state change invites a different kind of curiosity and caregiver co-play from the first two games.

## Stack & Settle: fourth product slice

Stack & Settle presents five oversized, reusable pieces in one bounded construction scene. A tap places or rearranges a piece without requiring sustained dragging. A broad drag gives richer positioning, after which capability-defined pieces settle safely on the floor, a nearby support, two broad supports, or into the ball-and-nest relationship. Floor neighbors, stacks, nesting, bridges, shelters, and enclosures produce different brief responses. Pieces never collapse as punishment, remain movable, and cannot be consumed or duplicated. An optional pictorial idea card suggests a bridge, tower, home, nest, or row; it can be changed or hidden and never makes other arrangements wrong. Matching an idea produces one quiet acknowledgement without scoring, advancing, locking pieces, or clearing the construction.

Stack & Settle supports exposure to above/below, beside, inside, relative size, arrangement, revision, and turn-taking. It does **not** assess coordination, construction, balance, or spatial reasoning. Its larger purpose is to test direct manipulation and child-authored revision, forms of agency not present in the first three games.

## Story Scenes: available storytelling world

Story Scenes explores whether creation, revisiting, direct manipulation, and stable relationships can become a tiny child-authored narrative. Garden weather, Town trip, and Castle tale each provide four oversized object families, five predictable visual variants, a safe initial selection, and their own repeatable relationship vocabulary. Nearby pairs begin a persistent story beat; touching either participant cycles that shared interaction through active, paused, and reversed states, while moving one toward a new partner redirects the story. Existing objects remain touchable and broadly movable. A large setting control previews the three choices, and a separate confirmation is required before changing the background clears the current scene.

The storytelling world is available from the launcher for testing. Its availability does not establish that young children understand selecting a family and then placing it, distinguish changing an object from moving it, understand the setting transition, or intentionally discover and repeat relationships. Those questions remain for rendered, device, caregiver, and child observation.

## Together Tones: available temporal-play world

Together Tones explores temporal order and informal turn-taking through four oversized visual voices. Every activation creates a complete visible response whether sound is enabled or not. Repeating the same voice creates an echo response; moving to a different voice connects the last pair. A four-bead trail shows recent order without asking the child to copy it. Recent repetition, alternation, three-voice, and four-voice patterns briefly form stable rings, an arc, a triangle, or a loop. Only one brief generated tone plays at a time, and muting never removes the visual state.

The temporal-play world is available from the launcher for testing. It does not claim to teach rhythm, musical concepts, memory, or cooperation. It specifically excludes automatic playback, imitation prompts, tempo changes, accuracy, scores, performance recording, and completion. Its question is whether stable visual voices, geometric motifs, and a tiny shared history invite comfortable variation or natural alternating turns.

## Acceptance evidence

Mechanical checks:

- portrait and landscape phone layouts fit without scrolling or clipping;
- the first interaction is available without a network call or permission;
- every page enforces a local-only browser policy that blocks external scripts, connections, forms, frames, and embedded objects;
- 30 rapid taps do not freeze, navigate, stack audio, or grow the DOM without bound;
- generated flower positions remain within the visible viewport;
- existing flowers can be revisited and grow only to a bounded maximum size;
- Bloom neighborhood links and canopies derive deterministically from current state, remain capped, and never consume a flower;
- reaching the flower count bound revisits an existing flower and never silently removes the child's work;
- sound-off play retains complete visible feedback;
- the application shell is available offline after a successful first load;
- reduced-motion mode removes ambient and sparkle motion and shortens growth motion.
- every Color Splash board contains its declared identity set, remains distinguishable by symbol as well as color, and is solvable without a move limit;
- flood moves never shrink the connected corner region or mutate the prior board;
- decorative board gaps resolve deterministically to a nearby square;
- repeated/current-color input visibly acknowledges the connected region;
- Color Splash completion waits for the explicit new-board control before starting another board.
- each Peekaboo search contains one stable target, two unique familiar friends, one stable clue pocket, and three distinct non-color patterns;
- pocket discovery is monotonic, opening and closing never mutates prior state, and discovering all pockets never blocks further play;
- every friend has a locally bundled vector illustration and remains independently touchable while emerged;
- the target and clue indices never change in response to a choice, and target discovery is monotonic;
- greeting partners are selected deterministically only from currently open non-clue pockets;
- Stack & Settle always contains exactly five distinct reusable pieces with immutable state transitions;
- tap-only input places and rearranges pieces without requiring a drag;
- every released piece settles within horizontal bounds and into a supported floor, stack, or nest state;
- ball-and-nest, stacked, and side-by-side relationships are deterministic and do not consume pieces;
- interrupted drags preserve the prior arrangement and never consume the next tap;
- Story Scenes defaults to flower placement, cycles exactly five variants per object family, and keeps every object revisitable;
- Story Scenes relationships depend on stable nearby pairs, retain only one bounded reversible interaction per pair, and never consume or replace their objects;
- Story Scenes remains bounded at 16 objects and revisits nearby work instead of deleting it at the limit;
- Together Tones retains at most four recent actions, five visual levels per voice, and one active pair;
- repeating and alternating voices have deterministic visual consequences without requiring sound;
- every Together Tones action stops the prior generated tone before starting another, so audio cannot accumulate;

Observation checks before public release:

- most children in the intended audience discover the primary action without verbal instruction;
- missed, repeated, simultaneous, and palm touches never look like failure;
- motion and sound remain comfortable for the child and nearby caregiver;
- children can disengage without the experience resisting or nagging;
- caregivers understand the experience's value without inflated educational claims;
- the game remains interesting on a later day, not only during first exposure.

## Explicit non-goals for the first slice

- A content platform, progression system, scoring, rewards economy, or generalized game framework.
- Accounts, cloud sync, telemetry, personalization, advertising, or monetization.
- Device-lockdown claims. A web app cannot suppress operating-system gestures, notifications, or the Home action.
- Spoken color names until consistent, warm, locally bundled recordings are available.

## Evidence informing the constraints

- [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Android accessibility guidance](https://developer.android.com/guide/topics/ui/accessibility/views/apps-views)
- [W3C guidance on pointer cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation)
- [W3C guidance on animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions)
- [FTC COPPA guidance](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)
- [American Academy of Pediatrics policy on digital ecosystems](https://publications.aap.org/pediatrics/article/157/2/e2025075320/206129/Digital-Ecosystems-Children-and-Adolescents-Policy)

## Next decision

The portfolio sequence lives in `ROADMAP.md`, and the ordered expansion plan for every experience lives in `GAME_ROADMAPS.md`. All six experiences are available from the launcher for testing. Implement one bounded roadmap milestone at a time and make it available for observation; availability is not validation. Do not compound additional content when the underlying interaction remains unclear, and do not extract a generalized framework merely because the pages share controls.
