import { useSyncExternalStore } from 'react'

/**
 * Hover names on the collapsed rail, debounced as one group:
 *
 * - The first one waits a beat, so sweeping the pointer across the rail on
 *   the way to the page doesn't flash a label.
 * - Once one is showing, the rail is "warm": moving to the next icon swaps
 *   the name at once, with no delay or flicker in between.
 * - Shortly after the last one closes, the delay comes back.
 *
 * Every rail tooltip (rows, scope controls, apps, expand, avatar) spreads
 * these props, so they share one warm state.
 */

/** Seconds before the first name shows (antd's unit). */
const ENTER_DELAY = 0.4
/** Ms the rail stays warm after the last name closes. */
const COOL_DOWN = 300

let warm = false
let coolTimer: ReturnType<typeof setTimeout> | undefined
const listeners = new Set<() => void>()

const setWarm = (next: boolean) => {
  if (warm === next) return
  warm = next
  for (const listener of listeners) listener()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const onOpenChange = (open: boolean) => {
  clearTimeout(coolTimer)
  if (open) setWarm(true)
  else coolTimer = setTimeout(() => setWarm(false), COOL_DOWN)
}

export const useRailTooltip = () => {
  const isWarm = useSyncExternalStore(
    subscribe,
    () => warm,
    () => false
  )
  return {
    arrow: false,
    placement: 'right' as const,
    mouseEnterDelay: isWarm ? 0 : ENTER_DELAY,
    mouseLeaveDelay: 0,
    onOpenChange,
  }
}
