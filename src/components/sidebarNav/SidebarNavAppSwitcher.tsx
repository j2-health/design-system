import { useState, type ReactNode } from 'react'
import { DotsNineIcon } from '@phosphor-icons/react'
import cx from 'classnames'

import { BareButton } from '../bareButton'
import { Popover } from '../popover'
import { Tooltip } from '../tooltip'
import type { SidebarNavApp } from './SidebarNav'
import { useRailTooltip } from './railTooltip'
import styles from './SidebarNavAppSwitcher.module.css'

type Props = {
  apps: SidebarNavApp[]
  appKey: string
  collapsed: boolean
  onAppChange?: (key: string) => void
}

/**
 * Which app you're in, and the way to the others. Expanded, a constantly
 * filled bar with the current app's name and an app-grid glyph; it opens a
 * panel of app tiles, each with its name over its mark. Collapsed, the
 * app-grid glyph alone opens the same panel. With one app there's nowhere to
 * switch to: the bar is a static name, and the rail shows nothing.
 */
export const SidebarNavAppSwitcher = ({
  apps,
  appKey,
  collapsed,
  onAppChange,
}: Props) => {
  const [open, setOpen] = useState(false)
  const tooltip = useRailTooltip()
  const label = apps.find((app) => app.key === appKey)?.label ?? ''
  const single = apps.length < 2

  if (single) {
    if (collapsed) return null
    return (
      <div className={cx(styles.trigger, styles.triggerStatic)}>
        <span className={styles.triggerLabel}>{label}</span>
      </div>
    )
  }

  const panel = (children: ReactNode) => (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement={collapsed ? 'rightTop' : 'bottomLeft'}
      arrow={false}
      paddingSize="xs"
      content={
        <div className={styles.launcher} role="menu" aria-label="Apps">
          {apps.map((app) => (
            <BareButton
              key={app.key}
              role="menuitem"
              aria-current={app.key === appKey ? 'true' : undefined}
              className={cx(
                styles.launcherItem,
                app.key === appKey && styles.launcherItemCurrent
              )}
              onClick={() => {
                setOpen(false)
                if (app.key !== appKey) onAppChange?.(app.key)
              }}
            >
              <span className={styles.launcherLabel}>{app.label}</span>
              {app.icon}
            </BareButton>
          ))}
        </div>
      }
    >
      {children}
    </Popover>
  )

  if (collapsed) {
    return (
      <Tooltip {...tooltip} title={open ? undefined : label}>
        {panel(
          <BareButton
            className={cx(styles.railMark, open && styles.railMarkOpen)}
            aria-label={`${label}, switch app`}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <DotsNineIcon size={18} weight="bold" />
          </BareButton>
        )}
      </Tooltip>
    )
  }

  return panel(
    <BareButton
      className={cx(styles.trigger, open && styles.triggerOpen)}
      aria-label={`${label}, switch app`}
      aria-haspopup="menu"
      aria-expanded={open}
    >
      <span className={styles.triggerLabel}>{label}</span>
      <span className={styles.grid}>
        <DotsNineIcon size={16} weight="bold" />
      </span>
    </BareButton>
  )
}
