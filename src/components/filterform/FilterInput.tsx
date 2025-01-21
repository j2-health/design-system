import * as React from 'react'
import { FilterConfig } from '.'
import { useFilterField } from './useFilterField'
import { Input, InputNumber, Select } from 'antd'
import { FormFilter } from './types'

type SelectValueInputConfig = {
  type: 'select'
  valueOptions: { label: string; value: string }[]
}

type NumberValueInputConfig = {
  type: 'number'
  inputCount: number
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
}

export const FilterInput = ({
  value,
  filterConfigs,
  onChange,
  onBlur,
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
  }))

  const handleBlur = () => {
    if (filter) {
      console.log('Blur', filter)
      onBlur?.(filter)
    }
  }

  const handleChange = (filter: FormFilter | undefined) => {
    if (filter) {
      console.log('Change', filter)
      onChange?.(filter)
    }
  }

  React.useEffect(() => {
    handleChange(filter)
  }, [filter])

  return (
    <div className="grid grid-cols-3 gap-2">
      <Select
        options={fieldOptions}
        value={filter?.field}
        onChange={handleFieldChange}
      />
      <Select
        options={operatorOptions}
        value={filter?.operator}
        onChange={handleOperatorChange}
        onBlur={handleBlur}
      />
      {valueInputConfig && (
        <ValueInput
          valueInputConfig={valueInputConfig}
          values={filter?.values}
          onChange={handleValuesChange}
          onBlur={handleBlur}
        />
      )}
    </div>
  )
}

type ValueInputProps = {
  valueInputConfig: ValueInputConfig
  values?: (string | number | undefined | null)[]
  onChange: (value: (string | number | undefined | null)[]) => void
  onBlur: () => void
}

const ValueInput = ({
  valueInputConfig,
  values,
  onChange,
  onBlur,
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
        />
      )
    case 'number':
      return (
        <div className="flex gap-2">
          {Array.from({ length: valueInputConfig.inputCount }).map(
            (_, index) => (
              <React.Fragment key={`number-input-${index}`}>
                {index !== 0 && <span className="my-auto">and</span>}
                <InputNumber
                  onChange={(value) => handleNumberChange(value, index)}
                  onBlur={onBlur}
                  value={values?.[index]}
                />
              </React.Fragment>
            )
          )}
        </div>
      )
    case 'text':
      return (
        <Input
          onChange={(e) => handleChange(e.target.value)}
          onBlur={onBlur}
          value={values?.[0] ?? undefined}
        />
      )
    default:
      return null
  }
}
