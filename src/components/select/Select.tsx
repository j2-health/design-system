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
    isMultiple &&
    !props.loading &&
    !props.disabled &&
    hasOptions &&
    !isSearching

  const handleSearch = (value: string) => {
    setIsSearching(value.length > 0)
    if (props.onSearch) {
      props.onSearch(value)
    }
  }

  const handleToggleAll = () => {
    if (props.disabled) return

    if (currentValue.length === 0) {
      const flat = flattenOptions(
        props.options as (DefaultOptionType | GroupOption)[] | undefined
      )
      const allOptions = flat.filter(
        (opt) => opt.value !== undefined && opt.value !== null && !opt.disabled
      )
      // antd's labelInValue mode expects values shaped as { value, label }
      // rather than raw scalars; mirror that contract so the field state
      // and downstream onChange payload match what consumers expect.
      const payload = props.labelInValue
        ? allOptions.map((opt) => ({ value: opt.value, label: opt.label }))
        : allOptions.map((opt) => opt.value as string | number)
      void helpers.setValue(payload)
      props.onChange?.(payload, allOptions)
    } else {
      void helpers.setValue([])
      props.onChange?.([], [])
    }
  }

  const dropdownRender = (menu: React.ReactElement): React.ReactElement => {
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
          <button
            type="button"
            aria-label={label}
            title={label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleToggleAll}
            className="w-full text-center font-semibold text-sm py-1.5 rounded cursor-pointer text-j2-primary hover:bg-j2-primary-bg-hover bg-transparent border-0"
          >
            {label}
          </button>
        </div>
      </>
    )
  }

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
