import { Button as AntdButton, ButtonProps } from 'antd'
import cx from 'classnames'
import './Button.css'

export type Props = Expand<
  Omit<ButtonProps, 'size'> & {
    /** `'xs'` is a 20px button for dense toolbars and bands. */
    size?: ButtonProps['size'] | 'xs'
    /**
     * With `type="link"`: no padding or fixed height, so the button sits in a
     * line of text like a link.
     */
    inline?: boolean
  }
>

const Button = ({
  type,
  size,
  ghost,
  danger,
  shape,
  inline,
  className,
  ...props
}: Props) => {
  const isXs = size === 'xs'
  return (
    <AntdButton
      {...props}
      type={type}
      size={isXs ? 'small' : size}
      ghost={ghost}
      danger={danger}
      shape={shape}
      className={cx(
        isXs && 'j2-btn-xs',
        inline && type === 'link' && 'j2-btn-inline',
        className
      )}
    >
      {props.children}
    </AntdButton>
  )
}

export { Button }
