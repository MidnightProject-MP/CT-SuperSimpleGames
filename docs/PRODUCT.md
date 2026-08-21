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
9. **Spatial stability is part of legibility.** The child's active surface does not unexpectedly move, resize, or recenter when controls appear or state changes. Browser and accessibility zoom remain available; game-controlled zoom or reframing is reserved for mechanics that genuinely benefit from changing scale.

## Bloom: first product slice

Every tap on empty space grows a large flower at or near the contact point. Flowers cycle through named colors and vary in size and petal count. Touching an existing flower advances a circular visual growth story—fresh, taller, full, seed-ready, and renewed—making earlier work revisitable without leaving any stage unfinished. Nearby matching colors form a soft harmony and differing colors form an alternating rhythm. Three mutually nearby, matching-color objects of one tier mechanically merge: flowers become one three-flower bouquet, and three matching bouquets can become one flowering tree. The result carries the represented flower count, the transformation is deterministic, and the two-tier cap prevents an escalating merge ladder. Product-owner hands-on use has reproduced the first tier but not the flowering-tree tier, so second-tier ordinary-play reachability is an active product defect rather than an established experience. Mixed-color neighborhoods remain available for ecological relationships and visitors. A short synthesized tone reinforces each result, and a visible sound control disables it. Dragging produces a deliberately rate-limited trail. The garden remains bounded at 24 live objects, but reaching the bound converts new touches into tending the nearest object instead of silently erasing prior work.

Bloom supports exposure to cause and effect, colors, spatial position, relative size, variation, and simple ecological relationships. Stable arrangements can invite exactly one calm visitor: a bee, a two-winged butterfly, or a three-spotted bird. Each moves locally when touched and leaves after a short visit without taking or changing a flower. Visitors are deterministic consequences, not rare rewards or collectibles. Bloom does **not** claim to teach or assess mastery of those concepts.

## Color Splash: second product slice

Color Splash begins with enlarged four-cell boards using two to four color-and-symbol identities, then moves to 4×4 boards using four. Tapping anywhere inside the visible board resolves to a nearby square, changes the connected region anchored at the top-left to that square's identity, and absorbs adjacent matches. A local response and traveling color make the resolved choice visible. Repeating the current identity traces the connected region rather than appearing ignored. There is no move limit, wrong choice, score, or automatic restart. A completed board holds its state until the child activates an explicit large new-board control. Stable bridge, islands, stripes, rings, path, and pockets families introduce legible spatial structures before later rounds use procedural variation.

Color Splash supports exposure to color and symbol matching, connected regions, cause and effect, and simple multi-step planning. It does **not** assess reasoning or claim that completion demonstrates mastery.

## Peekaboo Pockets: third product slice

Peekaboo Pockets presents one large visual target and three oversized containers whose contents remain stable for the round. Four coherent scenes pair cozy animals with beds, vehicles with garages, weather friends with clouds, and sea creatures with shells. Two containers hold familiar friends and one holds a playful clue. Tapping opens or closes a container. A friend visibly emerges as its own large control and can be greeted independently. When both friends are open, one derived connector makes “together” persistent and each theme expresses it locally: animals snuggle, vehicles move, sky friends float, and sea friends swim. Touching either friend repeats the bounded shared motion; closing either home removes the relationship without moving or consuming anyone. The clue is also touchable and lively, so a non-target choice never resembles failure. Finding the target changes the prompt but leaves every interaction available and reveals a deliberate “Hide again” control for an in-game fresh search; nothing shuffles during an active round.

Peekaboo Pockets supports exposure to open/closed, visible/hidden, containment, stable location, and revisiting. It does **not** assess memory or claim to teach object permanence. Its larger purpose is to test whether a reversible state change invites a different kind of curiosity and caregiver co-play from the first two games.

## Stack & Settle: fourth product slice

