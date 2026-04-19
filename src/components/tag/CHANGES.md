# Tag — Change log

## Add `size` prop with `small` variant

**What:** Added `size?: 'default' | 'small'` prop to `Tag`. Default keeps
current Ant Design styling untouched. `small` applies a condensed variant via
`.j2-tag-small` (defined in `Tag.css`): 10px font, 16px line height, 6px
horizontal padding, 0 vertical padding, 4px radius.

**Why:** Consuming surfaces sometimes need a subtle inline label ("Optional",
"Beta", etc.) sitting next to body-weight text. The default Tag's padding and
12px font pull too much attention relative to the label it's qualifying, so
product teams have been reaching for raw `text-[10px]` spans instead of the
component. The `small` size fills that gap and gets those usages back on the
system.

**First consumer:** `frontend/src/reports/PacketBuilder/ReportPreviewPanel.tsx`
— "OPTIONAL" marker next to page names in the packet builder.

**Breaking:** No. `size` defaults to `default` → existing call sites are
unaffected.

**Handoff notes for PR review:**

- Storybook: an additional story demonstrating the `small` variant would be
  worth adding if this ships beyond the packet builder.
- If more sizes come up later (`large`, `compact`), promote the class naming to
  a size-scoped set (`j2-tag-sm`, `j2-tag-md`, etc.) rather than layering more
  one-offs.
- The status + size matrix is independent — all five `status` values (`default`,
  `error`, `success`, `warning`, `processing`) respect the `small` variant's
  geometry.
