# Product roadmap

**Document roles:** this file owns Project, Epic, and Story *intent and outcomes only*. [`PRODUCT.md`](./PRODUCT.md) owns current product truth; [`GAME_ROADMAPS.md`](./GAME_ROADMAPS.md) owns per-game depth candidates; [`PERSONAS.md`](./PERSONAS.md) owns the working models applied at decision boundaries; [`EVIDENCE.md`](./EVIDENCE.md) owns what has been observed and its provenance. Disposable Story execution plans live in [`plans/`](./plans/) while their story is active.

## Project

**SuperSimpleGames** is a local-only collection of no-fail web worlds for toddlers playing with a nearby caregiver: safe under unrestricted tapping, playable offline after first load, private by design, with no accounts, analytics, or external consequences.

**Thesis (revised 2026-08-23):** each experience occupies an intentional, researched developmental territory rather than "educational in disguise" generally. The audience spans roughly three regimes (<24 / 24–30 / 30–42 months; see [`PERSONAS.md`](./PERSONAS.md)), and each world declares which regime(s) it serves while degrading gracefully downward. Sophistication lives underneath the experience: a young child receives simple cause and effect while an older child discovers relationships, patterns, memory demands, prediction, and intentional reproduction. Depth emerges from the world, never from more interface.

**Standing constraints:** no scores, streaks, timers shown to children, unlocks, rare rewards, autoplay, nagging, analytics, accounts, ads, purchases, or external actions; no reading required; complete with sound off and reduced motion; local-only persistence; every world safe under unrestricted tapping.

**Direction principles:**

- Design from the child's observable experience outward. `tap → something happens` beats `tap → management interface → decision → confirmation`. Complexity lives behind the experience.
- Every control, state, confirmation, and rule competes with play itself and must earn its attention cost. Imprecise input is treated as intent, not failure.
- A mechanic is experientially real only when ordinary messy play can encounter it and deliberately reproduce it. Implementation, rendered reachability, and child understanding are separate claims; the browser is a sense organ for verifying the second claim.
- Special moments move `surprise → curiosity → causal understanding → intentional reproduction`, are discoverable through experimentation, interrupt play to create rhythm (`ordinary play → discovery → event → pause → choice`), and are protected: an accidental tap must not dismiss them before they have unfolded — briefly and without frustration.
- No-fail does not mean no-information: gentle, non-penalizing outcome distinction is welcome; celebration targets events and artifacts, never the child's traits.
- Developmental complexity widens through caregiver-selected parameters of the same world (tolerance, density, relationship depth, quantities) — never locks, gates, or performance inference.
- A world earns its launcher place through delivered quality against the personas and the medium test ("does the touchscreen add what the physical activity cannot?"), not through implementation effort. Curate before expand; archiving a good experiment is legitimate.
- Recurring inhabitants and shared meanings build continuity ("there's the bird again"), never a collection economy.
- Caregiver concerns (duration, sound, accessibility, level, resets, wind-down) live behind a caregiver layer; stopping deserves as much design as starting.

**Planning discipline:** Project → Epic → Story carry intent only. When a story is selected, inspect current reality, then write a separate execution plan in `plans/` — that plan may be detailed and is rewritten freely as implementation reveals better paths; the story remains the committed outcome. Completed or abandoned plans are deleted; git retains history. Do not decompose future stories into tasks prematurely.

## Epics and stories

### Epic A — Reachable simplicity

*Existing depth must be reachable, clutter removed, and moments protected across all six worlds.*

