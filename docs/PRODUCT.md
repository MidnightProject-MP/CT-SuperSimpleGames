# Product direction

This document turns the intent in `INCEPTION.md` into explicit, testable hypotheses. It should change when observation provides better evidence.

## Audience hypothesis

SuperSimpleGames is initially designed for children roughly 18–36 months old playing with a nearby caregiver. That range is a hypothesis, not a release claim; toddlers' motor, language, sensory, and attention needs vary substantially. Research synthesis (2026-08-23, see `EVIDENCE.md`) resolves the band into roughly three developmental regimes — pre-symbolic (<24 months), emerging representation (24–30), representational (30–42) — described as working personas in [`PERSONAS.md`](./PERSONAS.md). Each world declares which regime(s) it serves and remains fully playable at the simpler surface for younger children.

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
7. **Accessibility is part of resilience.** The app supports keyboard activation and assistive labels, exposes a sound toggle, and respects reduced-motion preferences. Child play surfaces additionally reject accidental scale/pan gestures — toddler pinch/pan measurably interrupted play, so in-page pinch zoom is intentionally sacrificed there (revised 2026-08-24; OS-level accessibility zoom remains the preserved path). The caregiver page keeps full browser zoom.
8. **Engagement is not the objective.** Do not add streaks, nagging, notifications, variable rewards, or autoplay. Caregiver-observed delight and repeat interest matter more than session length.
9. **Spatial stability is part of legibility.** The child's active surface does not unexpectedly move, resize, or recenter when controls appear or state changes; accidental toddler gestures must not scale or pan it either (see principle 7). Game-controlled zoom or reframing is reserved for mechanics that genuinely benefit from changing scale.
10. **Special moments are protected and create rhythm.** An event worth interrupting play for — such as the rainbow tree — unfolds briefly before accidental input can dismiss it, then hands the choice to continue, restart, or leave back to the child.
11. **Celebration targets events and artifacts, never the child.** Feedback describes what happened in the world; there is no person-praise ("good job", "you're smart") in sound, text, or animation.

## Caregiver layer

Adult concerns live behind one gated adult surface, kept away from child play. The launcher footer holds a small, muted "For grown-ups" control that opens only after a 1500 ms press-and-hold with visible progress; quick taps do nothing (keyboard users activate directly for accessibility). The caregiver page owns: the sound default (shared with the child-facing in-game toggles), session length (off/10/15/20/30 minutes — stored for the wind-down ritual), developmental level (default/gentle/rich — stored for worlds to adopt gradually), which worlds appear on the launcher (the last visible world cannot be hidden), and a confirmed reset that clears all local settings and saved creations. Every change persists immediately; nothing is transmitted. Settings are validated field-by-field and fall back to defaults when stored data is missing, malformed, or storage is restricted. The child-facing interface gained only the muted footer gate.

### Developmental level

The caregiver-set level (default/gentle/rich) adjusts worlds from the inside — no gates, modes, or anything child-visible. Gentle: Bloom's garden bounds at 16 live objects instead of 24; Color Splash's generated boards use three identities instead of four. Default and rich reproduce the standard experience exactly. Peekaboo Pockets and Story Scenes are level-neutral by decision: Peekaboo already targets the youngest regime, and Story Scenes depth is frozen pending child observation. Memory and Numbers adopt level parameters only when their experiments harden. (The former Stack & Settle and Together Tones gentle adaptations retired with those worlds.)

### Session wind-down

When a caregiver sets a session length, the elapsed session produces a gradual wind-down across the launcher and every world: a slow warm dimming during the final two minutes (evening), then a calm full-screen good-night veil with a per-world line ("The garden is going to sleep.") and a single warm "Play again" sun. There are no countdown numbers, no urgency, and no failure aesthetics; motion transitions are slow and removed under reduced-motion preferences. Play stops by resting rather than being taken away; the sun restarts a fresh session as a deliberate choice. Choosing "Off" disables the ritual entirely.

## Bloom: first product slice

