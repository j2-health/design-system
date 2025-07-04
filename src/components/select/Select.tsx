import * as React from 'react'
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

  const dropdownRender = React.useCallback(
    (menu: React.ReactElement): React.ReactElement => {
      if (props.loading) {
        return (
          <div className="flex items-center justify-between px-3 py-1">
            <span>Loading...</span>
            <Spin indicator={<LoadingOutlined spin />} size="small" />
          </div>
        )
      }

      if (!props.options || (props.options && props.options.length === 0)) {
        return <div className="px-3 py-1">No options</div>
      }

      return menu
    },
    [props.loading, props.options?.length]
  )

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
      popupRender={dropdownRender}
      removeIcon={<XCircle size={12} />}
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
      size={props.size || 'large'}
    />
  )
}
