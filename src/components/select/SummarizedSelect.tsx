import { Select, Spin, Input, SelectProps } from 'antd'
import { useState, useMemo } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import * as icons from '../icons'
import { Tag } from '../tag'
import cx from 'classnames'

import styles from './SummarizedSelect.module.css'

const countToValue = (count: number) => {
  if (count == 0) return 'Any J2 Specialty'
  if (count == 1) return '1 J2 Specialty'

  return `${count} J2 Specialties`
}

type Option = {
  label: string
  value: string
}

type CustomProps = {
  searchPlaceholder?: string
  formControlPlaceholder: string
  value: string[]
  options: Option[]
  onChange: (value: string[]) => void
}

type Props = Omit<SelectProps, keyof CustomProps> & {
  searchPlaceholder?: string
  formControlPlaceholder: string
  value: string[]
  options: Option[]
  onChange: (value: string[]) => void
}

export function SummarizedSelect({
  searchPlaceholder,
  formControlPlaceholder,
  value,
  onChange,
  options,
  ...props
}: Props) {
  const selectedValues = value
  const setSelectedValues = onChange
  const [searchValue, setSearchValue] = useState('')
  const loading = false

  const filteredOptions = useMemo(() => {
    if (!searchValue) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [searchValue])

  const handleTagClose = (removedValue: string) => {
    setSelectedValues(selectedValues.filter((value) => value !== removedValue))
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
      {selectedValues.length > 0 && (
        <div className="px-2 pb-2">
          <div className="flex flex-wrap gap-1">
            {selectedValues.map((value) => (
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
      )}
      <div className={cx(styles.menuContainer, 'rounded-lg')}>{menu}</div>
    </div>
  )

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearchValue('')
    }
  }

  return (
    <Select
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
      mode="multiple"
      value={selectedValues}
      onChange={setSelectedValues}
      maxTagCount={0}
      maxTagPlaceholder={() => countToValue(selectedValues.length)}
      options={filteredOptions}
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
