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

Every tap grows a large flower at or near the contact point. Flowers cycle through named colors and vary in size and petal count. A short synthesized tone reinforces each result; a visible sound control disables it. Dragging produces a deliberately rate-limited trail. The garden retains only the newest 24 flowers.

Bloom supports exposure to cause and effect, colors, spatial position, relative size, and variation. It does **not** claim to teach or assess mastery of those concepts.

## Color Splash: second product slice

Color Splash presents a 4×4 board using four color-and-symbol identities. Tapping anywhere inside the visible board resolves to a nearby square, changes the connected region anchored at the top-left to that square's identity, and absorbs adjacent matches. A local response and traveling color make the resolved choice visible. Repeating the current identity traces the connected region rather than appearing ignored. There is no move limit, wrong choice, score, or automatic restart. A completed board holds its state until the child activates an explicit large new-board control. Three stable designed boards introduce legible spatial structures before later rounds use procedural variation.

Color Splash supports exposure to color and symbol matching, connected regions, cause and effect, and simple multi-step planning. It does **not** assess reasoning or claim that completion demonstrates mastery.

## Peekaboo Pockets: third product slice

Peekaboo Pockets presents three oversized, patterned pockets with familiar friends that remain assigned to stable locations. Tapping opens or closes a pocket. A friend visibly emerges as its own large control, can be greeted independently, and exchanges one deterministic greeting with a nearby emerged friend. The illustrations are a cohesive local vector set rather than platform-dependent emoji. Every pocket responds, discovery is retained, and opening all three produces one brief whole-scene reunion without ending or restarting play. There is no correct pocket, shuffle, memory test, score, or precision drag.

Peekaboo Pockets supports exposure to open/closed, visible/hidden, containment, stable location, and revisiting. It does **not** assess memory or claim to teach object permanence. Its larger purpose is to test whether a reversible state change invites a different kind of curiosity and caregiver co-play from the first two games.

## Acceptance evidence

Mechanical checks:

- portrait and landscape phone layouts fit without scrolling or clipping;
- the first interaction is available without a network call or permission;
- every page enforces a local-only browser policy that blocks external scripts, connections, forms, frames, and embedded objects;
- 30 rapid taps do not freeze, navigate, stack audio, or grow the DOM without bound;
- generated flower positions remain within the visible viewport;
- sound-off play retains complete visible feedback;
- the application shell is available offline after a successful first load;
- reduced-motion mode removes ambient and sparkle motion and shortens growth motion.
- every designed and generated Color Splash board contains all four identities and is solvable without a move limit;
- flood moves never shrink the connected corner region or mutate the prior board;
- decorative board gaps resolve deterministically to a nearby square;
- repeated/current-color input visibly acknowledges the connected region;
- Color Splash completion waits for the explicit new-board control before starting another board.
- each Peekaboo round contains three unique familiar objects and three distinct non-color patterns;
- pocket discovery is monotonic, opening and closing never mutates prior state, and discovering all pockets never blocks further play;
- every friend has a locally bundled vector illustration and remains independently touchable while emerged;
- greeting partners are selected deterministically from currently open non-self pockets;

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

The ordered implementation and validation sequence now lives in `ROADMAP.md`. Color Splash's forgiving-input implementation awaits device observation; the next implementation priority is to deepen Peekaboo, followed by Bloom and a direct-manipulation construction experiment. Comparative observation remains necessary before treating these hypotheses as validated, but an unavailable real-world observation step should not prevent bounded, reversible technical prototypes from advancing. Do not extract a generalized framework merely because the pages share controls.
