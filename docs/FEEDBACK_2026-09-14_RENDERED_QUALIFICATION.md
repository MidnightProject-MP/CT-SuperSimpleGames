# Rendered qualification feedback — 2026-09-14

This record captures the bounded correction direction produced by the latest rendered qualification of the six shipped worlds. It is decision-relevant product feedback, not a claim of child evidence. The purpose is to preserve the qualification's diagnosis before implementation proceeds.

## Portfolio disposition

The qualification does **not** justify redesigning all six worlds. The required response is narrow:

| Priority | World | Disposition | Required response |
|---|---|---|---|
| P0 | Portfolio | Visible defects | Fix mojibake, incorrect copy, and stale restored instructions. |
| P1 | Numbers | Deepen | Replace group replacement with consequential continuity. |
| P2 | Story Scenes | Expose | Make existing relationships/compositions visually self-evident. |
| P3 | Peekaboo Pockets | Deepen | Add one small consequential interaction layer after reunion. |
| Protect | Color Splash | Leave | Regression-only; no gameplay redesign. |
| Protect | Bloom | Leave | Regression-only; no gameplay redesign. |
| Protect | Memory | Leave | Regression-only; no gameplay redesign. |
| Final | Portfolio | Re-qualify | Repeat rendered qualification plus resize/device/evidence-boundary checks. |

Testing feedback on shipped worlds therefore takes bounded-corrections priority ahead of further adaptive-envelope development, consistent with the current project state.

## P0 — unequivocal correction hygiene

These changes are deterministic and should be completed before gameplay deepening.

### Story Scenes — mojibake

The royal-reunion presentation contains a garbled heart glyph (`â™¥`). Replace it with a robust local visual, preferably a CSS-drawn heart or correctly encoded local asset rather than another fragile text glyph.

### Peekaboo Pockets — mojibake

The pocket-flap presentation contains the same class of encoding defect. Fix it and add a repository-level regression check rejecting common mojibake patterns such as `â`, `Ã`, and `�` in shipped HTML/CSS/JS.

### Numbers — singular/plural copy

The current implementation can render `one cats!`. Use the singular item name for count 1 and the plural name for counts 2–3. Test every current friend kind at all three counts, including visible copy and screen-reader announcement.

### Story Scenes — restored-scene instruction

A restored non-empty scene currently receives the generic placement instruction even though the implementation knows the scene is returning with content. Visible and announced state should agree. Use a neutral return state such as `Your story is here!` for a non-empty restored scene; retain the placement invitation for a genuinely empty new scene.

## P1 — Numbers: consequential continuity

The central finding is **not** that Numbers needs more variety. It is that action N currently does not change the significance or consequence of action N+1.

Current numeral selection replaces the existing group: timers are cleared, existing friends leave, a new friend kind is selected, a new arrangement is generated, and a new group is created. The correction should preserve the simple `1 · 2 · 3` interface while changing numeral selection from **replace the group** to **transform the group**.

Required interaction grammar:

- `1 → 3`: retain the original friend and add two friends.
- `3 → 2`: retain two existing friends and let one depart.
- `2 → 2`: retain the same two identities while allowing a new arrangement.
- `greet friend → 3`: retain the greeted friend where possible.
- Keep friend kind stable within a continuous group episode; species rotation may happen when a fresh episode begins.
- `1 → 3 → 2` rapidly must settle at exactly two friends with no orphaned timers/friends.
- Reload may still begin a fresh empty scene.

Internally, friends need stable identities. A numeral transition should compute:

`current group → requested quantity → retained friends + arriving friends + departing friends + new positions`

The change should deepen continuity without adding scores, comparison questions, a larger number range, or another mode.

### Numbers acceptance gate

The rendered qualification must demonstrate that an earlier numeral choice or friend interaction visibly changes what the next numeral action does. Passing unit tests alone is insufficient.

## P2 — Story Scenes: expose existing consequence

