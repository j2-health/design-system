import { forwardRef } from 'react'
import { Input as RawAntDInput } from 'antd'
import type { TextAreaProps as AntDTextAreaProps } from 'antd/es/input'
import type { TextAreaRef } from 'antd/es/input/TextArea'

type AntdTextAreaProps = Expand<AntDTextAreaProps>

export type { TextAreaRef }

/** Multi-line text input: antd's `Input.TextArea`, themed like `AntdInput`. */
export const AntdTextArea = forwardRef<TextAreaRef, AntdTextAreaProps>(
  (props, ref) => {
    return <RawAntDInput.TextArea ref={ref} {...props} />
  }
)

AntdTextArea.displayName = 'AntdTextArea'
