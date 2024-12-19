import * as React from 'react'
import { Select } from '../select'
import { useFormikContext } from 'formik'
import { FilterForm } from './FiltersForm'

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

const TypeToOperatorOptions = {
  select: [
    { label: 'is any of', value: 'equals' },
    { label: 'is not any of', value: 'notEqual' },
    { label: 'has no value', value: 'blank' },
    { label: 'has any value', value: 'notBlank' },
  ],
}

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
  const { values, setFieldValue } = useFormikContext<FilterForm>()
  const [selectedConfig, setSelectedConfig] = React.useState<
    FilterConfig | undefined
  >(
    filter.field
      ? filterConfigs.find((config) => config.field === filter.field)
      : filterConfigs[0]
  )

  const formKey = `filters.${index}`

  const handleFieldChange = (value: string) => {
    setSelectedConfig(filterConfigs.find((config) => config.field === value))

    setFieldValue(`${formKey}.values`, [])
  }

  const fieldOptions = React.useMemo(() => {
    return filterConfigs.map((filter) => ({
      label: filter.label,
      value: filter.field,
    }))
  }, [filterConfigs])

  const operatorOptions = selectedConfig
    ? TypeToOperatorOptions[selectedConfig.type]
    : []

  const valueOptions = selectedConfig?.options ?? []

  React.useEffect(() => {
    const currentValue = values.filters[index]

    if (!currentValue.field) {
      setFieldValue(`${formKey}.field`, selectedConfig?.field)
      setFieldValue(`${formKey}.type`, selectedConfig?.type)
    }

    if (!currentValue.operator) {
      setFieldValue(`${formKey}.operator`, operatorOptions[0].value)
    }
  }, [selectedConfig])

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
      />
      <Select
        options={valueOptions}
        name={`${formKey}.values`}
        className="w-full"
        mode="multiple"
        allowClear
      />
    </div>
  )
}
