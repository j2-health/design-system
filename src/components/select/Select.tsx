import * as React from 'react'
import { Select as AntDSelect } from 'formik-antd'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import type {
  SelectProps as AntDSelectProps,
  DefaultOptionType,
} from 'antd/es/select'
import {
  CaretDownIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { useField } from 'formik'

type SelectProps = Expand<AntDSelectProps> & {
  name: string
}

type GroupOption = { label?: React.ReactNode; options: DefaultOptionType[] }

const isGroupOption = (
  opt: DefaultOptionType | GroupOption
): opt is GroupOption =>
  'options' in opt && Array.isArray((opt as GroupOption).options)

const flattenOptions = (
  opts: (DefaultOptionType | GroupOption)[] | undefined
): DefaultOptionType[] => {
  if (!opts) return []
  return opts.flatMap((o) =>
    isGroupOption(o) ? flattenOptions(o.options) : [o]
  )
}

export const Select = (props: SelectProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [field, , helpers] = useField(props.name)

  const isMultiple = props.mode === 'multiple'
  const hasOptions = (props.options?.length ?? 0) > 0
  const currentValue: unknown[] = Array.isArray(field.value) ? field.value : []
  const showSelectAllFooter =
    isMultiple && !props.loading && hasOptions && !isSearching

  const handleSearch = (value: string) => {
    setIsSearching(value.length > 0)
    if (props.onSearch) {
      props.onSearch(value)
    }
  }

  const handleToggleAll = () => {
    if (currentValue.length === 0) {
      const allValues = flattenOptions(
        props.options as (DefaultOptionType | GroupOption)[] | undefined
      )
        .map((opt) => opt.value)
        .filter((v): v is string | number => v !== undefined && v !== null)
      void helpers.setValue(allValues)
    } else {
      void helpers.setValue([])
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

      if (!showSelectAllFooter) return menu

      const label = currentValue.length === 0 ? 'Select all' : 'Clear all'

      return (
        <>
          {menu}
          <div className="mt-1 pt-1 border-t border-j2-border-secondary">
            <div
              role="button"
              aria-label={label}
              title={label}
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleToggleAll}
              className="text-center font-semibold text-sm py-1.5 rounded cursor-pointer text-j2-primary hover:bg-j2-primary-bg-hover"
            >
              {label}
            </div>
          </div>
        </>
      )
    },
    [
      props.loading,
      props.options?.length,
      showSelectAllFooter,
      currentValue.length,
    ]
  )

  return (
    <AntDSelect
      suffixIcon={
        props.loading ? (
          <Spin
            indicator={<LoadingOutlined spin />}
            size="small"
            data-testid="loading-spinner"
          />
        ) : props.showSearch && isFocused ? (
          <MagnifyingGlassIcon size={14} data-testid="magnifying-glass" />
        ) : (
          <CaretDownIcon size={14} data-testid="caret-down" />
        )
      }
      {...props}
      popupRender={dropdownRender}
      removeIcon={<XCircleIcon size={12} />}
      allowClear={
        props.allowClear ? { clearIcon: <XCircleIcon size={14} /> } : false
      }
      showSearch={props.showSearch}
      onSearch={handleSearch}
      onFocus={() => {
        setIsFocused(true)
      }}
      onBlur={() => {
        setIsFocused(false)
        setIsSearching(false)
      }}
      size={props.size || 'large'}
    />
  )
}
