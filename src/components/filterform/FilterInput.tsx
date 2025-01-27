import * as React from 'react'
import { FilterConfig } from '.'
import { useFilterField } from './useFilterField'
import { Input, InputNumber, Select } from 'antd'
import { FormFilter } from './types'
import cx from 'classnames'
import { SizeType } from 'antd/es/config-provider/SizeContext'
type SelectValueInputConfig = {
  type: 'select'
  valueOptions: { label: string; value: string }[]
}

type NumberValueInputConfig = {
  type: 'number'
  inputCount: number
  numberOptions: { max: number; min: number; step: number }
}

type TextValueInputConfig = {
  type: 'text'
}

type ValueInputConfig =
  | SelectValueInputConfig
  | NumberValueInputConfig
  | TextValueInputConfig

type FilterInputProps = {
  value?: FormFilter
  filterConfigs: FilterConfig[]
  onChange?: (value: FormFilter) => void
  onBlur?: (value: FormFilter) => void
  className?: string
  size?: SizeType
}

export const FilterInput = ({
  value,
  filterConfigs,
  onChange,
  onBlur,
  className,
  size = 'middle',
}: FilterInputProps) => {
  const {
    filter,
    operatorOptions,
    valueInputConfig,
    handleFieldChange,
    handleOperatorChange,
    handleValuesChange,
  } = useFilterField({
    filterConfigs,
    filter: value,
  })

  const fieldOptions = filterConfigs.map((config) => ({
    label: config.label,
    value: config.field,
    disabled: config.disabled,
  }))

  const handleBlur = () => {
    if (filter) {
      onBlur?.(filter)
    }
  }

  const handleChange = (filter: FormFilter | undefined) => {
    if (filter) {
      onChange?.(filter)
    }
  }

  React.useEffect(() => {
    handleChange(filter)
  }, [filter])

  return (
    <div className={cx('grid grid-cols-3 gap-2', className)}>
      <Select
        options={fieldOptions}
        value={filter?.field}
        onChange={handleFieldChange}
        size={size}
      />
      <div className="col-span-2 flex gap-2">
        <Select
          options={operatorOptions}
          value={filter?.operator}
          onChange={handleOperatorChange}
          onBlur={handleBlur}
          size={size}
          popupMatchSelectWidth={false}
        />
        {valueInputConfig && (
          <ValueInput
            valueInputConfig={valueInputConfig}
            values={filter?.values}
            onChange={handleValuesChange}
            onBlur={handleBlur}
            size={size}
          />
        )}
      </div>
    </div>
  )
}

type ValueInputProps = {
  valueInputConfig: ValueInputConfig
  values?: (string | number | undefined | null)[]
  onChange: (value: (string | number | undefined | null)[]) => void
  onBlur: () => void
  size: SizeType
}

const ValueInput = ({
  valueInputConfig,
  values,
  onChange,
  onBlur,
  size,
}: ValueInputProps) => {
  const handleChange = (value: string | number | null) => {
    if (value === null) {
      onChange([])
    } else {
      onChange([value])
    }
  }

  const handleNumberChange = (value: string | number | null, index: number) => {
    const newValues: (string | number | undefined | null)[] = [
      ...(values ?? []),
    ]
    newValues[index] = value
    onChange(newValues)
  }

  switch (valueInputConfig.type) {
    case 'select':
      return (
        <Select
          options={valueInputConfig.valueOptions}
          onChange={onChange}
          showSearch
          allowClear
          mode="multiple"
          onBlur={onBlur}
          value={values}
          className="w-full"
          size={size}
          optionFilterProp="label"
        />
      )
    case 'number':
      return (
        <div className="flex gap-2 grow">
          {Array.from({ length: valueInputConfig.inputCount }).map(
            (_, index) => (
              <React.Fragment key={`number-input-${index}`}>
                {index !== 0 && <span className="my-auto">and</span>}
                <InputNumber
                  onChange={(value) => handleNumberChange(value, index)}
                  onBlur={onBlur}
                  value={values?.[index]}
                  className="basis-1/2"
                  size={size}
                  {...valueInputConfig.numberOptions}
                />
              </React.Fragment>
            )
          )}
        </div>
      )
    case 'text':
      return (
        <Input
          onBlur={onBlur}
          value={values?.[0] ?? undefined}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full"
          size={size}
        />
      )
    default:
      return null
  }
}