Story Scenes already has meaningful mechanics: rider formation after nearby placements, armor changing that rider, dragon proximity affecting composition, and garden relationships with active/paused/reversed states. The diagnosis is therefore **legibility of consequence**, not missing mechanics.

Required presentation changes:

- Rider should visibly transform the existing person into a rider on the existing horse.
- Armor should visibly attach to that rider rather than primarily appearing as an abstract composition badge.
- Dragon/reunion states should visibly rearrange existing participants into the composition.
- Relationship phases should be distinguishable directly through participant pose, scale, motion, orientation, cloud/rain state, or similarly concrete visual changes.
- Captions may confirm the state but should not be the only evidence that a relationship changed.

Do not add tutorials, arrows, proximity halos, or another instruction layer unless later evidence specifically requires them.

### Story Scenes acceptance gate

With the explanatory caption hidden, an observer should still be able to tell that rider, armored rider, reunion, and the different relationship phases are meaningfully different states.

## P3 — Peekaboo Pockets: deepen the reunion

The existing search is successful and should not be redesigned. The plateau occurs after both friends are together: touching either friend currently invokes the same joint interaction sequence.

Extend the existing reunion so that **which reunited friend the child touches changes the subsequent pair consequence**. For example, touching one friend can direct the pair's movement/pose toward that friend while touching the other produces the corresponding alternate direction/state. Repeated touches may reinforce or advance a second visible phase.

Required invariants:

- Closing one friend removes the relationship and restores solo behavior.
- Reopening restores the relationship.
- At least two themes should demonstrate distinct joint consequences for touching A versus B.
- Repeated play remains reversible and no-fail.
- The existing `New search` escape remains intact.

Do not add scores, collectibles, levels, unlocks, or a post-search menu. Hold the older caregiver/child role-reversal concept unless later observation specifically supports it.

### Peekaboo acceptance gate

Across at least two themes, touching A and touching B while reunited must produce visibly different joint consequences; closing B must make A solo again; reopening B must restore the relationship.

## Protected worlds

### Color Splash

No gameplay change. Preserve the existing state-dependent consequence and use the qualification trace as regression coverage.

### Bloom

No gameplay change. Preserve persistent gardening, tending, nearby relationships, bouquet formation, and tree emergence. The unreached tree-dissolution behavior remains an evidence gap, not a reason to add another mechanic in this correction pass.

### Memory

No gameplay change. Preserve the existing witness → mismatch information → remembered choice → permanent match-reduction → replay loop. Observed pattern repetition and adaptive behavior remain evidence questions rather than defects established by this qualification.

## Evidence-boundary follow-up

The final portfolio pass should broaden verification without overstating what software tests can prove.

- Run changed worlds through normal desktop, narrow portrait, short landscape, and resize-with-state viewports.
- Replay corrected interactions with sound off and verify identical state transitions.
- Keep physical touch feel as a real-device evidence item; browser automation cannot establish it.
- Keep child discovery/comprehension as child-observation questions rather than treating rendered qualification as proof.

After the four correction PRs land, run the complete six-world trace family again rather than only spot-checking changed worlds.

## Planned PR decomposition

1. **Gameplay correction hygiene** — mojibake, Numbers singular copy, Story restored-scene messaging, and encoding regression guard.
2. **Numbers consequential continuity** — stable friend identity and transform-in-place quantity changes.
3. **Story Scenes consequence exposure** — visual continuity/composition clarity only; no new mechanics.
4. **Peekaboo reunion depth** — one small stateful/directional extension to the existing joint interaction.

Each PR should carry deterministic tests and the relevant ordinary/repeated/rapid/imprecise interaction checks, reduced-motion and sound-off checks, plus rendered browser qualification before merge. The four changes are intentionally separate because the qualification identified three different diagnoses: **Numbers needs continuity, Story Scenes needs clarity, and Peekaboo needs one additional relationship consequence.**
