import { Card as AntdCard, CardProps } from 'antd'
import cx from 'classnames'

// import this file to enable styling defined in there
import './Card.css'

export type Props = Omit<CardProps, 'size'> & {
  /** Card title */
  title?: string
  /** Card contents */
  children: React.ReactNode
  /** Loading state */
  loading?: boolean
  /** Card size */
  size?: 'default' | 'small' | 'compact' | 'large'
  /**
   * Inner card type variant.
   * It allows inner card to have variants independent of other props.
   * Works only with type="inner".
   */
  innerVariant?: 'default' | 'basic'
  /**
   * Marks the card as the chosen one of a set. With `onClick`, the card also
   * becomes a toggle button: focusable, Enter or Space activates it, and it
   * reports `aria-pressed`.
   */
  selected?: boolean
}

const Card = ({
  title,
  children,
  loading,
  size = 'default',
  innerVariant = 'default',
  selected,
  className,
  ...props
}: Props) => {
  const isSelectable = selected !== undefined && Boolean(props.onClick)
  const isInner = props.type === 'inner'
  const isInnerBasic = isInner && innerVariant === 'basic'
  return (
    <AntdCard
      className={cx(
        'j2-card',
        `j2-card-${size}`,
        isInnerBasic && 'inner-basic',
        selected && 'j2-card-selected',
        isSelectable && 'j2-card-selectable',
        className
      )}
      {...props}
      {...(isSelectable && {
        role: 'button',
        tabIndex: 0,
        'aria-pressed': selected,
        onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
          props.onKeyDown?.(event)
          if (event.defaultPrevented) return
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            props.onClick?.(
              event as unknown as React.MouseEvent<HTMLDivElement>
            )
          }
        },
      })}
      size={size === 'small' ? 'small' : 'medium'}
      title={title}
      loading={loading}
    >
      {children}
    </AntdCard>
  )
}

export { Card }
