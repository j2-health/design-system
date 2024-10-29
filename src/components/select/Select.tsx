import { Select as AntDSelect, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import type { SelectProps as AntDSelectProps } from 'antd'
import { CaretDown, MagnifyingGlass, XCircle } from '@phosphor-icons/react'
import { useState } from 'react'

type SelectProps = Expand<AntDSelectProps> & {
  size?: 'large' | 'middle' | 'small'
  mode?: '' | 'multiple'
  onChange?: (value: string | string[]) => void
  onSearch?: (value: string) => void
  options?: { label: string; value: string }[]
}

export const Select = (props: SelectProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = (value: string) => {
    if (props.onSearch) {
      props.onSearch(value)
    }
  }

  return (
    <AntDSelect
      {...props}
      suffixIcon={
        props.loading ? (
          <Spin
            indicator={<LoadingOutlined spin />}
            size="small"
            data-testid="loading-spinner"
          />
        ) : props.showSearch && isFocused ? (
          <MagnifyingGlass
            size={14}
            data-testid="magnifying-glass"
            weight="duotone"
          />
        ) : (
          <CaretDown size={14} data-testid="caret-down" weight="duotone" />
        )
      }
      allowClear={
        props.allowClear
          ? { clearIcon: <XCircle size={14} weight="duotone" /> }
          : false
      }
      showSearch={props.showSearch}
      onSearch={props.onSearch ? handleSearch : undefined}
      onFocus={() => {
        setIsFocused(true)
      }}
      onBlur={() => {
        setIsFocused(false)
      }}
    />
  )
}
