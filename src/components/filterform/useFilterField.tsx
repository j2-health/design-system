import * as React from 'react'
import { FilterConfig, Filter } from './FilterField'
import { FilterForm } from './FiltersForm'
import { useFormikContext } from 'formik'

type UseFilterFieldInputs = {
  filterConfigs: FilterConfig[]
  filter: Filter
  index: number
}

type UseFilterFieldOutputs = {
  formKey: string
  config: FilterConfig | undefined
  operatorOptions: { label: string; value: string }[]
  valueOptions: { label: string; value: string }[] | undefined
  handleFieldChange: (value: string) => void
  handleOperatorChange: (value: string) => void
}

const TypeToOperatorOptions = {
  select: [
    { label: 'is any of', value: 'equals' },
    { label: 'is not any of', value: 'notEqual' },
    { label: 'has no value', value: 'blank' },
    { label: 'has any value', value: 'notBlank' },
  ],
}

type FilterFieldState = {
  filterConfigs: FilterConfig[]
  config: FilterConfig | undefined
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

export const useFilterField = ({
  filterConfigs,
  filter,
  index,
}: UseFilterFieldInputs): UseFilterFieldOutputs => {
  const formKey = `filters.${index}`
  const { setFieldValue, values } = useFormikContext<FilterForm>()
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

  const handleFieldChange = (value: string) => {
    dispatch({
      type: 'setField',
      payload: value,
    })
    setFieldValue(`${formKey}.values`, undefined)
  }

  const handleOperatorChange = (value: string) => {
    dispatch({
      type: 'setOperator',
      payload: value,
    })
    setFieldValue(`${formKey}.values`, undefined)
  }

  React.useEffect(() => {
    const currentValue = values.filters[index]

    if (!currentValue.field) {
      setFieldValue(`${formKey}.field`, config?.field)
      setFieldValue(`${formKey}.type`, config?.type)
      setFieldValue(
        `${formKey}.operator`,
        operatorOptions.length > 0 ? operatorOptions[0].value : undefined
      )
    }
  }, [config])

  return {
    formKey,
    config: config,
    operatorOptions: operatorOptions,
    valueOptions: valueOptions,
    handleFieldChange,
    handleOperatorChange,
  }
}