| Story | Outcome | State |
|---|---|---|
| A1 Bloom merge reachability | Ordinary play reliably reaches bouquets, trees, and the rainbow; decluttering instead of feature layers | **Closed** 2026-08-21 (owner gate passed) |
| A2 Story Scenes management friction | Setting switches immediate, scenes park and restore exactly, snap feels friendly | **Closed** 2026-08-23 by Celestan adjudication under the operating agreement: rendered verification passed; residual surprise/snap-feel questions transferred to Epic F observation |
| A3 Six-world clutter and stability review | Every world reviewed as a persona encounters it (empty, active, dense, completion, replay, restored, short landscape); clear interaction failures corrected in bounded slices; findings recorded | **Closed** 2026-08-23: wave 1 systematic audit (two corrections, rest adjudicated/deferred) + wave 2 (Fresh friction verified rendered, rainbow dismissal fixed) — all recorded in `plans/` and `EVIDENCE.md`; sole residual gap (Color Splash overlay harness reach) noted, prior evidence stands |
| A4 Protected special moments | The rainbow celebration (and any equivalent moment) unfolds briefly before accidental input can dismiss it; self-dismiss and reduced-motion behavior preserved | **Closed** 2026-08-23: 1500ms opening hold shipped in `src/app.js`; rendered-verified on real rainbows (hold absorbs early taps, post-hold tap dismisses, natural end ~3.2s) |

### Epic B — Educational thesis and portfolio composition

*Each world gets an explicit researched territory; the portfolio itself becomes a reviewed hypothesis.*

| Story | Outcome | State |
|---|---|---|
| B1 Domain research synthesis | Evidence base on early numeracy, memory, classification, patterns, language, spatial reasoning, symbolic play, transfer deficit, and joint media engagement | **Closed** 2026-08-23 (delegated research recorded in `EVIDENCE.md`) |
| B2 World territory map | Each world declares its developmental territory, regime band, and what a child actually does there; personas applied at each boundary; Together Tones' under-30-month risk and Story Scenes' R3 skew explicitly resolved (reshape, reposition, or accept) | **Closed** 2026-08-23: map recorded in `GAME_ROADMAPS.md`; both risks accepted with surface/depth splits documented and design constraints recorded; gap notes captured for B3/B4 |
| B3 Portfolio composition recommendation | Keep / reshape / archive verdict per world using delivered quality, regime fit, and medium value (Stack & Settle touchscreen-vs-physical question; Together Tones span risk); consolidation precedent informs rather than dictates; owner informed of consequential verdicts, not asked to choose alternatives | **Closed** 2026-08-23: all six worlds keep their launcher place; Story Scenes depth frozen pending child observation; Stack & Settle carries an explicit archive trigger at the F1 device pass; Together Tones is first replacement candidate against a B4 concept; verdict recorded in `GAME_ROADMAPS.md` |
| B4 Gap concept briefs | If B3 confirms gaps (visible matching/classification, quantity exposure, language hooks), produce briefs into `IDEAS.md`/`GAME_ROADMAPS.md` — only forms whose agency is distinct | **Closed** 2026-08-23: "Gather families" brief recorded in `IDEAS.md` (classification by attribute, reversible revision, visible 1–3 set sizes; includes the Together Tones comparison and the no-fail open question). Epic B complete |

### Epic C — Caregiver layer and session rhythm

*Adult concerns move behind a gated adult surface; ending a session becomes designed experience.*

| Story | Outcome | State |
|---|---|---|
| C1 Caregiver-layer architecture | One gated adult surface owning sound, session length, accessibility, developmental level, content preferences, and destructive resets; child-facing UI unchanged or simplified | **Closed** 2026-08-23: gated "For grown-ups" surface shipped (1500 ms hold gate, quick-tap inert, keyboard immediate); owns sound default, session length, developmental level, world visibility, confirmed full reset; settings validated with safe fallback; offline shell updated; 165 deterministic + 12 rendered checks pass |
| C2 Wind-down and stopping ritual | Caregiver-set duration produces a gradual world-level wind-down (evening light, calmer motion, animals homeward, sounds simplify) and enough deliberate restart friction for the caregiver to regain control smoothly; never countdown pressure on the child | **Closed** 2026-08-23: shared wind-down engine wired into launcher + all six worlds; evening dim in the final two minutes, then a calm good-night veil with per-world line and a deliberate "Play again" sun; no countdown anywhere; reduced-motion instant states; offline shell bumped (v43); 169 deterministic + 8 rendered checks pass |
| C3 Developmental-level widening | Caregiver-selected parameters expose more density, tolerance change, quantities, sequencing, and relationship depth inside the same worlds | **Closed** 2026-08-24: gentle adopted where meaningful (Bloom cap 16, Color Splash 3 identities, Stack idea card hidden, Together Tones motifs omitted); default byte-equivalent to today; Peekaboo/Story Scenes level-neutral by decision; 173 deterministic + 11 rendered checks pass |

