import { forwardRef } from 'react'
import { Input as RawAntDInput } from 'antd'
import type { InputProps as AntDInputProps, InputRef } from 'antd'

type AntdInputProps = Expand<AntDInputProps>

export type { InputRef }

export const AntdInput = forwardRef<InputRef, AntdInputProps>(
  ({ size = 'large', ...props }, ref) => {
    return <RawAntDInput ref={ref} size={size} {...props} />
  }
)

AntdInput.displayName = 'AntdInput'
