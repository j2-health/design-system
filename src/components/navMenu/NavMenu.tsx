import * as React from 'react'
import { ItemType } from 'antd/es/menu/interface'
import cx from 'classnames'
import { Menu } from '../menu'

import Logo from '../../svgs/j2-logo.svg?react'
import Wordmark from '../../svgs/j2-wordmark.svg?react'
import ExpandIcon from '../../svgs/menu-sidebar-expand.svg?react'
import CollapseIcon from '../../svgs/menu-sidebar-collapse.svg?react'
import { Button } from '../button'

import styles from './NavMenu.module.css'
import { Tooltip } from '../tooltip'

type Props = {
  href?: string
  items: ItemType[]
  headerSlot?: React.ReactNode
  defaultOpenKeys?: string[]
  defaultSelectedKeys?: string[]
  footerItems: ItemType[]
}

export const NavMenu = ({
  href = '/',
  items,
  headerSlot,
  defaultOpenKeys,
  defaultSelectedKeys,
  footerItems,
}: Props) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [selectedKey, setSelectedKey] = React.useState<string>(
    defaultSelectedKeys?.[0] || ''
  )
  const [isToggleTooltipOpen, setToggleTooltipOpen] = React.useState(false)

  const toggleCollapse = React.useCallback(() => {
    setIsCollapsed(!isCollapsed)
    setToggleTooltipOpen(false)
  }, [isCollapsed])

  return (
    <div
      className={cx(
        styles.navMenuContainer,
        isCollapsed && styles.collapsed,
        'bg-white'
      )}
    >
      <div className={cx('flex', 'flex-col', 'h-full')}>
        <div className={cx('py-5', isCollapsed ? 'px-4' : 'px-3')}>
          <div
            className={cx(
              'flex',
              'items-center',
              isCollapsed ? 'justify-center' : 'justify-between',
              styles.headerContainer,
              'min-h-9'
            )}
          >
            <a
              href={href}
              className={cx('flex', 'items-center', 'gap-2', styles.logo)}
            >
              <Logo />
              {!isCollapsed && <Wordmark />}
            </a>
            <Tooltip
              title={isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
              placement="right"
              arrow={false}
              onOpenChange={(shouldBeOpen) => {
                setToggleTooltipOpen(shouldBeOpen)
              }}
              open={isToggleTooltipOpen}
            >
              <Button
                type="text"
                icon={isCollapsed ? <ExpandIcon /> : <CollapseIcon />}
                onClick={toggleCollapse}
                className={cx('toggle-button')}
              />
            </Tooltip>
          </div>
          {headerSlot && <div className={cx('mt-5')}>{headerSlot}</div>}
        </div>
        <div className={cx('flex', 'flex-col', 'justify-between', 'flex-1')}>
          <Menu
            key={`nav-menu-main-${isCollapsed}`}
            mode={'inline'}
            compact={isCollapsed}
            items={items}
            selectedKeys={[selectedKey]}
            defaultOpenKeys={isCollapsed ? undefined : defaultOpenKeys}
            onSelect={(info) => setSelectedKey(info.key)}
          />
          <Menu
            key={`nav-menu-footer-${isCollapsed}`}
            mode={'inline'}
            compact={isCollapsed}
            selectable={false}
            items={footerItems}
          />
        </div>
      </div>
    </div>
  )
}
