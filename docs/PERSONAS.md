# Working personas

These are **working models, not documentation decoration**. Every Epic and Story in [`ROADMAP.md`](./ROADMAP.md) names the personas it serves; every design decision boundary should be tested against them before implementation. They are synthesized from external developmental evidence (see [`EVIDENCE.md`](./EVIDENCE.md), 2026-08-23 research entries) and the founding observation in [`INCEPTION.md`](../INCEPTION.md). They are **not** validated by direct child observation; real sessions revise them.

## Why three children instead of one age band

The 18–36 month label hides at least three distinct developmental regimes (CDC's revised milestones sit at the 75th percentile and add 15- and 30-month checkpoints — the audience changes qualitatively every ~6 months):

| Regime | Rough ages | Defining capacities | Limits |
|---|---|---|---|
| R1 — pre-symbolic | ~18–24 mo | cause-effect detection, object permanence in place, 1-step memory, whole-hand taps | no symbolic substitution, ~1-item span, no classification |
| R2 — emerging representation | ~24–30 mo | two-word language, matching identical visible items (emerging), meaningful 2-step chains, pretend with realistic objects | face-down memory still beyond reach, arbitrary 3+ sequences exceed span |
| R3 — representational | ~30–42 mo | multi-step pretend scripts, sorting by one attribute, AB patterning emergent, subitizing 1–3 emerging, anticipates and deliberately reproduces causes | cross-classification and true cardinality still ahead |

## Child personas

### Mira — 20 months, R1

Whole-hand taps; imprecise and fast. Stays with one thing 1–3 minutes. Delighted by immediate, contingent response — *anything she touches answers her*. Cannot choose from a palette, cannot remember where something was, does not yet treat one object as another. Failure reactions are fast and physical.

**She succeeds when:** every plausible contact produces a complete visible result; density stays low; nothing she values can vanish through her own tap; targets are huge and forgiving.
**She is excluded when:** interactions require drag precision, palette comprehension, memory for hidden state, or waiting through management UI.

### Theo — 27 months, R2

Names things constantly; narrates what he sees. Can hold a meaningful 2-step intention ("feed horse, then horse runs"). Matches identical visible items; cannot yet do face-down memory. Beginning pretend with realistic objects. Repeats actions to confirm the world is dependable, then varies them.

**He succeeds when:** repetition reveals stable relationships he can anticipate; visible history lets him revisit recent order without reproducing it; matching is same-looking, visible, unhurried.
**He is excluded when:** a mechanic requires remembering hidden state, reproducing arbitrary sequences longer than two, or interpreting abstract symbols.

### Lena — 34 months, R3

Runs multi-step pretend scripts with roles and feelings. Sorts by one attribute; beginning AB patterns; notices "same" and "how many" up to about three without counting. Anticipates consequences and tries to reproduce special events on purpose. Asks "why" and expects the world to answer coherently.

**She succeeds when:** deeper layers of a world reward anticipation, reproduction, classification, and sequencing **without changing the surface interaction**; special events are causally discoverable through ordinary play.
**She is excluded when:** depth is gated behind modes, text, unlocks, or performance pressure — or so rare that experimentation can never reveal its cause.

## Caregiver personas

### Priya — hands over the phone

Gives the device during cooking, travel, or exhaustion. Needs: absolute safety under unrestricted tapping, calm sensory load, sessions that end gracefully, and confidence nothing was broken or bought. Will not read documentation; will use a simple trusted control for duration or sound if it exists. Judges the product by whether reclaiming the device is a fight.

### Sam — plays alongside

Sits with the child and narrates. Wants: invitations for joint play (things worth naming, predicting, taking turns on), honest framing of what each world exercises, and prompts that extend play off-screen. Judges the product by whether it creates conversation.

## Standing review questions

At any design boundary, answer for the primary persona before proceeding:

1. What does the child see, and is it the play — or management of play?
2. How many steps from a messy ordinary tap to a complete result? (Target: one.)
3. What must the child remember, at what span cost, for the mechanic to matter?
4. Is the causal relationship discoverable through experimentation, or effectively random?
5. Does this interaction need the physical world's resistance/gravity/3D to be valuable — and if so, does the touchscreen version still earn its place?
6. If Mira can enjoy the surface while Lena finds the depth, does anything force either to meet the other's regime?

Personas are maintained here. When direct child observation contradicts a capacity assumption above, revise the persona first, then the affected decisions.
