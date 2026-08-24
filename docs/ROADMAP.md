# Product roadmap

**Document roles:** this file owns Project, Epic, and Story *intent and outcomes only*. [`PRODUCT.md`](./PRODUCT.md) owns current product truth; [`GAME_ROADMAPS.md`](./GAME_ROADMAPS.md) owns per-game depth candidates; [`PERSONAS.md`](./PERSONAS.md) owns the working models applied at decision boundaries; [`EVIDENCE.md`](./EVIDENCE.md) owns what has been observed and its provenance. Disposable Story execution plans live in [`plans/`](./plans/) while their story is active.

## Project

**SuperSimpleGames** is a local-only collection of no-fail web worlds for toddlers playing with a nearby caregiver: safe under unrestricted tapping, playable offline after first load, private by design, with no accounts, analytics, or external consequences.

**Thesis (revised 2026-08-23; reprioritized 2026-08-24):** each experience occupies an intentional, researched developmental territory rather than "educational in disguise" generally. The audience spans roughly three regimes (<24 / 24–30 / 30–42 months; see [`PERSONAS.md`](./PERSONAS.md)), and each world declares which regime(s) it serves while degrading gracefully downward. Sophistication lives underneath the experience: a young child receives simple cause and effect while an older child discovers relationships, patterns, memory demands, prediction, and intentional reproduction. Depth emerges from the world, never from more interface.

**Priority hierarchy within the hard constraints (owner-set 2026-08-24):** child engagement and delight → immediate responsiveness → discoverability and agency → replay/variation → interaction polish → appropriate developmental value → robustness → abstraction. Privacy, safety, offline operation, accessibility, and absence of external consequences are hard constraints outside this ordering, not low-priority entries in it. When choosing between another mechanic and making an existing promising interaction feel significantly better, default to the latter unless evidence supports expansion.

**Interaction standard:** a mechanic is finished only when its presence improves the child's experience — not merely when it exists, is reachable, is deterministic, passes tests, or satisfies written criteria. Trace the chain: notice → act → response → consequence → invitation to continue. Real child observation now exists for part of the product and outranks prior product assumptions where they conflict; it is recorded in [`EVIDENCE.md`](./EVIDENCE.md) with its informal, single-source limits.

**Standing constraints:** no scores, streaks, timers shown to children, unlocks, rare rewards, autoplay, nagging, analytics, accounts, ads, purchases, or external actions; no reading required; complete with sound off and reduced motion; local-only persistence; every world safe under unrestricted tapping; child play surfaces reject accidental scale/pan gestures (toddler pinch/pan must not interrupt play; adult/caregiver surfaces remain fully zoomable; OS-level accessibility zoom is the preserved path — this supersedes the earlier in-page browser-zoom guarantee after observed interference).

**Direction principles:**

- Design from the child's observable experience outward. `tap → something happens` beats `tap → management interface → decision → confirmation`. Complexity lives behind the experience.
- Every control, state, confirmation, and rule competes with play itself and must earn its attention cost. Imprecise input is treated as intent, not failure.
- Reset, destructive, and application-management controls (Fresh-style resets, scene pickers, settings) live outside the child's immediate play grammar unless there is a strong child-facing reason for their presence; the caregiver layer is their home.
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
| B3 Portfolio composition recommendation | Keep / reshape / archive verdict per world using delivered quality, regime fit, and medium value (Stack & Settle touchscreen-vs-physical question; Together Tones span risk); consolidation precedent informs rather than dictates; owner informed of consequential verdicts, not asked to choose alternatives | **Closed 2026-08-23; superseded by owner direction 2026-08-24** (first real child evidence): Stack & Settle and Together Tones are replaced by Memory and Numbers; see Epic J. The keep-all-six verdict and the Stack archive-trigger-at-F1 condition are retired. |
| B4 Gap concept briefs | If B3 confirms gaps (visible matching/classification, quantity exposure, language hooks), produce briefs into `IDEAS.md`/`GAME_ROADMAPS.md` — only forms whose agency is distinct | **Closed** 2026-08-23: "Gather families" brief recorded in `IDEAS.md` (classification by attribute, reversible revision, visible 1–3 set sizes; includes the Together Tones comparison and the no-fail open question). Epic B complete |

