import { useState, type ReactNode } from 'react'

import { Tooltip } from '../tooltip'
import { useRailTooltip } from './railTooltip'
import styles from './SidebarNav.module.css'

export type SidebarNavCompactControlProps = {
  /** A 16px icon for what the control sets. */
  icon: ReactNode
  /** The current value, shown in the rail tooltip. */
  title: ReactNode
  /**
   * The real control, laid invisibly over the button so one click is a
   * click on it: e.g. a `SummarizedSelect` whose list then opens beside the
   * rail. Its popup is portaled out, so it stays visible.
   */
  overlay?: ReactNode
  /** For a control with no overlay, e.g. one that opens a modal. */
  onClick?: () => void
  'aria-label'?: string
}

/**
 * A scope control on the collapsed rail: the expanded select field in
 * miniature (white, the field's hairline border, a navy icon), so it reads
 * as a picker rather than a nav row.
 */
export const SidebarNavCompactControl = ({
  icon,
  title,
  overlay,
  onClick,
  'aria-label': ariaLabel,
}: SidebarNavCompactControlProps) => {
  const tooltip = useRailTooltip()
  // Hide the tooltip from the click until the pointer leaves, so it doesn't
  // sit over the opened list.
  const [pressed, setPressed] = useState(false)

  return (
    <Tooltip {...tooltip} title={pressed ? undefined : title}>
      <div
        className={styles.compactControl}
        onMouseDown={() => setPressed(true)}
        onMouseLeave={() => setPressed(false)}
      >
        {overlay ? (
          <>
            <span className={styles.compactIcon} aria-hidden>
              {icon}
            </span>
            <div className={styles.compactOverlay}>{overlay}</div>
          </>
        ) : (
          <button
            type="button"
            className={styles.compactButton}
            aria-label={ariaLabel}
            onClick={onClick}
          >
            {icon}
          </button>
        )}
      </div>
    </Tooltip>
  )
}
