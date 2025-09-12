import { Select, Spin, Input, SelectProps } from 'antd'
import { useState, useMemo } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import * as icons from '../icons'
import { Tag } from '../tag'
import cx from 'classnames'

import styles from './SummarizedSelect.module.css'

type Option = {
  label: React.ReactNode
  value: string
}

type GroupOption = {
  label: string
  options: Option[]
}

type SelectOption = Option | GroupOption

type BaseProps = Omit<
  SelectProps<string | string[], SelectOption>,
  'mode' | 'value' | 'onChange' | 'options'
> & {
  searchPlaceholder?: string
  formControlPlaceholder?: string
  rootClassName?: string
  popupClassName?: string

  options: SelectOption[]
  loading?: boolean
}

type SingleProps = {
  multiple?: false
  renderLabel?: undefined
  value: string
  onChange: (newValue: string) => void
}

type MultiProps = {
  multiple: true
  renderLabel: (count: number) => string
  value: string[]
  onChange: (newValue: string[]) => void
}

export type Props = BaseProps & (SingleProps | MultiProps)

const isGroupOption = (option: SelectOption): option is GroupOption => {
  return 'options' in option
}

const getAllOptions = (options: SelectOption[]): Option[] => {
  return options.flatMap((option) =>
    isGroupOption(option) ? option.options : [option]
  )
}

const filterOptions = (
  options: SelectOption[],
  searchValue: string
): SelectOption[] => {
  if (!searchValue) return options

  return options
    .map((option) => {
      if (isGroupOption(option)) {
        const filteredSubOptions = option.options.filter((subOption) =>
          subOption.label
            ?.toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        )
        return filteredSubOptions.length > 0
          ? { ...option, options: filteredSubOptions }
          : null
      } else {
        return option.label
          ?.toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase())
          ? option
          : null
      }
    })
    .filter((option): option is SelectOption => option !== null)
}

export function SummarizedSelect({
  searchPlaceholder,
  formControlPlaceholder,
  loading,
  multiple,
  value,
  onChange,
  options,
  renderLabel,
  rootClassName,
  popupClassName,
  ...props
}: Props) {
  const [searchValue, setSearchValue] = useState('')

  const filteredOptions = useMemo(() => {
    return filterOptions(options, searchValue)
  }, [searchValue, options])

  const allFlatOptions = useMemo(() => {
    return getAllOptions(options)
  }, [options])

  const handleTagClose = (removedValue: string) => {
    if (!multiple) return

    onChange(value.filter((x) => x !== removedValue))
  }

  const popupRender = (menu: React.ReactElement) => {
    const valueToLabel = (val: string) => {
      const option = allFlatOptions.find((opt) => opt.value === val)
      return option ? option.label : val
    }

    return (
      <div>
        <div className="mb-2 px-2 pb-2 border-b -mx-1 mt-1">
          <Input
            placeholder={searchPlaceholder || 'Search...'}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
              e.stopPropagation()
              e.preventDefault()
            }}
            onKeyDown={(e) => {
              // Prevent backspace from removing tags when typing in search input
              e.stopPropagation()
            }}
            onClick={(e) => e.stopPropagation()}
            prefix={
              <icons.MagnifyingGlassIcon size={16} className="text-gray-400" />
            }
            allowClear
          />
        </div>
        {multiple && value.length > 0 ? (
          <div className="px-2 pb-2">
            <div className="flex flex-wrap gap-1">
              {(value as string[]).map((value) => (
                <Tag
                  className="opacity-100 z-10"
                  key={value}
                  status="default"
                  closable
                  onClose={() => handleTagClose(value)}
                >
                  {valueToLabel(value)}
                </Tag>
              ))}
            </div>
          </div>
        ) : null}
        <div className={cx(styles.menuContainer, 'rounded-lg')}>{menu}</div>
      </div>
    )
  }

  const handleOpenChange = (open: boolean) => {
    if (open) return

    setSearchValue('')
  }

  return (
    <Select<string | string[], SelectOption>
      showSearch={false}
      suffixIcon={
        loading ? (
          <Spin
            indicator={<LoadingOutlined spin />}
            size="small"
            data-testid="loading-spinner"
          />
        ) : (
          <icons.CaretDownIcon size={14} data-testid="caret-down" />
        )
      }
      placeholder={formControlPlaceholder}
      mode={multiple ? 'multiple' : undefined}
      value={value}
      maxTagCount={0}
      maxTagPlaceholder={multiple ? () => renderLabel(value.length) : value}
      options={filteredOptions}
      onChange={(val) => {
        if (multiple) {
          if (Array.isArray(val)) {
            onChange(val)
          } else {
            throw new Error('Value should be an array in multiple mode')
          }
        } else {
          if (typeof val === 'string') {
            onChange(val)
          } else {
            throw new Error('Value should be a string in single selection mode')
          }
        }
      }}
      popupRender={popupRender}
      onOpenChange={handleOpenChange}
      classNames={{
        root: cx(rootClassName, styles.summarizedSelect, {
          [styles.hemisphericSelect]: props.variant != 'underlined',
          [styles.isActive]:
            multiple && value.length > 0 && props.variant != 'underlined',
        }),
        popup: { root: popupClassName },
      }}
      {...props}
    />
  )
}