### Epic C — Caregiver layer and session rhythm

*Adult concerns move behind a gated adult surface; ending a session becomes designed experience.*

| Story | Outcome | State |
|---|---|---|
| C1 Caregiver-layer architecture | One gated adult surface owning sound, session length, accessibility, developmental level, content preferences, and destructive resets; child-facing UI unchanged or simplified | **Closed** 2026-08-23: gated "For grown-ups" surface shipped (1500 ms hold gate, quick-tap inert, keyboard immediate); owns sound default, session length, developmental level, world visibility, confirmed full reset; settings validated with safe fallback; offline shell updated; 165 deterministic + 12 rendered checks pass |
| C2 Wind-down and stopping ritual | Caregiver-set duration produces a gradual world-level wind-down (evening light, calmer motion, animals homeward, sounds simplify) and enough deliberate restart friction for the caregiver to regain control smoothly; never countdown pressure on the child | **Closed** 2026-08-23: shared wind-down engine wired into launcher + all six worlds; evening dim in the final two minutes, then a calm good-night veil with per-world line and a deliberate "Play again" sun; no countdown anywhere; reduced-motion instant states; offline shell bumped (v43); 169 deterministic + 8 rendered checks pass |
| C3 Developmental-level widening | Caregiver-selected parameters expose more density, tolerance change, quantities, sequencing, and relationship depth inside the same worlds | **Closed** 2026-08-24; **approach superseded by Epic L (2026-08-24)**: fixed caregiver-selected levels are being replaced by per-game adaptive progression — see `EVIDENCE.md` round-2 direction |

### Epic D — Shared grammar and inhabitants

*Learn-once concepts and a small recurring cast give the collection emotional continuity.*

| Story | Outcome | State |
|---|---|---|
| D1 Recurring resident cast | Bird plus at most two new inhabitants appear naturally across worlds with consistent identity and bounded local responses; recognition without collection state | **Closed** 2026-08-24: butterfly (existing character) now lands on completed Color Splash boards; new snail visits Story Scenes' garden at 3+ objects; both derived deterministically, 3-touch budget, never touch work; shared `src/residents.js` primitive; 178 deterministic + rendered checks pass |
| D2 Discoverability-tiered special relationships | Existing deeper triggers audited for whether ordinary experimentation can plausibly reveal them (`surprise → intentional reproduction`); unreachable ones redesigned or retired | **Closed** 2026-08-24: audit found every trigger discoverable except Stack's bridge + bird; beam now seeks the nearest compatible support pair (deterministic diagnosis → fix → re-probe: bird reachable at gestures 4–36 in clustered play, bridges in 6/12 simulated sessions vs 0 before); recorded in `plans/` + `EVIDENCE.md` |
| D3 Event rhythm review | Portfolio-wide pass so special events interrupt loops with a restful pause and genuine choice, per the rainbow pattern | Merged into A3/A4 review criteria |

### Epic G — Retained-world interaction polish

*The next phase is product quality, not breadth: make the worlds children already touch feel alive, protected, and free of application machinery. No new mechanics.*

