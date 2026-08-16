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

Every tap on empty space grows a large flower at or near the contact point. Flowers cycle through named colors and vary in size and petal count. Touching an existing flower tends and enlarges that same flower, making earlier work revisitable. A newly created flower near another forms one persistent visible connection; the pair briefly leans together. A short synthesized tone reinforces each result, and a visible sound control disables it. Dragging produces a deliberately rate-limited trail. The garden remains bounded at 24 flowers, but reaching the bound converts new touches into tending the nearest flower instead of silently erasing prior work. The animated invitation stops after play begins.

Bloom supports exposure to cause and effect, colors, spatial position, relative size, and variation. It does **not** claim to teach or assess mastery of those concepts.

## Color Splash: second product slice

Color Splash presents a 4×4 board using four color-and-symbol identities. Tapping anywhere inside the visible board resolves to a nearby square, changes the connected region anchored at the top-left to that square's identity, and absorbs adjacent matches. A local response and traveling color make the resolved choice visible. Repeating the current identity traces the connected region rather than appearing ignored. There is no move limit, wrong choice, score, or automatic restart. A completed board holds its state until the child activates an explicit large new-board control. Three stable designed boards introduce legible spatial structures before later rounds use procedural variation.

Color Splash supports exposure to color and symbol matching, connected regions, cause and effect, and simple multi-step planning. It does **not** assess reasoning or claim that completion demonstrates mastery.

## Peekaboo Pockets: third product slice

Peekaboo Pockets presents one large visual target and three oversized, patterned pockets whose contents remain stable for the session. Two pockets hold familiar friends and one holds a playful footprint clue. Tapping opens or closes a pocket. A friend visibly emerges as its own large control, can be greeted independently, and exchanges one deterministic greeting with the other emerged friend. The clue is also touchable and lively, so a non-target choice never resembles failure. The illustrations are a cohesive local vector set rather than platform-dependent emoji. Finding the target changes the prompt but leaves every interaction available; opening all three produces one brief whole-scene reunion without ending or restarting play. There is no shuffle after a guess, memory score, forced reset, or precision drag.

Peekaboo Pockets supports exposure to open/closed, visible/hidden, containment, stable location, and revisiting. It does **not** assess memory or claim to teach object permanence. Its larger purpose is to test whether a reversible state change invites a different kind of curiosity and caregiver co-play from the first two games.

## Stack & Settle: fourth product slice

Stack & Settle presents five oversized, reusable pieces in one bounded construction scene. A tap places or rearranges a piece without requiring sustained dragging. A broad drag gives richer positioning, after which the piece settles safely on the floor, on a nearby support, or into the ball-and-nest relationship. Floor neighbors, stacks, and nesting produce different brief responses. Pieces never collapse as punishment, remain movable, and cannot be consumed or duplicated.

Stack & Settle supports exposure to above/below, beside, inside, relative size, arrangement, revision, and turn-taking. It does **not** assess coordination, construction, balance, or spatial reasoning. Its larger purpose is to test direct manipulation and child-authored revision, forms of agency not present in the first three games.

## Story Scenes: unlisted technical prototype

Story Scenes explores whether the existing creation, revisiting, direct-manipulation, and relational mechanics can become a tiny child-authored narrative. One garden starts with flowers selected so the first empty-space tap works immediately. Four oversized object-family controls select flowers, friends, clouds, or suns; successive placements cycle through five variants. Existing objects remain touchable and broadly movable. Nearby weather and flowers produce watering or warming, nearby friends greet, and a nearby sun and cloud make a rainbow.

The prototype remains absent from the launcher. It does not yet establish that young children understand selecting a family and then placing it, distinguish changing an object from moving it, or intentionally discover and repeat relationships. It has no background selector or additional themed casts because those would add content before the central mode and storytelling hypotheses are observed.

## Acceptance evidence

Mechanical checks:

- portrait and landscape phone layouts fit without scrolling or clipping;
- the first interaction is available without a network call or permission;
- every page enforces a local-only browser policy that blocks external scripts, connections, forms, frames, and embedded objects;
- 30 rapid taps do not freeze, navigate, stack audio, or grow the DOM without bound;
- generated flower positions remain within the visible viewport;
- existing flowers can be revisited and grow only to a bounded maximum size;
- nearby new flowers form at most one stable connection to an existing neighbor;
- reaching the flower count bound revisits an existing flower and never silently removes the child's work;
- sound-off play retains complete visible feedback;
- the application shell is available offline after a successful first load;
- reduced-motion mode removes ambient and sparkle motion and shortens growth motion.
- every designed and generated Color Splash board contains all four identities and is solvable without a move limit;
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
- Story Scenes relationships depend only on stable nearby pairs and never consume or replace their objects;
- Story Scenes remains bounded at 16 objects and revisits nearby work instead of deleting it at the limit;

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

The ordered implementation and validation sequence now lives in `ROADMAP.md`. The deeper Color Splash, Peekaboo, Bloom, and Stack & Settle slices await device and child observation. Comparative portfolio review is the next validation milestone. An unlisted Story Scenes technical prototype now tests selection, placement, revisiting, and relational storytelling without claiming those interactions are child-validated. Do not expand its cast, add background selection, or extract a generalized framework merely because the pages share controls.
