# Execution plan — A3 six-world clutter and stability review

Disposable machinery for [`ROADMAP.md`](../ROADMAP.md) story A3. Rewrite freely; delete when the story closes.

## Current state (inspected 2026-08-23)

- Six worlds live: Bloom, Color Splash, Peekaboo Pockets, Stack & Settle, Story Scenes, Together Tones; launcher at `index.html`; one CSS file per world plus shared `styles.css`/`launcher.css`.
- Verification layers available: `npm test` (node --test, 20 suites), local dev server (`node scripts/dev-server.mjs`), seeded headless-Edge trace harness (`scripts/bloom-traces.mjs`, reference pattern), in-app/headless rendered browser inspection.
- Known child-experience suspects entering this review (from product-owner direction + persona reasoning):
  - Story Scenes still exposes palette/setting management surface to the child; scene switch is now direct but selector prominence unmeasured against Mira/Theo personas.
  - Rainbow cutscene dismisses on any touch immediately (`PRODUCT.md` documents this) — conflicts with principle 10 (protected moments). Story A4.
  - Together Tones' four-bead history and motifs add interface objects whose value for under-30-month regimes is doubtful (B2 will judge; A3 records observed behavior only).
  - Bloom's visitor messages, Color Splash prompt/status lane, Peekaboo prompt pill, Stack idea card: each competes for attention; none has been measured for whether meaning survives without text.
- Prior rendered passes covered specific flows (2026-08-16/21) but no systematic per-world clutter/density pass exists.

## Approach

For each world, at 390×844 portrait and 640×360 short landscape, exercise representative states (empty → active → dense → completion/rest pause → replay → restored after reload) with synthetic pointer traces where useful, and answer the persona review questions from `PERSONAS.md`:

1. Clutter inventory: every visible element tagged play / response / control / management; anything not supporting the central action is a finding.
2. Meaning-without-text: disable reading (mute text mentally) — does position/shape/motion/consequence carry each control's meaning?
3. Working-surface stability: does anything move the active area when it appears/disappears?
4. Density behavior: at object caps does the world stay readable, settle, combine, reuse?
5. Causal legibility: are visible relationships discoverable by experimentation rather than instruction?
6. Protected moments: does any interruption-worthy event dismiss too easily? (feeds A4)

## Work orders

| # | Order | Executor | Verification |
|---|---|---|---|
| 1 | Build/reuse rendered audit pass: script driving all six worlds through their state matrix, capturing screenshots + control rectangles + console errors | delegated bounded agent | runs clean on both viewports; output archived under temp |
| 2 | Persona review of captured evidence per world; classify findings (correct / defer-to-B2 / accept) | Celestan | findings table appended below |
| 3 | Correct clear failures in bounded slices, one commit-sized change each | delegated, then verified | `npm test` green + targeted rendered re-check |
| 4 | Record decision-changing results in `EVIDENCE.md`; close or re-scope A4 | Celestan | docs consistent |

## Findings ledger

### Wave 1 — 2026-08-23 systematic rendered audit

Method: delegated headless-browser pass (dev server + system browser), 7 pages × 2 viewports (390×844, 640×360), fresh storage per run, 25 seeded taps/drags, control inventories + rect shift detection, screenshots archived in temp `ssa3/`. **All 14 runs: zero console errors; no pre-existing element moved >4px when new elements appeared** — spatial stability holds at the rendered layer across every world.

**Corrected (verified rendered + `npm test` 156/156):**

1. Launcher allowed visible text selection under rapid messy taps → `user-select` guard added to `launcher.css` body (game pages already had it). Verified: computed `none`; programmatic selection yields empty string.
2. Story Scenes picker chips: mini-art children sized in `cqw` against the ~104px tool container while the art box is capped at 42px in short landscape — flower stem stabbed through the "Flowers" label, cloud puff escaped its chip (portrait had a smaller ~6px version of the same defect). Fix: `.mini-art` is now its own `container-type: inline-size`, so art parts resolve against the actual art box. Verified: 0px label/art overlap for all four chips at both reference viewports; after-screenshot clean.

**Deferred with reasons:**

- Launcher row 2 sits below the fold at 640×360 → navigation surface dominated by caregivers; revisit in C1 (caregiver layer) / E1 (identity), not a play-surface defect.
- Stack & Settle Fresh control is reachable by an ordinary messy tap near the header; the confirm dialog protected the build with the non-destructive default focused — correct proportional friction today; re-housing belongs to C1.
- Controls carry meaning mainly via accessible names (audit measured semantics, not visual comprehension) → judged in B2 territory mapping and future child observation, not a code defect.

**Artifacts, not regressions:** "no restore" flags for Color Splash/Stack/Story Scenes came from an element-count heuristic that cannot distinguish restored-at-initial-position; prior rendered evidence (2026-08-16/21) for those flows stands.

**Not yet exercised:** dense states, completion overlays, Bloom rainbow (needs ~50–200 tap seeded traces), other Fresh dialogs → wave 2.

### Wave 2 — 2026-08-23 (completed)

- **Fresh destructive-friction flow (rendered, Bloom):** dialog appears on Fresh; "Keep playing" preserved the garden exactly; "Start fresh" cleared it. Proportional friction confirmed working.
- **Blind-trace limits:** uniformly random taps (450) reached neither a rainbow nor a Color Splash completion — ordinary-play reachability depends on clustered bursts, matching the seeded-model strategy. Clustered-burst traces (jittered centers, ~18-tap relocations) reached real rainbows at taps 102 and 480.
- **Rainbow dismissal (A4 scope decided and implemented):** code inspection confirmed any pointerdown dismissed the overlay instantly. Fix shipped in `src/app.js`: a 1500ms opening hold absorbs touches so the moment unfolds; touches after the hold dismiss; the veil's natural `animationend` self-dismiss is unchanged; the reduced-motion skip path is untouched. Rendered verification on real rainbows: tap at ~400ms did **not** dismiss; tap after hold dismissed in 3ms; natural self-dismiss at ~3.2s. 156/156 deterministic checks pass. `PRODUCT.md` updated to describe the hold.
- **Color Splash completion overlay:** not reached by the harness within budget (cell targeting needs the board's own coordinate model); prior rendered evidence for the stable frame and completion hold stands. Recorded as the only residual gap, low risk.

**Orphaned-change incident (same day):** the working tree contained unattributed uncommitted Peekaboo changes: removal of the documented "Hide again" replay control in favor of a hidden `awaitingRefresh` tap-anywhere restart, a mojibake regression (`"Everybodyâ€™s here!"`), and a stray BOM — contradicting `PRODUCT.md` acceptance evidence and likely causing the wave-1 mojibake sighting. **Adjudicated and reverted to the committed (last-verified) state**; the sanctioned selection-guard CSS hunks were preserved and re-applied. The underlying idea (tap anywhere after completion starts the next round) is retained here as a B2-input hypothesis: it maximizes `tap → something happens` but silently discards the found state, the exact surprising-transition class 6B removed from Story Scenes; any future adoption must go through the normal story path with documented behavior. Post-revert: 156/156 deterministic checks pass; rendered smoke confirms `#new-search` present (hidden), clean apostrophe, no console errors.

## Exit condition

Met 2026-08-23: every world has a persona-reviewed verdict; clear failures corrected (2) or deferred with reasons (3); orphaned change adjudicated; A4 scope decided and implemented with rendered verification; evidence recorded in `EVIDENCE.md`. Story A3 closed; A4 closed with it. This plan is retained until the work is committed, then deleted.
