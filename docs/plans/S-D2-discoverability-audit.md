# Execution plan — D2 discoverability audit

Disposable machinery for [`ROADMAP.md`](../ROADMAP.md) story D2. Delete after commit.

## Current state (inspected 2026-08-24)

- Harness assets exist: clustered-burst traces reached Bloom rainbow at taps 102/480; uniform random taps reached nothing in 450 — discoverability depends on clustered ordinary play.
- Known suspects: Stack bridge requires drag competence (wave-1 synthetic drags never moved pieces out of the tray); Story castle compositions require gathering four ingredients deliberately.
- Principle under test: `surprise → curiosity → causal understanding → intentional reproduction`. A trigger that experimentation cannot plausibly reveal is effectively random to the child.

## Method

One delegated probe: per world, two strategies (clustered-burst, uniform) × two seeds, budget 300 taps (or 40 drag gestures for Stack), detecting trigger events via DOM signals (read each world's source first for exact selectors/classes/messages). Report fired/not-fired + tap index per trigger:

| World | Triggers probed |
|---|---|
| Bloom | first bouquet, first tree, rainbow, tree send-off |
| Color Splash | first board completion (families rotate by design) |
| Peekaboo | clue touched, target found, together reunion |
| Stack & Settle | any structure recognized, bridge + bird visit |
| Story Scenes | first pair story beat, castle composition |
| Together Tones | echo, link, any motif |

## Adjudication rule

- Fired by clustered play within budget → **discoverable** (record tap ranges).
- Not fired by clustered play but reachable by deliberate adult action → **redesign candidate** (bounded slice or documented acceptance with rationale).
- Not reachable at all → **retire or redesign** (decision next session with fresh context).

## Results (2026-08-24, rendered probe)

| World | Trigger | Clustered result | Classification |
|---|---|---|---|
| Bloom | bouquet / tree / rainbow / send-off | bouquet ≤50 taps (CI traces); rainbow at taps 102/480 (A3 wave 2) | Discoverable |
| Color Splash | board completion | always reachable (no-fail by design) | Discoverable |
| Peekaboo | target / together reunion | both at 3rd pocket opening | Discoverable |
| Together Tones | echo / motifs | motif by ~4 varied taps (C3 verification) | Discoverable |
| Story Scenes | pair story beat | tap 6 (both seeds) | Highly discoverable |
| Story Scenes | castle composition | tap 6 (seed 11) but never in 300 spread taps (seed 23) | Conditionally discoverable — revisit under F2 observation (Story Scenes depth frozen) |
| Stack & Settle | any structure (shelter) | gesture ~9, every run | Highly discoverable |
| Stack & Settle | **bridge + bird** | **never** — 160 plausible gestures, 4 strategies × 2 seeds (uniform, scattered, clustered; beam released high in cluster) | **Not discoverable — redesign required** |

**Bridge finding:** shelters form easily, bridges never do, across every plausible play pattern. The snap requires a beam release above two near-paired supports near their midpoint (`src/stack.js` ~line 404); real clustered play produces shelters/stacks instead. Since the spotted bird — the collection's recurring-resident pilot — is gated behind the bridge, this is the audit's one clear failure.

**Remaining slice (D2 continuation):** redesign the bridge snap so a beam released near two supports reliably bridges them (beam "wants" to span), preserving the causal story; then re-probe with the same harness until clustered play reaches the bird within a normal session.

**Bridge redesign — shipped 2026-08-24.** Root cause (deterministic diagnosis, pure-state simulation of clustered sequences): collision resolution collapses supports to identical x (nesting/stacking), and floor-vs-stacked height differences (0.085) exceeded the strict pair level tolerance (0.051) — so a qualifying pair almost never existed when it mattered. Fix in `src/stack.js` (beam only; the roof keeps its stricter enclosure behavior): the beam now considers all placed supports, tolerates ~2.75× the level difference, widens the separation window, and drops the release-proximity rejection — the beam seeks the nearest compatible pair by distance. Results: pure simulation bridges in 6/12 sessions (first bridge at gestures 6–20; previously 0/12); rendered clustered probe reaches the bird at gesture 4 (fixed-zone) and gesture 36 (relocated zones); shelters still form normally; 173 deterministic checks green. Sessions where every support stays piled in one spot still produce no bridge — correctly, since nothing stands apart to span; continued ordinary play spreads pieces and the next beam drop bridges.

## Exit condition

Met 2026-08-24: audit complete (classification table above), bridge redesign shipped and re-verified (bird reachable through ordinary clustered play; evidence in `EVIDENCE.md`). Story closed.
