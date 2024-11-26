import * as React from 'react'
import { Icon } from '@phosphor-icons/react'
import { Breadcrumb as AntdBreadcrumb, BreadcrumbProps } from 'antd'

type ItemConfig = {
  title: string
  icon?: Icon
  href?: string
}
export type Props = Expand<
  Omit<BreadcrumbProps, 'items'> & { items: ItemConfig[] }
>

const Breadcrumb = ({ items, ...props }: Props) => {
  const antDItems = React.useMemo(
    () =>
      items.map((item) => ({
        href: item.href,
        title: (
          <span className="flex items-center gap-1">
            {item.icon && <item.icon size={14} />}
            {item.title}
          </span>
        ),
      })),
    [items]
  )

  return <AntdBreadcrumb {...props} items={antDItems} />
}

export { Breadcrumb }
