import * as React from 'react'
import type { ItemType } from 'antd/es/menu/interface'
import cx from 'classnames'

import SmallLogo from '../../svgs/j2-logo-menu-collapse.svg'
import LogoWithText from '../../svgs/j2-logo-menu.svg'
import { BareButton } from '../bareButton'
import { Button } from '../button'
import { Menu } from '../menu'
import { Tooltip } from '../tooltip'
import {
  SidebarNavAccount,
  type SidebarNavAccountInfo,
} from './SidebarNavAccount'
import { SidebarNavAppSwitcher } from './SidebarNavAppSwitcher'
import { SidebarToggleIcon } from './SidebarToggleIcon'
import {
  SIDEBAR_NAV_RESIZE_STEP,
  SIDEBAR_NAV_WIDTH,
  clampSidebarNavWidth,
} from './constants'
import { useRailTooltip } from './railTooltip'
import styles from './SidebarNav.module.css'

/** A page link. */
export type SidebarNavItem = {
  key: string
  /** A string, or a link element (e.g. a router `Link`) for real hrefs. */
  label: React.ReactNode
  /** A 16px icon. */
  icon: React.ReactNode
}

/** A run of items. With a `label` it renders as a sub-group heading. */
export type SidebarNavGroup = {
  label?: string
  items: SidebarNavItem[]
}

/** A plain section: an optional heading over its groups. */
export type SidebarNavPlainSection = {
  kind?: 'section'
  key: string
  label?: string
  groups: SidebarNavGroup[]
}

/**
 * A tinted block whose pages all read the same context, with the controls
 * that set it (e.g. a select) at its top.
 */
export type SidebarNavScopeSection = {
  kind: 'scope'
  key: string
  /**
   * The block's controls. Expanded, render the full-width control (a select
   * field); collapsed, render a `SidebarNavCompactControl` for each.
   */
  controls: (state: { collapsed: boolean }) => React.ReactNode
  groups: SidebarNavGroup[]
}

export type SidebarNavSection = SidebarNavPlainSection | SidebarNavScopeSection

/** An app in the switcher. */
export type SidebarNavApp = {
  key: string
  label: string
  /** A 20px mark, shown on the app's tile in the launcher. */
  icon?: React.ReactNode
}

export type SidebarNavProps = {
  /** Every app the user can open. With one, the switcher is a static name. */
  apps: SidebarNavApp[]
  /** The current app. */
  appKey: string
  /** Picking another app in the launcher. */
  onAppChange?: (key: string) => void
  sections: SidebarNavSection[]
  /** Rows above the account block (Help, Settings, Admin). */
  footerItems?: SidebarNavItem[]
  account?: SidebarNavAccountInfo
  /** The current page's item key, in any section or the footer. */
  selectedKey?: string
  /** A row click, with the row's key. */
  onNavigate?: (key: string) => void
  /** The logo's link. */
  logoHref?: string

  /** Collapsed to the icon rail. Controlled; pair with `onCollapsedChange`. */
  collapsed?: boolean
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /**
   * The expanded width in px, clamped to `SIDEBAR_NAV_WIDTH.min`–`max`.
   * Controlled; pair with `onWidthChange`.
   */
  width?: number
  defaultWidth?: number
  onWidthChange?: (width: number) => void
  /** Whether the right edge drags to resize. */
  resizable?: boolean

  className?: string
  'aria-label'?: string
}

/** A prop the caller may control; held here when it doesn't. */
const useControllable = <T,>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void
) => {
  const [own, setOwn] = React.useState(defaultValue)
  const controlled = value !== undefined
  const current = controlled ? value : own
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setOwn(next)
      onChange?.(next)
    },
    [controlled, onChange]
  )
  return [current, set] as const
}

/**
 * The J2 app sidebar: the J2 Health logo and the app switcher, then the
 * app's sections (a scope block, then plain sections), then footer rows and
 * the account. Everything below the switcher is data.
 *
 * One icon column, centered at x = 28 (the collapsed rail's center), so
 * nothing moves sideways on collapse: row icons start at x = 20, the logo's
 * 20px mark at 18, section labels and the app name at 20.
 *
 * Expanded it is 240px, drag-resizable from 200 to 360; dragged under 140 it
 * snaps to the 56px rail. Collapsed, rows are icons with their names in
 * arrowless tooltips, and headings become hairline dividers.
 *
 * The app owns persistence: pass `collapsed` / `width` with their change
 * handlers to store them (e.g. in localStorage), or leave them uncontrolled.
 */
