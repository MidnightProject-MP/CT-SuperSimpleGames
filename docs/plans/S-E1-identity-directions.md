# Execution plan — E1 identity-directions exploration

Disposable machinery for [`ROADMAP.md`](../ROADMAP.md) story E1. Delete after commit.

## Current state (inspected 2026-08-24)

- Current identity: rounded, pastel, minimalist, polished — coherent and friendly but convergent with much of the children's-app market. The owner's strategic test: "could someone recognize a SuperSimpleGames screenshot without seeing the logo?"
- Styling is per-world CSS with hardcoded palettes; a global skin can realistically restyle the launcher plus representative play screens (Bloom, Peekaboo), not every surface.

## Directions (three, deliberately opinionated)

1. **Storybook print** — paper-grain background, ink-outlined borders with slight wobble, muted natural palette (sage/terracotta/cream), display-serif headings, deckled card edges. Feel: picture-book page.
2. **Toy poster** — saturated flat colors, thick chunky borders, hard offset shadows (toy plastic), high contrast, extra-rounded geometry pushed to boldness. Feel: toy box poster.
3. **Crayon handmade** — waxy crayon-stroke borders, paper texture, slightly off-register color fills, wobbly hand-drawn lines, warm white paper. Feel: made by hand, on purpose.

## Mechanism (internal instrument, not a product feature)

- `skins/identity/{storybook,toy-poster,crayon}.css` + a tiny loader: `?skin=<name>` on launcher/bloom/peekaboo injects the skin `<link>` after existing stylesheets. No UI links; not in the service-worker shell (offline play is skin-free); documented as dev-only in `skins/identity/README.md`.
- Representative screens: launcher, Bloom, Peekaboo (cards, playfield+header, pockets — three distinct layout grammars).

## Judgment

Celestan reviews side-by-side screenshots (baseline + 3 skins × 3 screens) against the recognition test and distinctiveness from the market, then records a directions report with committed screenshots for the owner's taste call. Shipping nothing is an acceptable outcome; no skin ships by default.

## Exit condition

Skins + loader committed; screenshots committed under `docs/identity/`; directions report recorded; released for owner viewing.
