import { Button as AntdButton, ButtonProps } from 'antd'

export type Props = Expand<ButtonProps>

const Button = ({ type, size, ghost, danger, shape, ...props }: Props) => {
  return (
    <AntdButton
      {...props}
      type={type}
      size={size}
      ghost={ghost}
      danger={danger}
      shape={shape}
    >
      {props.children}
    </AntdButton>
  )
}

export { Button }
