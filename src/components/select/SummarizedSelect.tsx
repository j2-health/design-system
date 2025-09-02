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

type StringSelectProps = SelectProps<string, Option>

export type Props = Omit<
  StringSelectProps,
  'mode' | 'value' | 'onChange' | 'options'
> & {
  searchPlaceholder?: string
  formControlPlaceholder: string
  options: Option[]
  loading?: boolean
  renderLabel: (count: number) => string
  multiple: boolean
  value: string | string[]
  onChange: (value: string | string[]) => void
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
  ...props
}: Props) {
  const [searchValue, setSearchValue] = useState('')
  const handleChange = (value: string | string[]) => {
    onChange(value)
  }

  const filteredOptions = useMemo(() => {
    if (!searchValue) return options
    return options.filter((option) =>
      option.label?.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [searchValue, options])

  const handleTagClose = (removedValue: string) => {
    if (multiple) return

    handleChange((value as string[]).filter((value) => value !== removedValue))
  }

  const popupRender = (menu: React.ReactElement) => (
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
      {multiple
        ? value.length > 0 && (
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
                    {value}
                  </Tag>
                ))}
              </div>
            </div>
          )
        : null}
      <div className={cx(styles.menuContainer, 'rounded-lg')}>{menu}</div>
    </div>
  )

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearchValue('')
    }
  }

  return (
    <Select<string | string[], Option>
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
        handleChange(val)
      }}
      popupRender={popupRender}
      onOpenChange={handleOpenChange}
      classNames={{
        root: cx('w-[200px]', styles.summarizedSelect, {
          [styles.hemisphericSelect]: props.variant != 'underlined',
        }),
        popup: {
          root: '!w-[300px]',
        },
      }}
      {...props}
    />
  )
}
