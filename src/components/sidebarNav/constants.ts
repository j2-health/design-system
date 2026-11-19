/**
 * The sidebar's widths, in px. Expanded, it drags between `min` and `max`;
 * dragged narrower than `snapCollapseAt` it collapses to the `collapsed`
 * rail, and dragged back out past it, it expands again.
 */
export const SIDEBAR_NAV_WIDTH = {
  default: 240,
  min: 200,
  max: 360,
  collapsed: 56,
  snapCollapseAt: 140,
} as const

/** Arrow keys on the resize handle move the edge this far. */
export const SIDEBAR_NAV_RESIZE_STEP = 16

export const clampSidebarNavWidth = (width: number) =>
  Math.min(SIDEBAR_NAV_WIDTH.max, Math.max(SIDEBAR_NAV_WIDTH.min, width))
