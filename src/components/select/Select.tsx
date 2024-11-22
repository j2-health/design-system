import { Select as AntDSelect } from 'formik-antd'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import type { SelectProps as AntDSelectProps } from 'antd'
import { CaretDown, MagnifyingGlass, XCircle } from '@phosphor-icons/react'
import { useState } from 'react'

type SelectProps = Expand<AntDSelectProps> & {
  name: string
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
          <MagnifyingGlass size={14} data-testid="magnifying-glass" />
        ) : (
          <CaretDown size={14} data-testid="caret-down" />
        )
      }
      allowClear={
        props.allowClear ? { clearIcon: <XCircle size={14} /> } : false
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
