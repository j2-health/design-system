import cx from 'classnames'
import type { MenuProps } from 'antd'

import { Dropdown } from '../dropdown'
import styles from './StatusPill.module.css'

export type StatusPillProps = {
  /** What the pill reports, e.g. "Draft saved". */
  label: React.ReactNode
  /** Emphasized detail after the label, e.g. counts. */
  detail?: React.ReactNode
  /** `'warning'` tints the pill for something that needs attention. */
  tone?: 'default' | 'warning'
  /** Makes the label a button. */
  onClick?: () => void
  /** Makes the label open this menu instead. */
  menu?: MenuProps
  /** Accessible name for the label's button or menu trigger. */
  labelAriaLabel?: string
  /**
   * A control at the end: a small `Button` or a `Switch`. It sits beside
   * the label, not inside it, so its clicks never trigger the label.
   */
  trailing?: React.ReactNode
  /** Mutes the pill and makes it inert. */
  disabled?: boolean
  className?: string
}

/**
 * A small pill reporting a state, with an optional action at the end. Sits
 * at button height (small), so it lines up with the buttons beside it.
 */
export const StatusPill = ({
  label,
  detail,
  tone = 'default',
  onClick,
  menu,
  labelAriaLabel,
  trailing,
  disabled = false,
  className,
}: StatusPillProps) => {
  const text = (
    <>
      {label}
      {detail !== undefined && detail !== null && (
        <span className="font-semibold tabular-nums">{detail}</span>
      )}
    </>
  )

  const interactive = !disabled && (onClick || menu)
  const labelButton = (
    <button
      type="button"
      onClick={menu ? undefined : onClick}
      aria-label={labelAriaLabel}
      disabled={disabled}
      className={styles.label}
    >
      {text}
    </button>
  )

  return (
    <span
      className={cx(
        styles.pill,
        tone === 'warning' && styles.warning,
        disabled && styles.disabled,
        className
      )}
    >
      {interactive ? (
        menu ? (
          <Dropdown menu={menu} trigger={['click']}>
            {labelButton}
          </Dropdown>
        ) : (
          labelButton
        )
      ) : (
        <span className={styles.static}>{text}</span>
      )}
      {trailing && (
        <span
          className="inline-flex items-center"
          // `pointer-events: none` stops the mouse but not the keyboard; inert
          // takes a disabled pill's control out of focus and the a11y tree.
          // Set as an attribute so it works on React 18 and 19 alike.
          ref={(el) => {
            el?.toggleAttribute('inert', disabled)
          }}
        >
          {trailing}
        </span>
      )}
    </span>
  )
}
