# SuperSimpleGames

SuperSimpleGames is a mobile-first collection of playful, no-fail experiences for toddlers. Each game should reward exploration while quietly reinforcing an early developmental concept.

The product intent lives in [INCEPTION.md](./INCEPTION.md).
Current hypotheses and validation criteria live in [docs/PRODUCT.md](./docs/PRODUCT.md).
The first caregiver-observation protocol is in [docs/PLAYTEST.md](./docs/PLAYTEST.md).
Color Splash has its own focused protocol in [docs/COLOR_SPLASH_PLAYTEST.md](./docs/COLOR_SPLASH_PLAYTEST.md).
Uncommitted future directions are captured separately in [docs/IDEAS.md](./docs/IDEAS.md).

## Games

### Bloom

Bloom is a cause-and-effect color garden. Tapping or dragging anywhere on the play surface creates bright flowers and soft musical tones. There are no scores, timers, mistakes, ads, accounts, or links away from the experience.

### Color Splash

Color Splash is a no-fail flood-fill puzzle. Tapping any square gives its color and symbol to the connected region growing from the top-left corner. There is no move limit or wrong choice; filling the board creates a gentle completion moment, and the next tap starts a new board.

The first slice establishes these product principles:

- every ordinary interaction produces a satisfying response;
- controls and targets are large, forgiving, and resilient to repeated input;
- the experience works without reading, but remains accessible to assistive technology;
- sound can be disabled and reduced-motion preferences are respected;
- no personal data is collected or transmitted;
- the app works offline after its first successful load.

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

Validate both interaction styles with caregivers and children before adding progression or extracting a general game framework. Bloom tests direct open-ended creation; Color Splash tests color matching, connected regions, and simple planning.