| Story | Outcome | State |
|---|---|---|
| G1 Play-surface gesture protection | One consistent policy: child-facing surfaces (launcher + every retained game) reject accidental scale/pan (`touch-action` policy plus a Safari `gesturestart` guard); caregiver page stays fully zoomable; invariant tested deterministically and verified rendered | **Closed** 2026-08-24: `src/play-gesture.js` guard on launcher + all games; body-level `touch-action: none` policy per world CSS; deterministic contracts (`test/play-gesture.test.js`) + rendered computed-style checks across all 8 pages (caregiver stays `auto`) |
| G2 Resident life, world-local | Color Splash's butterfly inhabits the finished board (lands on squares, relocates spatially per touch, varies response); Story Scenes' snail travels the garden edge near the child's objects; each implemented inside its own world first — shared abstraction only if proven common behavior emerges (Bloom visitors remain the quality reference, not an architecture mandate) | **Closed** 2026-08-24: butterfly derives landing spots from real board squares, alternates flap/glide per touch, flies home after three; snail derives stops from lowest-placed objects, travels with direction-facing art; `residents.js` deliberately untouched; rendered probes confirm movement, facing, and send-off |
| G3 Protected completion moments | A completed Color Splash board holds briefly before any input can start the next board (the rainbow pattern); celebration and resident cannot be destroyed by the next reflexive tap | **Closed** 2026-08-24: 1500 ms hold verified rendered — first reflexive tap absorbed, post-hold tap starts new board |
| G4 Child-facing control simplification | Fresh removed from Bloom and Story Scenes' play grammar — destructive resets move to the caregiver surface ("Clear saved creations"); Story Scenes setting switching becomes three direct pictorial chips in the dock (tap → immediate switch, parking preserved), removing the picker overlay and its cancel step | **Closed** 2026-08-24: chips switch directly with parking intact (rendered-verified); fresh controls/dialog retired from active worlds; caregiver creations-clearing shipped |
| G5 Hygiene slice | Peekaboo clue-arrow mojibake repaired; duplicate live regions deduplicated (visible message loses `aria-live`, sr-only announcement remains the single AT channel); dead Color Splash control CSS removed; tone envelopes softened at note endings; small Peekaboo friend-response variety | **Closed** 2026-08-24: arrows restored to real UTF-8 glyphs (corruption source was owner commit `976b1ae`, now corrected); single live region per world; `.undo-move`/`.new-board` styles removed; release tail softened (10.55s stop contract updated); greetings alternate `friend-hello`/`friend-hello-again` motions and pitches, rendered-verified `hello → again`. Color Splash cells already carry per-square aria-labels from the stable-frame work — no further change needed |

### Epic H — Memory (portfolio replacement)

*Territory (owner-set): matching + spatial recall — recognizing relationships and remembering where things are. Explicitly distinct from Peekaboo (search/reveal). A toddler toy, not school concentration: tiny boards, oversized tokens, witnessed information, expressive reveals, enjoyable mismatches, caregiver-level widening. Experiment before architecture; hardening waits on experiential evidence.*

| Story | Outcome | State |
|---|---|---|
| H1 Concept brief | Working definition in `GAME_ROADMAPS.md`: smallest true memory/matching loop (witnessed face-up intro → hide → find pairs), alternatives noted, success question stated | **Closed** 2026-08-24 |
| H2 Playable experiment | Minimal "Memory Pairs" build: 4 oversized cards (2 pairs), witnessed intro, flip-to-match, joyful mismatch reveals, together-celebration, in-game replay; seeded deterministic round core with tests from day one; deliberately thin presentation; launcher slot swapped in as experimental | **Closed — gate PASSED** (owner hands-on, round-1 device feedback): "great, super simple, very good visual and interactive gameplay" |
| H3 Harden + widen | Polish from observation; caregiver-level widening; persistence decisions; full shell/offline treatment | **Unblocked but restrained:** core loop validated; shell treatment already shipped. No widening or extra polish until child observation asks for it — protect what works |

### Epic I — Numbers (portfolio replacement)

*Territory: quantity as something the child manipulates and perceives — never a quiz. The number means something that happens in the world. Tiny quantities (≤5), concrete representation, immediate consequence, no wrong-answer loop, no reading.*

