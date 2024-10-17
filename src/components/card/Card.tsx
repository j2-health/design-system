import { Card as AntdCard, CardProps } from 'antd'

// import this file to enable styling defined in there
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import './Card.css'

export type Props = CardProps & {
  /** Card title */
  title?: string
  /** Card contents */
  children: React.ReactNode
  /** Loading state */
  loading?: boolean
}

const Card = ({ title, children, loading, ...props }: Props) => {
  return (
    <AntdCard {...props} title={title} loading={loading}>
      {children}
    </AntdCard>
  )
}

export { Card }