Every tap on empty space grows a large flower at or near the contact point. Flowers cycle through named colors and vary in size and petal count. Touching an existing flower advances a circular visual growth story—fresh, taller, full, seed-ready, and renewed—and leans that bloom one small step toward its nearest matching-color relative; bouquets lean toward nearby bouquets. Any three mutually nearby flowers become one three-flower bouquet whatever their colors, planting between two existing blooms resolves to their midpoint, and a newly formed bouquet settles toward a nearby bouquet, so structures gather through ordinary play without any move mode. Three bouquets become one flowering tree; every merged bloom remembers the set of colors that built it and wears them in its petals — a mixed bouquet shows a ring of its founders' colors, and a tree spanning all six garden colors is a literal rainbow tree that arrives with a brief full-screen rainbow cutscene: the world pauses underneath, touches during a short opening hold are absorbed so the moment can unfold, a touch after the hold dismisses it early, it dismisses itself after a few seconds, and reduced-motion preferences skip the visuals entirely. Three flowering trees standing near one another drift away together in a quiet send-off that frees the garden for new planting. The result carries the represented flower count, transformations are deterministic, and nothing escalates beyond a tree. Nearby matching colors still form a soft harmony and differing colors an alternating rhythm. A short synthesized tone reinforces each result, and a visible sound control disables it. Dragging produces a deliberately rate-limited trail. The garden remains bounded at 24 live objects; reaching the bound converts touches into tending, and because tending gathers blooms toward merges, a full garden keeps evolving and freeing room to plant instead of freezing.

Bloom supports exposure to cause and effect, colors, spatial position, relative size, variation, and simple ecological relationships. Stable arrangements can invite exactly one calm visitor: a bee, a two-winged butterfly, or a three-spotted bird. Each moves locally when touched and leaves after a short visit without taking or changing a flower. Visitors are deterministic consequences, not rare rewards or collectibles. Bloom does **not** claim to teach or assess mastery of those concepts.

## Color Splash: second product slice

Color Splash begins with enlarged four-cell boards using two to four color-and-symbol identities, then moves to 4×4 boards using four. Tapping anywhere inside the visible board resolves to a nearby square, changes the connected region anchored at the top-left to that square's identity, and absorbs adjacent matches. A local response and traveling color make the resolved choice visible. Repeating the current identity traces the connected region rather than appearing ignored. There is no move limit, wrong choice, score, or automatic restart. A completed board celebrates and holds briefly before any tap can start a fresh board, so the moment cannot be destroyed by the next reflexive input. Stable bridge, islands, stripes, rings, path, and pockets families introduce legible spatial structures before later rounds use procedural variation.

Color Splash supports exposure to color and symbol matching, connected regions, cause and effect, and simple multi-step planning. It does **not** assess reasoning or claim that completion demonstrates mastery. When a board completes, the same butterfly seen in Bloom lands on squares of the finished board, glides between them when touched (alternating flap and glide responses), and flies home after three touches.

## Peekaboo Pockets: third product slice

Peekaboo Pockets presents one large visual target and three oversized containers whose contents remain stable for the round. Four coherent scenes pair cozy animals with beds, vehicles with garages, weather friends with clouds, and sea creatures with shells. Two containers hold familiar friends and one holds a playful clue. Tapping opens or closes a container. A friend visibly emerges as its own large control and can be greeted independently. When both friends are open, one derived connector makes “together” persistent and each theme expresses it locally: animals snuggle, vehicles move, sky friends float, and sea friends swim. Touching either friend repeats the bounded shared motion; closing either home removes the relationship without moving or consuming anyone. The clue is also touchable and lively, so a non-target choice never resembles failure. Finding the target changes the prompt but leaves every interaction available and reveals a deliberate “Hide again” control for an in-game fresh search; nothing shuffles during an active round.

Peekaboo Pockets supports exposure to open/closed, visible/hidden, containment, stable location, and revisiting. It does **not** assess memory or claim to teach object permanence. Its larger purpose is to test whether a reversible state change invites a different kind of curiosity and caregiver co-play from the first two games.

## Stack & Settle: retired product slice

Stack & Settle was removed from the launcher on 2026-08-24 by owner direction and replaced in the portfolio by Memory. Its construction agency (direct manipulation, revision) did not earn a scarce slot against the confirmed matching/recall and quantity gaps, and its archive no longer waits on device evidence. The full description of its last shipped state lives in git history; salvageable patterns are noted in `IDEAS.md`.

## Together Tones: retired product slice

Together Tones was removed from the launcher on 2026-08-24 by owner direction and replaced in the portfolio by Numbers. Its temporal-pattern territory intentionally left the collection; its research risk for under-30-month children (arbitrary sequence recall) was never resolved by observation. The full description of its last shipped state lives in git history; salvageable patterns are noted in `IDEAS.md`.

