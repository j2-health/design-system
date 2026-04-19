# Card — Change log

## Soften hover shadow + keep border on hover

**What:** Overrode Ant Design's default `hoverable` styling on `.j2-card`:

- Box-shadow lowered to a single-layer `0 2px 6px 0 rgba(0, 0, 0, 0.04)`.
- Border color pinned to `var(--j2-color-border)` on hover (Ant's default
  drops it to `transparent`).

**Why:** Ant's stock hover lift is a three-layer shadow tuned for a more
material UI. Next to j2's flatter visual language (thin borders, subtle
fills) it read as too severe — especially when multiple hoverable cards sit
near each other, or when a card is already distinguished by a selected
border. The lighter shadow keeps the hover cue legible without competing
with borders or pulling focus. Dropping the border on hover additionally
made the card appear to collapse/shift, which was the other half of the
visual noise people were reacting to.

**Breaking:** No. The shadow still appears on hover for every `hoverable`
Card — just at lower intensity, and the border now holds steady. No API
change.

**Handoff notes for PR review:**

- Applied at `.j2-card.ant-card-hoverable:hover` so it covers every Card
  rendered through the design-system wrapper (Ant's raw `.ant-card` is not
  affected, but nothing should be reaching for that directly).
- If we later need a stronger lift for a specific surface (e.g. a
  standalone marketing card), consider a `shadow="lg"` prop rather than
  rolling the global value back up.
