# SuperSimpleGames

[![Verify](https://github.com/MidnightProject-MP/CT-SuperSimpleGames/actions/workflows/verify.yml/badge.svg)](https://github.com/MidnightProject-MP/CT-SuperSimpleGames/actions/workflows/verify.yml)

SuperSimpleGames is a mobile-first collection of playful, no-fail experiences for toddlers. Each game should reward exploration while quietly reinforcing an early developmental concept.

Start with the [documentation map](./docs/README.md). It distinguishes current product truth, the active roadmap, detailed per-game plans, evidence, observation protocols, exploratory ideas, and historical decisions. The founding intent remains in [INCEPTION.md](./INCEPTION.md).

## Games

### Bloom

Bloom is a relational color garden. Tapping or dragging empty space creates bright flowers and soft musical tones; revisiting one moves it through a circular growth story, and nearby flowers form visible connections and lean toward one another. Three nearby matching-color flowers merge into a bouquet, and three matching bouquets can become one flowering tree, keeping dense gardens legible without an endless upgrade ladder. There are no scores, timers, mistakes, ads, accounts, or links away from the experience.

### Color Splash

Color Splash is a no-fail flood-fill puzzle. Tapping anywhere on the board resolves to a nearby square and gives its color and symbol to the connected region growing from the top-left corner. Enlarged four-cell boards introduce the rule before bridge, island, stripe, ring, path, and pocket patterns invite different kinds of connected-region play. There is no move limit or wrong choice; filling the board creates a gentle completion moment that remains until the child chooses a new board.

### Peekaboo Pockets

Peekaboo Pockets is an open-and-close search game. A large visual target invites the child to explore three stable themed homes: cozy animal beds, vehicle garages, weather clouds, or sea-creature shells. Two hold familiar friends and one holds a playful clue. Friends visibly emerge, remain touchable, and form a repeatable themed relationship: animals snuggle, vehicles move, sky friends float, and sea friends swim together. Closing either home removes the relationship without moving anyone. Every home responds and finding the target enriches the scene without ending play.

### Story Scenes

Story Scenes is a symbolic storytelling world with garden, town, and castle settings. Each supplies four large object families, automatic palette rotation, five predictable variants, a small per-family cast limit, revisitable objects, broad movement, and repeatable theme relationships. Castle ingredients can form reversible rider, armor, and royal-reunion tableaux. It is available for testing but is not yet child-validated.

### Memory

Memory Pairs is a deliberately thin matching-and-recall experiment. Four oversized cards start face-up so the child can study two pairs of familiar friends; the friends then hide behind patterned backs with no timer pressure. Matching celebrates and mismatches stay cheerful, with the information preserved for another attempt. Completing both pairs brings an everyone-together moment and a "Hide again" replay control. It does not claim to train memory or assess recall.

### Numbers

Numbers is a deliberately thin quantity experiment. Three oversized number bubbles — 1, 2, 3 — sit beneath an open meadow; tapping one brings that many friendly characters into the scene with immediate visual and sound feedback. Every arrived friend remains touchable and playful, and repeating or changing the number simply reshapes the scene. There is no quiz, wrong answer, score, or escalation pressure, and the world does not claim to teach arithmetic.

The collection follows these product principles:

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

CI performs JavaScript syntax checks and the deterministic `node --test` suite. Rendered/offline qualification is a separate evidence layer: `scripts/verify-offline.mjs` exercises a real browser via `playwright-core` and a system Edge installation, so it is not part of the dependency-free default test suite.

```powershell
node --test
```

## Near-term direction

Follow the current milestone in [docs/ROADMAP.md](./docs/ROADMAP.md). All six active experiences are available from the launcher. Implementation, rendered inspection, device observation, caregiver feedback, and child observation are recorded as distinct evidence layers.