Stack & Settle presents five oversized, reusable pieces in one bounded construction scene. A tap places or rearranges a piece without requiring sustained dragging. A broad drag gives richer positioning, after which capability-defined pieces settle safely on the floor, a nearby support, two broad supports, or into the ball-and-nest relationship. The bridge beam is visibly at least half again as wide as every other piece, and a broad release near two compatible supports resolves to their midpoint rather than requiring exact placement. Occupied drops stack onto a valid support or slide to the nearest clear space instead of visually merging. Recognized bridges survive orientation changes as structures rather than merely retaining disconnected pieces. Floor neighbors, stacks, nesting, bridges, shelters, and enclosures produce different brief responses. A bridge deterministically invites the same spotted bird seen in Bloom; it perches because of the visible structure, hops among four bounded local positions, and leaves after four touches without moving any piece. Dismantling and rebuilding the bridge can invite it again. Pieces never collapse as punishment, remain movable, and cannot be consumed or duplicated. An optional pictorial idea card suggests a bridge, tower, home, nest, or row; it can be changed or hidden and never makes other arrangements wrong. Matching an idea produces one quiet acknowledgement without scoring, advancing, locking pieces, or clearing the construction.

Stack & Settle supports exposure to above/below, beside, inside, relative size, arrangement, revision, and turn-taking. It does **not** assess coordination, construction, balance, or spatial reasoning. Its larger purpose is to test direct manipulation and child-authored revision, forms of agency not present in the first three games.

## Story Scenes: available storytelling world

Story Scenes explores whether creation, revisiting, direct manipulation, and stable relationships can become a tiny child-authored narrative. Garden weather, Town trip, and Castle tale each provide four oversized object families, five predictable visual variants, a safe initial selection, and their own repeatable relationship vocabulary. Each family declares a cast limit: singular story anchors such as the sun, bus, horse, armor, and dragon appear once, while families such as flowers, clouds, children, and friends allow a small group of up to three. Trying to add beyond a limit revisits the nearest existing member rather than adding clutter or deleting anything. An ordinary placement or object tap rotates the highlight to the next family so repeated toddler taps produce variety without requiring palette comprehension; the palette remains available for exact choice. Nearby pairs begin a persistent story beat; touching either participant cycles that shared interaction through active, paused, and reversed states, while moving one toward a new partner redirects the story. In Castle tale, person, horse, armor, and dragon can form reversible rider, armored hero, armored rider, and royal-reunion tableaux without consuming an ingredient. Existing objects remain touchable and broadly movable. A large setting control previews the three choices, and a separate confirmation is required before changing the background clears the current scene.

The storytelling world is available from the launcher for testing. Its availability does not establish that young children understand selecting a family and then placing it, distinguish changing an object from moving it, understand the setting transition, or intentionally discover and repeat relationships. Those questions remain for rendered, device, caregiver, and child observation.

## Together Tones: available temporal-play world

