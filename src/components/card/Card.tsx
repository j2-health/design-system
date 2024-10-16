import { Card as AntdCard, CardProps } from 'antd'

export type Props = CardProps & {
  /** Card title */
  title?: string
  /** Card contents */
  children: React.ReactNode
}
const Card = ({ title, children, ...props }: Props) => {
  return (
    <AntdCard {...props} title={title}>
      {children}
    </AntdCard>
  )
}

export { Card }
