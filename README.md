# SuperSimpleGames

[![Verify](https://github.com/MidnightProject-MP/CT-SuperSimpleGames/actions/workflows/verify.yml/badge.svg)](https://github.com/MidnightProject-MP/CT-SuperSimpleGames/actions/workflows/verify.yml)

SuperSimpleGames is a mobile-first collection of playful, no-fail experiences for toddlers. Each game should reward exploration while quietly reinforcing an early developmental concept.

The product intent lives in [INCEPTION.md](./INCEPTION.md).
Current hypotheses and validation criteria live in [docs/PRODUCT.md](./docs/PRODUCT.md).
The ordered implementation plan lives in [docs/ROADMAP.md](./docs/ROADMAP.md).
The first caregiver-observation protocol is in [docs/PLAYTEST.md](./docs/PLAYTEST.md).
Color Splash has its own focused protocol in [docs/COLOR_SPLASH_PLAYTEST.md](./docs/COLOR_SPLASH_PLAYTEST.md).
Peekaboo Pockets has a reversible-discovery protocol in [docs/PEEKABOO_PLAYTEST.md](./docs/PEEKABOO_PLAYTEST.md).
Stack & Settle has a direct-manipulation protocol in [docs/STACK_SETTLE_PLAYTEST.md](./docs/STACK_SETTLE_PLAYTEST.md).
The unlisted Story Scenes prototype has a focused composition protocol in [docs/STORY_SCENES_PLAYTEST.md](./docs/STORY_SCENES_PLAYTEST.md).
Cross-game observations are normalized in [docs/COMPARATIVE_PLAYTEST.md](./docs/COMPARATIVE_PLAYTEST.md).
Uncommitted future directions are captured separately in [docs/IDEAS.md](./docs/IDEAS.md).
The broader interaction landscape and third-game decision are recorded in [docs/CONCEPTS.md](./docs/CONCEPTS.md).

## Games

### Bloom

Bloom is a relational color garden. Tapping or dragging empty space creates bright flowers and soft musical tones; touching an existing flower grows it again, and nearby flowers form visible connections and lean toward one another. There are no scores, timers, mistakes, ads, accounts, or links away from the experience.

### Color Splash

Color Splash is a no-fail flood-fill puzzle. Tapping anywhere on the board resolves to a nearby square and gives its color and symbol to the connected region growing from the top-left corner. There is no move limit or wrong choice; filling the board creates a gentle completion moment that remains until the child chooses a new board.

### Peekaboo Pockets

Peekaboo Pockets is an open-and-close search game. A large visual target invites the child to explore three stable patterned pockets: two hold familiar friends and one holds a playful clue. Friends visibly emerge, remain touchable, and greet one another. Every pocket responds and finding the target enriches the scene without ending play.

### Stack & Settle

Stack & Settle is a no-fail construction toy with five oversized reusable pieces. Tapping places or rearranges a piece, while broad dragging offers direct control. Pieces magnetically settle on the floor, stack, sit side by side, or let the ball nest inside the curved piece. Every arrangement remains movable and there is nothing to complete.

### Story Scenes prototype

Story Scenes is an intentionally unlisted garden-scene experiment. It combines four large object-family choices, tap-anywhere placement, five predictable variants, revisitable objects, broad movement, and a few discoverable relationships. It remains outside the launcher until real-world observation shows that selecting and then placing stays simple for the intended audience.

The first slice establishes these product principles:

- every ordinary interaction produces a satisfying response;
- controls and targets are large, forgiving, and resilient to repeated input;
- the experience works without reading, but remains accessible to assistive technology;
- sound can be disabled and reduced-motion preferences are respected;
- no personal data is collected or transmitted;
- the app works offline after its first successful load.

## Safety boundary

The playable pages contain no purchases, accounts, forms, permissions, advertising, analytics, or links to another service. A local-only browser policy also blocks external scripts and network connections if a future edit introduces one accidentally.

SuperSimpleGames is not device lockdown: a website cannot prevent operating-system gestures, notifications, or access to the rest of a phone. A caregiver should remain nearby and use the device's single-app control—Guided Access on Apple devices or screen pinning on Android—when handing over a device that contains sensitive apps or accounts. See [docs/PRODUCT.md](./docs/PRODUCT.md) for the complete invariant and validation criteria.

## Run locally

The project has no third-party runtime dependencies.

```powershell
node scripts/dev-server.mjs
```

Then open <http://localhost:4173>.

## Verify

```powershell
node --test
```

## Near-term direction

Follow the ordered milestones in [docs/ROADMAP.md](./docs/ROADMAP.md). The four launched games await comparative device and child observation. Story Scenes is available only as a bounded technical prototype; launcher promotion and content expansion remain conditional and must not be described as child-validated without real-world observation.