export const SidebarNav = ({
  apps,
  appKey,
  onAppChange,
  sections,
  footerItems = [],
  account,
  selectedKey,
  onNavigate,
  logoHref = '/',
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  width: widthProp,
  defaultWidth = SIDEBAR_NAV_WIDTH.default,
  onWidthChange,
  resizable = true,
  className,
  'aria-label': ariaLabel,
}: SidebarNavProps) => {
  const [collapsed, setCollapsed] = useControllable(
    collapsedProp,
    defaultCollapsed,
    onCollapsedChange
  )
  const [rawWidth, setRawWidth] = useControllable(
    widthProp,
    defaultWidth,
    onWidthChange
  )
  const width = clampSidebarNavWidth(rawWidth)
  const setWidth = (next: number) => setRawWidth(clampSidebarNavWidth(next))

  const railTooltip = useRailTooltip()
  const currentApp = apps.find((app) => app.key === appKey)
  const menuProps: MenuProps = {
    selectedKeys: selectedKey ? [selectedKey] : [],
    onClick: ({ key }) => onNavigate?.(key),
    collapsed,
  }

  return (
    <nav
      className={cx(styles.sidebar, collapsed && styles.collapsed, className)}
      style={collapsed ? undefined : { width }}
      aria-label={
        ariaLabel ??
        (currentApp ? `${currentApp.label} navigation` : 'Navigation')
      }
    >
      {resizable && (
        <ResizeHandle
          collapsed={collapsed}
          width={width}
          defaultWidth={clampSidebarNavWidth(defaultWidth)}
          setCollapsed={setCollapsed}
          setWidth={setWidth}
        />
      )}
      <div className={styles.header}>
        <div className={styles.brandRow}>
          {collapsed ? (
            <Tooltip {...railTooltip} title="Expand menu">
              <BareButton
                className={styles.brandToggle}
                aria-label="Expand menu"
                onClick={() => setCollapsed(false)}
              >
                <span className={styles.brandMark}>
                  <SmallLogo width={20} height={20} aria-hidden />
                </span>
                <span className={styles.brandExpand}>
                  <SidebarToggleIcon />
                </span>
              </BareButton>
            </Tooltip>
          ) : (
            <>
              <a href={logoHref} className={styles.logo} aria-label="J2 Health">
                {/* 20px tall, so its mark is the collapsed mark's 20px. */}
                <LogoWithText width={95} height={20} aria-hidden />
              </a>
              <Tooltip title="Collapse menu" placement="bottom" arrow={false}>
                <Button
                  type="text"
                  size="small"
                  className={styles.collapseToggle}
                  icon={<SidebarToggleIcon />}
                  aria-label="Collapse menu"
                  onClick={() => setCollapsed(true)}
                />
              </Tooltip>
            </>
          )}
        </div>
        <SidebarNavAppSwitcher
          apps={apps}
          appKey={appKey}
          collapsed={collapsed}
          onAppChange={onAppChange}
        />
      </div>

      {/* Keyed by app, so switching apps remounts the body and plays its
          short fade-in instead of a hard cut. */}
      <div key={appKey} className={styles.body}>
        {sections.map((section) =>
          section.kind === 'scope' ? (
            <div
              key={section.key}
              className={styles.scopeBlock}
              data-testid={`sidebar-nav-scope-${section.key}`}
            >
              <div className={styles.scopeControls}>
                {section.controls({ collapsed })}
              </div>
              {/* 8 margin + 1 border + 4 + 7: the icon on x = 20, as
                  outside. */}
              <SectionMenu
                items={toMenuItems(section.key, section.groups)}
                indent={7}
                {...menuProps}
              />
            </div>
          ) : (
            <SectionMenu
              key={section.key}
              items={
                section.label
                  ? [
                      {
                        type: 'group',
                        key: section.key,
                        label: section.label,
                        children: toMenuItems(section.key, section.groups),
                      },
                    ]
                  : toMenuItems(section.key, section.groups)
              }
              {...menuProps}
            />
          )
        )}
      </div>

      <div className={styles.footer}>
        {footerItems.length > 0 && (
          <SectionMenu items={footerItems.map(toMenuItem)} {...menuProps} />
        )}
        {account && (
          <SidebarNavAccount account={account} collapsed={collapsed} />
        )}
      </div>
    </nav>
  )
}

