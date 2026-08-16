# SuperSimpleGames

SuperSimpleGames is a mobile-first collection of playful, no-fail experiences for toddlers. Each game should reward exploration while quietly reinforcing an early developmental concept.

The product intent lives in [INCEPTION.md](./INCEPTION.md).
Current hypotheses and validation criteria live in [docs/PRODUCT.md](./docs/PRODUCT.md).
The first caregiver-observation protocol is in [docs/PLAYTEST.md](./docs/PLAYTEST.md).

## First game: Bloom

Bloom is a cause-and-effect color garden. Tapping or dragging anywhere on the play surface creates bright flowers and soft musical tones. There are no scores, timers, mistakes, ads, accounts, or links away from the experience.

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

Validate Bloom with caregivers and children before adding progression or a larger game-selection shell. The next game should teach a distinct concept while reusing the same interaction principles, not merely add more visual variety.
