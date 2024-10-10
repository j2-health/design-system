import { Card as AntdCard, CardProps } from 'antd'

const Card = ({ title, children, ...props }: CardProps) => {
  return (
    <AntdCard {...props} title={title}>
      {children}
    </AntdCard>
  )
}

export { Card }