| Story | Outcome | State |
|---|---|---|
| I1 Concept brief | Working definition in `GAME_ROADMAPS.md`: add-one/remove-one quantity play with visible perceptual consequence; request-free surface must stand alone | **Closed** 2026-08-24 |
| I2 Playable experiment | Minimal "Number Nibbles" build: one friendly creature, tap-to-feed add/remove loop, quantity shown as words and a hidden pile | **Closed — gate returned REVISE** (owner hands-on, round-1 device feedback): word-count text misses the audience — big numerals must be primary; the passive pile lacks visual interaction. v1 archived to git history. |
| I2b Numbers redesign experiment | Rebuild around owner direction: **big real numerals are the interface** — oversized tappable number bubbles; tapping a bubble makes that many friends burst into an open scene with staggered arrivals and per-item tones; every arrived friend is individually touchable; free play, no quiz, no request. Same thin-experiment discipline; gate re-arms afterward | **Closed — gate PASSED** (owner hands-on, round-2 feedback): "really like the new Numbers experience… the redesigned interaction works very well. Preserve its core direction." |
| I3 Harden + widen | Polish from observation | **Restrained:** core validated; any range widening or presentation deepening now belongs to Epic L5's adaptive envelope rather than a fixed-level step |

### Epic J — Portfolio archive

| Story | Outcome | State |
|---|---|---|
| J1 Remove Stack & Settle and Together Tones from the active portfolio | Launcher cards removed immediately (owner decision 2026-08-24: smaller launcher accepted); service-worker shell trimmed; caregiver world-visibility list reduced with safe fallback for stored settings referencing removed worlds; sources left inert in-tree pending later deletion (git retains history); roadmap sections marked retired; salvage notes recorded in `IDEAS.md` | **Closed** 2026-08-24: launcher carries Bloom, Color Splash, Peekaboo, Story Scenes, Memory, Numbers; shell and caregiver list trimmed with sanitization fallback proven by tests; retirement guards added to `test/app-shell.test.js` |

### Epic E — Ownable visual identity *(deferred)*

| Story | Outcome | State |
|---|---|---|
| E1 Identity directions | Two or three opinionated visual alternatives prototyped via temporary global skin; judged by screenshot-recognition test; shipping nothing acceptable | **Deferred by owner (2026-08-24)** until after Epic G interaction polish: retained worlds must feel excellent before identity investment. Ready execution plan remains in `docs/plans/`; the owner taste call stays valid whenever resumed |

### Epic K — Real-world validation

| Story | Outcome | State |
|---|---|---|
| K1 Record relayed child observations | Owner-relayed informal child evidence recorded with provenance and limits; observation/inference distinction preserved | **Closed** 2026-08-24 (see `EVIDENCE.md`) |
| K2 Device passes | Physical touch-device checks (gesture protection feel, drag ease where relevant, frame geometry) and airplane-mode exercise across launcher → games → Home | Blocked: needs available hardware |
| K3 Observation sessions | Persona-aligned session guides for caregivers, extended with Memory-recall and Numbers-invite hypotheses; observations recorded with provenance; personas revised from what is seen | Blocked: needs available children/caregivers; protocol drafting unblocked |

### Epic L — Adaptive progression

*Owner direction (2026-08-24): replace fixed caregiver-selected levels with per-game adaptive progression — continuous, hidden, game-specific, slow, reversible, never experienced as levels, scores, promotion, or failure. Each world defines its minimum and maximum experience plus the interaction signals that actually matter to it; the game adapts within that envelope from recent play. Companion rule: measure the interaction the game cares about — do not invent generic metrics because they are countable. No shared adaptive engine until game-specific implementations prove common shape.*

