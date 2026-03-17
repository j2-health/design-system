import { forwardRef } from 'react'
import { Input as RawAntDInput } from 'antd'
import type { InputRef } from 'antd'
import type { SearchProps as AntDSearchProps } from 'antd/es/input/Search'

type AntdSearchInputProps = Expand<AntDSearchProps>

export const AntdSearchInput = forwardRef<InputRef, AntdSearchInputProps>(
  ({ size = 'large', ...props }, ref) => {
    return <RawAntDInput.Search ref={ref} size={size} {...props} />
  }
)

AntdSearchInput.displayName = 'AntdSearchInput'