type MenuProps = {
  selectedKeys: string[]
  onClick: (info: { key: string }) => void
  /** The icons-only rail (the DS Menu's `compact`). */
  collapsed: boolean
}

/**
 * The DS `Menu` in the nav's tighter shape. `inlineIndent` is antd's
 * per-level left padding; the rest of the sizing and the hover/selected
 * treatment are CSS-variable overrides in the module. Collapsed, antd puts
 * each row's name in a tooltip, kept arrowless like every J2 tooltip.
 */
const SectionMenu = ({
  collapsed,
  // antd sets each row's left padding inline from this. 8 margin + 12: the
  // icon on the nav's icon column, x = 20.
  indent = 12,
  ...props
}: MenuProps & { items: ItemType[]; indent?: number }) => {
  const tooltip = useRailTooltip()
  return (
    <Menu
      mode="inline"
      inlineIndent={indent}
      compact={collapsed}
      tooltip={tooltip}
      className={styles.menu}
      {...props}
    />
  )
}

const toMenuItem = (item: SidebarNavItem): ItemType => ({
  key: item.key,
  label: item.label,
  icon: item.icon,
})

/** Unlabeled groups flatten into their parent; labeled ones become sub-groups. */
const toMenuItems = (
  sectionKey: string,
  groups: SidebarNavGroup[]
): ItemType[] =>
  groups.flatMap((group, i): ItemType[] =>
    group.label
      ? [
          {
            type: 'group',
            key: `${sectionKey}:group:${i}`,
            label: group.label,
            children: group.items.map(toMenuItem),
          },
        ]
      : group.items.map(toMenuItem)
  )

/**
 * The expanded sidebar's right edge: drag to resize. Dragging past the
 * snap point collapses it, as in Linear and VS Code; dragging the rail's
 * edge back out expands it. Double-click resets the width; arrow keys nudge
 * it.
 */
const ResizeHandle = ({
  collapsed,
  width,
  defaultWidth,
  setCollapsed,
  setWidth,
}: {
  collapsed: boolean
  width: number
  defaultWidth: number
  setCollapsed: (collapsed: boolean) => void
  setWidth: (width: number) => void
}) => {
  const [dragging, setDragging] = React.useState(false)

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    const handle = e.currentTarget
    handle.setPointerCapture?.(e.pointerId)
    const navLeft = handle.parentElement!.getBoundingClientRect().left
    setDragging(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    // Report each change once, not on every pointer move.
    let lastCollapsed = collapsed
    let lastWidth = width
    const onMove = (ev: PointerEvent) => {
      const raw = ev.clientX - navLeft
      const nextCollapsed = raw < SIDEBAR_NAV_WIDTH.snapCollapseAt
      if (nextCollapsed !== lastCollapsed) {
        lastCollapsed = nextCollapsed
        setCollapsed(nextCollapsed)
      }
      if (!nextCollapsed) {
        const nextWidth = clampSidebarNavWidth(raw)
        if (nextWidth !== lastWidth) {
          lastWidth = nextWidth
          setWidth(nextWidth)
        }
      }
    }
    const onUp = () => {
      setDragging(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      handle.removeEventListener('pointermove', onMove)
      handle.removeEventListener('pointerup', onUp)
      handle.removeEventListener('pointercancel', onUp)
    }
    handle.addEventListener('pointermove', onMove)
    handle.addEventListener('pointerup', onUp)
    handle.addEventListener('pointercancel', onUp)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (collapsed) return
    if (e.key === 'ArrowLeft') setWidth(width - SIDEBAR_NAV_RESIZE_STEP)
    if (e.key === 'ArrowRight') setWidth(width + SIDEBAR_NAV_RESIZE_STEP)
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      aria-valuemin={SIDEBAR_NAV_WIDTH.min}
      aria-valuemax={SIDEBAR_NAV_WIDTH.max}
      aria-valuenow={collapsed ? undefined : width}
      tabIndex={0}
      className={cx(styles.resizeHandle, dragging && styles.resizing)}
      onPointerDown={onPointerDown}
      onDoubleClick={() => {
        if (collapsed) setCollapsed(false)
        setWidth(defaultWidth)
      }}
      onKeyDown={onKeyDown}
    />
  )
}
