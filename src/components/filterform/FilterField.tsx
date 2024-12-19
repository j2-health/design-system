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

type FilterFieldState = {
  config: FilterConfig | undefined
  filterConfigs: FilterConfig[]
  operatorOptions: { label: string; value: string }[]
  valueOptions: { label: string; value: string }[] | undefined
}

type Action = {
  type: 'setField' | 'setOperator'
  payload: string | undefined
}

const buildValueOptions = (config: FilterConfig, operator: string) => {
  if (
    config.type === 'select' &&
    (operator === 'blank' || operator === 'notBlank')
  ) {
    return
  }

  return config.options
}

const filterFieldReducer = (state: FilterFieldState, action: Action) => {
  switch (action.type) {
    case 'setField': {
      const config =
        state.filterConfigs.find((config) => config.field === action.payload) ||
        state.filterConfigs[0]

      return {
        ...state,
        config,
        operatorOptions: config ? TypeToOperatorOptions[config.type] : [],
        valueOptions: config?.options,
      }
    }
    case 'setOperator': {
      if (!state.config) return state
      if (!action.payload) return state

      return {
        ...state,
        valueOptions: buildValueOptions(state.config, action.payload),
      }
    }
    default:
      return state
  }
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
  const [{ config, operatorOptions, valueOptions }, dispatch] =
    React.useReducer(
      filterFieldReducer,
      {
        filterConfigs,
        config: undefined,
        operatorOptions: [],
        valueOptions: [],
      },
      (state) => {
        return filterFieldReducer(state, {
          type: 'setField',
          payload: filter.field,
        })
      }
    )

  const formKey = `filters.${index}`

  const handleFieldChange = (value: string) => {
    dispatch({
      type: 'setField',
      payload: value,
    })
    setFieldValue(`${formKey}.values`, [])
  }

  const handleOperatorChange = (value: string) => {
    dispatch({
      type: 'setOperator',
      payload: value,
    })
    setFieldValue(`${formKey}.values`, undefined)
  }

  const fieldOptions = React.useMemo(() => {
    return filterConfigs.map((filter) => ({
      label: filter.label,
      value: filter.field,
    }))
  }, [filterConfigs])

  React.useEffect(() => {
    const currentValue = values.filters[index]

    if (!currentValue.field) {
      setFieldValue(`${formKey}.field`, config?.field)
      setFieldValue(`${formKey}.type`, config?.type)
    }

    if (!currentValue.operator && operatorOptions.length > 0) {
      setFieldValue(`${formKey}.operator`, operatorOptions[0].value)
    }
  }, [config])

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