## Story Scenes: available storytelling world

Story Scenes explores whether creation, revisiting, direct manipulation, and stable relationships can become a tiny child-authored narrative. Garden weather, Town trip, and Castle tale each provide four oversized object families, five predictable visual variants, a safe initial selection, and their own repeatable relationship vocabulary. Each family declares a cast limit: singular story anchors such as the sun, bus, horse, armor, and dragon appear once, while families such as flowers, clouds, children, and friends allow a small group of up to three. Trying to add beyond a limit revisits the nearest existing member rather than adding clutter or deleting anything. An ordinary placement or object tap rotates the highlight to the next family so repeated toddler taps produce variety without requiring palette comprehension; the palette remains available for exact choice. Nearby pairs begin a persistent story beat; touching either participant cycles that shared interaction through active, paused, and reversed states, while moving one toward a new partner redirects the story. In Castle tale, person, horse, armor, and dragon can form reversible rider, armored hero, armored rider, and royal-reunion tableaux without consuming an ingredient. Existing objects remain touchable and broadly movable.

The storytelling world is available from the launcher for testing. Three pictorial scene chips in the dock switch stories directly — tapping one parks the current scene and restores the target exactly as it was left, with no overlay or confirmation step. In the Garden weather setting, once three or more objects stand in the scene, a gentle snail slides in along the scene's lower edge near the child's lowest objects, travels between spots when touched while facing its direction, and departs after three touches. Existing objects remain touchable and broadly movable; when an ordinary placement or move relates to a nearby partner, that object settles snugly beside its partner instead of hovering at drop distance, and combined tableaux render their art clear of the participants rather than on top of them. Its availability does not establish that young children understand selecting a family and then placing it, distinguish changing an object from moving it, or intentionally discover and repeat relationships. Those questions remain for rendered, device, caregiver, and child observation.

## Memory: experimental matching-and-recall world

Memory Pairs is a deliberately thin experiment answering one question: do toddlers act on *remembered* locations when finding pairs they watched hide? Four oversized cards (two pairs of familiar friends) start face-up so the child can study them; the friends then hide behind patterned card backs with no timer pressure. The child flips any cards at any time. A matched pair celebrates and stays open together; a mismatched pair shows both friends cheerfully, hides them again, and keeps the information ("the duck was THERE") without any failure aesthetics. Completing both pairs brings an everyone-together moment and a "Hide again" replay control. Seeded rounds are deterministic; sound-off play is complete; reduced motion is respected. It does **not** claim to train memory or assess recall, and it never uses unseen face-down grids, scores, timers, or move counters.

## Numbers: experimental quantity-as-event world

Number Nibbles is a deliberately thin experiment answering one question: does the child notice and enjoy that their own action changed how many berries there are? One friendly creature sits beside a plate of five berries. Tapping the plate sends one berry hopping into the creature's visible pile, with each quantity carrying its own tone step and creature reaction (curious → happy → delighted). Touching the creature shares berries back out one at a time. At five the creature is satisfyingly full — celebrated, never refused. There is no request to satisfy, no numerals required, no wrong answer; free add/remove play stands alone by design. Word counts ("three berries!") appear without counting tasks. It does **not** claim to teach arithmetic, and it excludes quizzes, required numeral recognition, autoplay, and escalation toward larger numbers.

## Acceptance evidence

Mechanical checks:

