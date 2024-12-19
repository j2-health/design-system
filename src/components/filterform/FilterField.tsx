import * as React from 'react'
import { Select } from '../select'
import { useFilterField } from './useFilterField'

type FilterType = 'select'

export type FilterConfig = {
  label: string
  field: string
  type: FilterType
  options?: { label: string; value: string }[]
}

type SelectFilter = {
  field: string
  type: 'select'
  operator: 'equals' | 'notEqual' | 'blank' | 'notBlank'
  values: string[]
}

type EmptyFilter = {
  field: undefined
  type: undefined
  operator: undefined
  values: undefined
}

export type Filter = SelectFilter | EmptyFilter

type FilterFieldProps = {
  filterConfigs: FilterConfig[]
  index: number
  filter: Filter
}

export const FilterField = ({
  filterConfigs,
  index,
  filter,
}: FilterFieldProps) => {
  const {
    formKey,
    operatorOptions,
    valueOptions,
    handleFieldChange,
    handleOperatorChange,
  } = useFilterField({ filterConfigs, filter, index })

  const fieldOptions = React.useMemo(() => {
    return filterConfigs.map((filter) => ({
      label: filter.label,
      value: filter.field,
    }))
  }, [filterConfigs])

  return (
    <div className="grid grid-cols-3 gap-2">
      <Select
        options={fieldOptions}
        name={`${formKey}.field`}
        className="w-full"
        onChange={handleFieldChange}
      />
      <Select
        options={operatorOptions}
        name={`${formKey}.operator`}
        className="w-full"
        onChange={handleOperatorChange}
      />
      {valueOptions && (
        <Select
          options={valueOptions}
          name={`${formKey}.values`}
          className="w-full"
          mode="multiple"
          allowClear
        />
      )}
    </div>
  )
}
