import { Breadcrumb as AntdBreadcrumb, BreadcrumbProps } from 'antd'

export type Props = Expand<BreadcrumbProps>

const Breadcrumb = ({ items, ...props }: Props) => {
  return <AntdBreadcrumb {...props} items={items} />
}

export { Breadcrumb }
