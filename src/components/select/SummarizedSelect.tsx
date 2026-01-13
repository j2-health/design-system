import { Select, Spin, Input, SelectProps, InputRef } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { useState, useMemo, useRef, useEffect } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import type { FlattenOptionData } from 'rc-select/lib/interface'
import * as icons from '../icons'
import { Tag } from '../tag'
import cx from 'classnames'

import styles from './SummarizedSelect.module.css'

type Option = DefaultOptionType
type OptionWithLogo = Option & {
  logo: React.ReactNode
}

type GroupOption = {
  label: string
  options: Option[]
}

export type SelectOption = Option | GroupOption | OptionWithLogo

export type SummarizedSelectVariant = SelectProps['variant'] | 'headlined'

type BaseProps = Omit<
  SelectProps<string | string[], SelectOption>,
  'mode' | 'value' | 'onChange' | 'variant'
> & {
  searchPlaceholder?: string
  formControlPlaceholder?: string
  rootClassName?: string
  popupClassName?: string
  variant?: SummarizedSelectVariant

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

const getAllOptions = (options: SelectOption[] | undefined): Option[] => {
  if (!options) return []

  return options.flatMap((option) =>
    isGroupOption(option) ? option.options : [option]
  )
}

const filterOptions = (
  options: SelectOption[] | undefined,
  searchValue: string
): SelectOption[] => {
  if (!options) return []
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
  variant,
  ...props
}: Props) {
  const isHeadline = variant === 'headlined'
  const antVariant = isHeadline ? 'borderless' : variant
  const [searchValue, setSearchValue] = useState('')
  const [focusTrigger, setFocusTrigger] = useState(0)
  const inputRef = useRef<InputRef>(null)

  useEffect(() => {
    if (focusTrigger > 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            inputRef.current?.focus({ cursor: 'end' })
          }, 100)
        })
      })
    }
  }, [focusTrigger])

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

  const handleToggleAll = () => {
    if (!multiple) return

    const allFilteredValues = getAllOptions(filteredOptions).map(
      (opt) => opt.value as string
    )
    const someSelected = allFilteredValues.some((val) => value.includes(val))

    if (someSelected) {
      onChange(value.filter((val) => !allFilteredValues.includes(val)))
    }
  }

  const optionRender = (option: FlattenOptionData<SelectOption>) => {
    if ('logo' in option.data && option.data.logo) {
      return (
        <div className="flex items-center gap-2">
          <div className="h-4 shrink-0">{option.data.logo}</div>
          <span className="overflow-ellipsis overflow-hidden">
            {option.label}
          </span>
        </div>
      )
    }
    return <div>{option.label}</div>
  }

  const popupRender = (menu: React.ReactElement) => {
    const valueToLabel = (val: string) => {
      const option = allFlatOptions.find((opt) => opt.value === val)
      return option ? (option.label as string) : val
    }

    return (
      <div>
        <div className="mb-2 px-2 pb-2 border-b -mx-1 mt-1">
          <Input
            ref={inputRef}
            key={focusTrigger}
            autoFocus
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
                  className="opacity-100 z-10 flex max-w-full"
                  key={value}
                  status="default"
                  closable
                  onClose={() => handleTagClose(value)}
                >
                  <span
                    className="overflow-ellipsis overflow-hidden"
                    title={valueToLabel(value)}
                  >
                    {valueToLabel(value)}
                  </span>
                </Tag>
              ))}
            </div>
          </div>
        ) : null}
        <div
          className={cx(styles.menuContainer, 'rounded-lg', {
            [styles.headlinedMenuContainer]: isHeadline,
          })}
        >
          {menu}
        </div>
        <div className="flex justify-between items-center">
          {multiple && (
            <div className="w-full border-t border-j2-gray-5 mt-1 pt-1">
              <div
                aria-selected="false"
                className="ant-select-item ant-select-item-option text-j2-blue-9 hover:bg-j2-blue-5 w-full"
                title="Clear all"
                onClick={handleToggleAll}
              >
                <div className="ant-select-item-option-content text-center font-semibold">
                  Clear all
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Trigger focus by updating the counter
      setFocusTrigger((prev) => prev + 1)
    } else {
      setSearchValue('')
    }
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
      optionRender={optionRender}
      onOpenChange={handleOpenChange}
      classNames={{
        root: cx(rootClassName, styles.summarizedSelect, {
          [styles.hemisphericSelect]:
            variant !== 'underlined' && variant !== 'headlined',
          [styles.isActive]:
            multiple &&
            value.length > 0 &&
            variant !== 'underlined' &&
            variant !== 'headlined',
          [styles.headlinedSelect]: isHeadline,
        }),
        popup: { root: popupClassName },
      }}
      variant={antVariant}
      {...props}
    />
  )
}