### Epic D — Shared grammar and inhabitants

*Learn-once concepts and a small recurring cast give the collection emotional continuity.*

| Story | Outcome | State |
|---|---|---|
| D1 Recurring resident cast | Bird plus at most two new inhabitants appear naturally across worlds with consistent identity and bounded local responses; recognition without collection state | Planned |
| D2 Discoverability-tiered special relationships | Existing deeper triggers audited for whether ordinary experimentation can plausibly reveal them (`surprise → intentional reproduction`); unreachable ones redesigned or retired | **In progress** — audit complete 2026-08-24: all triggers discoverable except Stack's bridge + bird (never fired in 160 plausible gestures; recorded in `plans/` + `EVIDENCE.md`); remaining slice: bridge-snap redesign + re-probe |
| D3 Event rhythm review | Portfolio-wide pass so special events interrupt loops with a restful pause and genuine choice, per the rainbow pattern | Merged into A3/A4 review criteria |

### Epic E — Ownable visual identity

| Story | Outcome | State |
|---|---|---|
| E1 Identity directions | Two or three opinionated visual alternatives (illustration system, texture, palette, typography) prototyped on representative screens via a temporary global skin; judged by the screenshot-recognition test; shipping nothing is acceptable | Planned; after A3 so corrections land first |

### Epic F — Real-world validation readiness

| Story | Outcome | State |
|---|---|---|
| F1 Device passes | Physical touch-device checks (frame geometry, drag ease) and airplane-mode exercise across launcher → games → Home | Blocked: needs available hardware |
| F2 Observation protocols | Persona-aligned session guides for caregivers; informal child/caregiver observations recorded in `EVIDENCE.md` with provenance; personas revised from what is seen | Blocked: needs available children/caregivers; protocol drafting unblocked |

## Current position and sequencing

- **Active story:** D2 remaining slice — Stack & Settle bridge-snap redesign: make a beam released near two supports reliably bridge them (the beam "wants" to span), preserving the causal story, then re-probe with the clustered harness until ordinary play reaches the bird.
- Then: D1 recurring-resident cast expansion; E1 identity exploration; F proceeds opportunistically whenever hardware or participants become available.
- Per-game Round-3 depth milestones in `GAME_ROADMAPS.md` are **paused**: placement was decided by B3 (all six keep their place; Story Scenes depth frozen pending child observation; Stack & Settle archive trigger sits at F1).

The Familiar World foundation (shared control meanings, bounded preservation, stable Color Splash frame, bridge-invited bird, "together" meaning) is implemented and rendered-verified; its open questions transfer to Epic D and Epic F.

## Spatial stability (standing invariant)

The child's working surface is a place, not a moving target. Controls reserve space or overlay; appearing controls never shift active geometry; orientation reflow is deterministic and preserves meaning; game-directed zoom appears only where a mechanic requires it; rendered geometry is checked whenever layout state changes.

## Evidence and execution

For each story:

1. Reconcile first: *what did I believe when this was planned, what changed, what new evidence exists, do I still believe it?*
2. Inspect current reality, write the story execution plan, execute through delegation where bounded, verify at the strongest available layer, record decision-changing evidence in `EVIDENCE.md`.
3. Incomplete child evidence limits claims; it does not stop bounded, reversible experiments.

Stop for the human only when personal taste, unwritten product intent, authority, inaccessible real-world information, or genuinely consequential judgment materially changes the answer — and record which criterion applied. Routine experiential gates are adjudicated by Celestan using rendered evidence and persona review.