- portrait and landscape phone layouts fit without scrolling or clipping;
- the first interaction is available without a network call or permission;
- every page enforces a local-only browser policy that blocks external scripts, connections, forms, frames, and embedded objects;
- 30 rapid taps do not freeze, navigate, stack audio, or grow the DOM without bound;
- generated flower positions remain within the visible viewport;
- existing flowers can be revisited and grow only to a bounded maximum size;
- Bloom neighborhood links and canopies derive deterministically from current state, remain capped, and never consume a flower;
- Bloom merges exactly three mutually nearby flowers into a bouquet regardless of color, and exactly three mutually nearby bouquets into one flowering tree, retaining their represented source count and never advancing beyond tier two;
- every merged bloom carries the deterministic set of ancestry colors and distributes them across its petals in stable order; a tree spanning all six is celebrated as a rainbow tree without creating collection or progression state;
- three mutually nearby trees dissolve together in one bounded event that removes only those three; two never do;
- a tended bloom moves at most one bounded step toward its nearest matching-color relative (or, for bouquets, the nearest bouquet), remains within viewport bounds, never overlaps its target, and cannot move trees; planting between two blooms resolves to their midpoint; a new bouquet settles at most once toward its nearest neighbour;
- seeded ordinary-play traces in CI reach the first bouquet by tap 50 in at least 90% of runs, a flowering tree by tap 100 in at least 80%, and a tree send-off in at least 90% of runs.
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
- Color Splash completion holds briefly (1500 ms) before any tap can start a fresh board; the celebration and its resident survive reflexive input;
- destructive resets are absent from child-facing worlds and live behind the grown-ups surface ("Clear saved creations" plus full reset);
- state changes preserve the active play surface's stable anchors, and game-controlled camera zoom or automatic fit changes appear only where a documented mechanic requires them;
- child play surfaces reject accidental scale/pan gestures; the caregiver page retains full browser zoom (standing constraint, revised 2026-08-24);
- each Peekaboo search contains one stable target, two unique familiar friends, one stable clue pocket, and three distinct non-color patterns;
- pocket discovery is monotonic, opening and closing never mutates prior state, and discovering all pockets never blocks further play;
- every friend has a locally bundled vector illustration and remains independently touchable while emerged;
- the target and clue indices never change in response to a choice, and target discovery is monotonic;
- greeting partners are selected deterministically only from currently open non-clue pockets;
- Peekaboo derives at most one together relationship from its two open friends; closing either home removes it and touching either participant can repeat it without changing round state;
- *(retired worlds: the Stack & Settle and Together Tones acceptance blocks were removed with their portfolio retirement on 2026-08-24; git history preserves them)*;
- Story Scenes defaults to flower placement, cycles exactly five variants per object family, and keeps every object revisitable;
- ordinary Story Scenes placement and object revisiting rotate the highlighted family through the current four-item cast while direct palette selection remains available;
- Story Scenes relationships depend on stable nearby pairs, retain only one bounded reversible interaction per pair, and never consume or replace their objects;
- each Story Scenes family enforces its declared limit of one to three, and excess placement revisits the nearest existing member without changing object count;
- Castle tale derives rider, armored hero, armored rider, and royal-reunion compositions deterministically from current proximity; separating ingredients reverses the composition and preserves every source object;
- Story Scenes remains bounded at 16 objects and revisits nearby work instead of deleting it at the limit;
- choosing a story setting switches immediately with no confirmation step, parks the outgoing scene in its own slot, restores the target scene's parked state, and migrates older single-scene snapshots into this world without loss;
- a related placement or move settles the touched object at a fixed snug gap beside its partner, within bounds and never onto it;
- combined tableaux render at an anchor clear of their participants in both orientations;

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

The active portfolio is **Bloom, Color Splash, Peekaboo Pockets, Story Scenes**, plus the experimental **Memory** (matching + spatial recall) and **Numbers** (quantity as manipulation) replacements for Stack & Settle and Together Tones, which were removed from the launcher on 2026-08-24 by owner direction (sources left inert in-tree pending deletion). Memory and Numbers are live at deliberately thin experiment quality and are **stopped at their evidence gates**: no hardening or widening until child/owner hands-on signal arrives.

Bloom is the only world with direct child-engagement evidence (owner-relayed informal observation, 2026-08-24): children engage with it — which is why gesture protection is now a standing invariant. All other claims remain mechanical, rendered, or simulated.

Home never clears work; Bloom and Story Scenes restore one bounded local creation; destructive resets live behind the grown-ups surface, which owns a "Clear saved creations" control alongside the full reset. Saved state remains on the device, contains no identity or engagement history, is validated against the current game model, and safely falls back when unavailable or incompatible. The recurring cast lives through Bloom's bee/butterfly/bird visitors plus Color Splash's butterfly and Story Scenes' snail. Peekaboo's themed reunions express the shared visible "together" meaning already present in Bloom links, Story relationships, and Memory's completed pairs while preserving its own reveal-and-search agency.

Color Splash keeps one rendered board frame across ordinary play, completion, and the protected hold. The current cross-game decision and sequencing live only in `ROADMAP.md`; detailed per-game candidates live in `GAME_ROADMAPS.md`; evidence and meaningful feedback provenance live in `EVIDENCE.md`.