Together Tones explores temporal order and informal turn-taking through four oversized visual voices. Every activation creates a complete visible response whether sound is enabled or not. Repeating the same voice creates an echo response; moving to a different voice connects the last pair. A four-bead trail shows recent order without asking the child to copy it; each bead is independently touchable and reactivates that one voice as the newest action. Recent repetition, alternation, three-voice, and four-voice patterns briefly form stable rings, an arc, a triangle, or a loop. Only one brief generated tone plays at a time, and muting never removes the visual state.

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
- Bloom merges exactly three mutually nearby, matching-color peers into one bouquet or flowering tree, retains their represented source count, and cannot advance beyond tier two;
- Bloom exposes at most one visitor from current garden conditions; four visitor touches end the visit without changing a flower;
- reaching the flower count bound revisits an existing flower and never silently removes the child's work;
- sound-off play retains complete visible feedback;
- the application shell is available offline after a successful first load;
- after that first successful load, airplane mode must not prevent launching the collection, entering any game, using any interaction, or returning Home;
- reduced-motion mode removes ambient and sparkle motion and shortens growth motion.
- every Color Splash board contains its declared identity set, remains distinguishable by symbol as well as color, and is solvable without a move limit;
- flood moves never shrink the connected corner region or mutate the prior board;
- decorative board gaps resolve deterministically to a nearby square;
- repeated/current-color input visibly acknowledges the connected region;
- Color Splash completion waits for the explicit new-board control before starting another board.
- Color Splash reserves or overlays its Back one and New board controls so their appearance cannot shift the board, resize cells, recenter the grid, or change accepted tap geometry;
- state changes preserve the active play surface's stable anchors, and game-controlled camera zoom or automatic fit changes appear only where a documented mechanic requires them;
- user-initiated browser and accessibility zoom remains functional;
- each Peekaboo search contains one stable target, two unique familiar friends, one stable clue pocket, and three distinct non-color patterns;
- pocket discovery is monotonic, opening and closing never mutates prior state, and discovering all pockets never blocks further play;
- every friend has a locally bundled vector illustration and remains independently touchable while emerged;
- the target and clue indices never change in response to a choice, and target discovery is monotonic;
- greeting partners are selected deterministically only from currently open non-clue pockets;
- Peekaboo derives at most one together relationship from its two open friends; closing either home removes it and touching either participant can repeat it without changing round state;
- Stack & Settle always contains exactly five distinct reusable pieces with immutable state transitions;
- Stack & Settle permits only its explicit ball-and-nest overlap; other occupied releases and layout changes resolve to clear supported positions;
- the Stack beam is visually distinct in width and a broad drop near a compatible support pair produces a collision-free bridge at their midpoint;
- a recognized Stack bridge remains a bridge across saved or live orientation changes, and its resident remains derived from the structure rather than persisted as a reward;
- Stack's spotted bird is bounded to one, responds locally for four touches, never changes the build, and cannot return until the bridge condition is broken and recreated;
- tap-only input places and rearranges pieces without requiring a drag;
- every released piece settles within horizontal bounds and into a supported floor, stack, or nest state;
- ball-and-nest, stacked, and side-by-side relationships are deterministic and do not consume pieces;
- interrupted drags preserve the prior arrangement and never consume the next tap;
- Story Scenes defaults to flower placement, cycles exactly five variants per object family, and keeps every object revisitable;
- ordinary Story Scenes placement and object revisiting rotate the highlighted family through the current four-item cast while direct palette selection remains available;
- Story Scenes relationships depend on stable nearby pairs, retain only one bounded reversible interaction per pair, and never consume or replace their objects;
- each Story Scenes family enforces its declared limit of one to three, and excess placement revisits the nearest existing member without changing object count;
- Castle tale derives rider, armored hero, armored rider, and royal-reunion compositions deterministically from current proximity; separating ingredients reverses the composition and preserves every source object;
- Story Scenes remains bounded at 16 objects and revisits nearby work instead of deleting it at the limit;
- Together Tones retains at most four recent actions, lets each history bead reactivate exactly one voice, keeps five visual levels per voice, and maintains one active pair;
- repeating and alternating voices have deterministic visual consequences without requiring sound;
- every Together Tones action stops the prior generated tone before starting another, so audio cannot accumulate;

Observation checks before public release:

- most children in the intended audience discover the primary action without verbal instruction;
- missed, repeated, simultaneous, and palm touches never look like failure;
- motion and sound remain comfortable for the child and nearby caregiver;
- children can disengage without the experience resisting or nagging;
- caregivers understand the experience's value without inflated educational claims;
- the game remains interesting on a later day, not only during first exposure.

## Explicit non-goals

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

## Current portfolio boundary

All six experiences are public and mechanically verified, but none is child-validated. Availability supports observation; it does not establish comprehension, comfort, developmental benefit, or voluntary return.

The Familiar World foundation, first recurring-resident pilot, and first shared relationship meaning are implemented: Home never clears work; Bloom, Stack & Settle, and Story Scenes restore one bounded local creation; and their shared Fresh control requires explicit confirmation. Saved state remains on the device, contains no identity or engagement history, is validated against the current game model, and safely falls back when unavailable or incompatible. Finite games begin as fresh rounds and retain deliberate in-game replay. Bloom's spotted bird recognizes a child-built bridge in Stack & Settle without creating a collection, unlock, or cross-game progression state. Peekaboo's themed reunions now express the same visible “together” meaning already present in Bloom links, Story relationships, and Together Tones pairs while preserving its own reveal-and-search agency.

Color Splash now keeps one rendered board frame across ordinary play, Back one, completion, and New board. The current cross-game decision and sequencing live only in `ROADMAP.md`; detailed per-game candidates live in `GAME_ROADMAPS.md`; evidence and meaningful feedback provenance live in `EVIDENCE.md`.
