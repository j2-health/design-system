import { Button as AntdButton, ButtonProps } from 'antd'

export type Props = ButtonProps & {
  /** Is this the principal call to action on the page? */
  type?: 'primary' | 'dashed' | 'link' | 'text' | 'default'
  /** How large should the button be? */
  size?: 'small' | 'middle' | 'large'
  /** Button contents */
  label: string
  /** Optional click handler */
  onClick?: () => void
}

const Button = ({ type, size, label, onClick, ...props }: Props) => {
  return (
    <AntdButton {...props} type={type} size={size} onClick={onClick}>
      {label}
    </AntdButton>
  )
}

export { Button }