| Story | Outcome | State |
|---|---|---|
| L1 Adaptive envelopes & philosophy | Minimum experience, maximum experience, meaningful signals, non-signals, adaptable dimensions, and adaptation tempo documented for all six worlds (`GAME_ROADMAPS.md` § Adaptive progression envelopes); worlds without honest signals documented as deliberately **stable** rather than forced into the system | **Closed** 2026-08-24 |
| L2 Memory adaptive prototype | First implementation: versioned local fluency record (`supersimplegames.memory.adaptive`, gameplay state only); envelope = pairs 2–3 · preview 1.9→1.4s · mismatch window 1.05→0.85s · arrangement variety; exponential average with hysteresis tiers; ~25–30% of rounds serve one step simpler than estimate (comfort variation); at most one dimension moves per completed round; grown-ups gains "Reset playful growth"; deterministic tests + rendered probes | **Closed** 2026-08-24: 10 dedicated adaptive tests (inertia, notch order, dead zone, newest-first simplification, comfort bounds, persistence/reset) + rendered probe (fresh=min, persisted-max deals six cards in three columns, childlike completion folds evidence, reset clears). **Gate re-armed:** hands-on decides whether the adaptation feels like meeting the child where they are |
| L3 Color Splash adaptive board mix | Second application: identity count (3–4) and family-tier mix adapt within envelope from completed-board evidence; extract a tiny shared adaptive-state helper **only if** Memory's record shape proves identical | Blocked on L2 gate passing |
| L4 Fixed-level retirement | Remove the Default/Gentle/Rich control, `level` settings field, and every consumer (Bloom unified 24-object garden; Color Splash interim fixed 4 identities; Numbers visible row stays 1·2·3); delete retired Stack/Tones sources and tests; sanitizer drops stored level harmlessly; grown-ups page keeps creations/reset controls and gains the growth reset | Planned — next after L2 |
| L5 Numbers deepening-within-quantity | Observation-gated exploration: richer presentation inside chosen counts (friend-kind rotation, arrangement styles) before any range change; widening signal = sustained voluntary selection of the current maximum across ≥2 sessions — the child asking for more is the signal; numerals are never hidden behind fluency | Blocked on observation |

**Deliberately stable (documented, not built):** Bloom (organic depth already emerges from ordinary play — merges, trees, rainbow), Peekaboo Pockets (opening every pocket *is* success; search-efficiency would be a manufactured metric), Story Scenes (depth frozen pending K3 observation; dimensions exist but no signals adopted). If a world has no honest performance signal, it does not participate.

## Current position and sequencing

- **Round-2 direction landed (2026-08-24):** Numbers v2 **passed its gate** on owner hands-on ("really like the new Numbers experience… preserve its core direction") — I3 hardening stays restrained. Fixed caregiver-selected levels are **superseded by Epic L**: per-game adaptive progression, envelopes documented (L1 closed), Memory prototype next (L2), then level retirement (L4), then Color Splash application (L3), Numbers deepening (L5, observation-gated).
- **Implementation of adaptation is staged:** this roadmap revision ships first; L2 begins only after owner acceptance of the envelope design.
- E1 identity directions remains deferred. K proceeds opportunistically whenever hardware or participants become available.

The launcher's six slots hold exactly the intended portfolio: Bloom, Color Splash, Peekaboo Pockets, Story Scenes, Memory (validated), Numbers (validated v2).

The Familiar World foundation (shared control meanings, bounded preservation, stable Color Splash frame, "together" meaning) remains implemented and rendered-verified; Bloom's bridge-invited-bird cameo left the portfolio with Stack & Settle, while the recurring cast lives on through Bloom's visitors plus the Color Splash butterfly and Story Scenes snail.

## Spatial stability (standing invariant)

The child's working surface is a place, not a moving target. Controls reserve space or overlay; appearing controls never shift active geometry; orientation reflow is deterministic and preserves meaning; game-directed zoom appears only where a mechanic requires it; rendered geometry is checked whenever layout state changes.

## Evidence and execution

For each story:

1. Reconcile first: *what did I believe when this was planned, what changed, what new evidence exists, do I still believe it?*
2. Inspect current reality, write the story execution plan, execute through delegation where bounded, verify at the strongest available layer, record decision-changing evidence in `EVIDENCE.md`.
3. Incomplete child evidence limits claims; it does not stop bounded, reversible experiments.

Stop for the human only when personal taste, unwritten product intent, authority, inaccessible real-world information, or genuinely consequential judgment materially changes the answer — and record which criterion applied. Routine experiential gates are adjudicated by Celestan using rendered evidence and persona review.
