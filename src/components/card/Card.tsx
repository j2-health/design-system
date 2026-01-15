import { Card as AntdCard, CardProps } from 'antd'
import cx from 'classnames'

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
  /** Inner card type variant */
  /** It allows inner card to have variants independent of other props.
      Works only with type="inner" */
  innerVariant?: 'default' | 'basic'
}

const Card = ({
  title,
  children,
  loading,
  size = 'default',
  innerVariant = 'default',
  ...props
}: Props) => {
  const isInner = props.type === 'inner'
  const isInnerBasic = isInner && innerVariant === 'basic'
  return (
    <AntdCard
      className={cx(
        'j2-card',
        `j2-card-${size}`,
        isInnerBasic && 'inner-basic'
      )}
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
