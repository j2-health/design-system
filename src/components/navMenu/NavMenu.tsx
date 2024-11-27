import { ItemType } from 'antd/es/menu/interface'
import cx from 'classnames'
import { Menu } from '../menu'

import Logo from '../../svgs/j2-logo.svg?react'
import Wordmark from '../../svgs/j2-wordmark.svg?react'

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
  return (
    <div className={cx('h-screen', 'w-64', 'bg-white', 'flex', 'flex-col')}>
      <div className={cx('py-5', 'px-3')}>
        <a href={href} className={cx('flex', 'items-center', 'gap-2')}>
          <Logo />
          <Wordmark />
        </a>
        {headerSlot && <div className={cx('mt-5')}>{headerSlot}</div>}
      </div>
      <div className={cx('flex', 'flex-col', 'justify-between', 'flex-1')}>
        <Menu
          mode="inline"
          items={items}
          defaultOpenKeys={defaultOpenKeys}
          defaultSelectedKeys={defaultSelectedKeys}
        />
        <Menu mode="inline" selectable={false} items={footerItems} />
      </div>
    </div>
  )
}
