# SuperSimpleGames

[![Verify](https://github.com/MidnightProject-MP/CT-SuperSimpleGames/actions/workflows/verify.yml/badge.svg)](https://github.com/MidnightProject-MP/CT-SuperSimpleGames/actions/workflows/verify.yml)

SuperSimpleGames is a mobile-first collection of playful, no-fail experiences for toddlers. Each game should reward exploration while quietly reinforcing an early developmental concept.

The product intent lives in [INCEPTION.md](./INCEPTION.md).
Current hypotheses and validation criteria live in [docs/PRODUCT.md](./docs/PRODUCT.md).
The first caregiver-observation protocol is in [docs/PLAYTEST.md](./docs/PLAYTEST.md).
Color Splash has its own focused protocol in [docs/COLOR_SPLASH_PLAYTEST.md](./docs/COLOR_SPLASH_PLAYTEST.md).
Peekaboo Pockets has a reversible-discovery protocol in [docs/PEEKABOO_PLAYTEST.md](./docs/PEEKABOO_PLAYTEST.md).
Uncommitted future directions are captured separately in [docs/IDEAS.md](./docs/IDEAS.md).
The broader interaction landscape and third-game decision are recorded in [docs/CONCEPTS.md](./docs/CONCEPTS.md).

## Games

### Bloom

Bloom is a cause-and-effect color garden. Tapping or dragging anywhere on the play surface creates bright flowers and soft musical tones. There are no scores, timers, mistakes, ads, accounts, or links away from the experience.

### Color Splash

Color Splash is a no-fail flood-fill puzzle. Tapping any square gives its color and symbol to the connected region growing from the top-left corner. There is no move limit or wrong choice; filling the board creates a gentle completion moment, and the next tap starts a new board.

### Peekaboo Pockets

Peekaboo Pockets is an open-and-close discovery game. Three large patterned pockets hold stable familiar surprises. Every pocket opens, closes, and can be revisited; there is no correct pocket, memory test, or forced ending.

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

Validate all three interaction styles with caregivers and children before adding progression or extracting a general game framework. Bloom tests direct open-ended creation, Color Splash tests connected-region planning, and Peekaboo Pockets tests open/close discovery and revisiting stable hidden objects.
