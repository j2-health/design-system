import { Card as AntdCard, CardProps } from 'antd'

// import this file to enable styling defined in there
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import './Card.css'

export type Props = Omit<CardProps, 'size'> & {
  /** Card title */
  title?: string
  /** Card contents */
  children: React.ReactNode
  /** Loading state */
  loading?: boolean
  /** Card size */
  size?: 'default' | 'small' | 'large'
}

const Card = ({
  title,
  children,
  loading,
  size = 'default',
  ...props
}: Props) => {
  return (
    <AntdCard
      className={`j2-card j2-card-${size}`}
      {...props}
      size={size === 'large' ? 'default' : size}
      title={title}
      loading={loading}
    >
      {children}
    </AntdCard>
  )
}

export { Card }
