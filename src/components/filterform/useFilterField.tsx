import * as React from 'react'
import { useFormikContext } from 'formik'
import { Filter, FilterConfig, FilterForm } from './types'
export type UseFilterFieldInputs = {
  filterConfigs: FilterConfig[]
  index: number
}

type UseFilterFieldOutputs = {
  formKey: string
  config: FilterConfig | undefined
  operatorOptions: { label: string; value: string }[]
  valueInputConfig: ValueInputConfig | undefined
  handleFieldChange: (value: string) => void
  handleOperatorChange: (value: string) => void
  filterFormValues: FilterForm
}

const TypeToOperatorOptions = {
  select: [
    { label: 'is any of', value: 'equals' },
    { label: 'is not any of', value: 'notEqual' },
    { label: 'has no value', value: 'blank' },
    { label: 'has any value', value: 'notBlank' },
  ],
  number: [
    { label: 'is', value: 'equals' },
    { label: 'is not', value: 'notEqual' },
    { label: 'is greater than', value: 'greaterThan' },
    { label: 'is greater than or equal to', value: 'greaterThanOrEqual' },
    { label: 'is less than', value: 'lessThan' },
    { label: 'is less than or equal to', value: 'lessThanOrEqual' },
    { label: 'has no value', value: 'blank' },
    { label: 'has any value', value: 'notBlank' },
    { label: 'is between', value: 'between' },
  ],
  text: [
    { label: 'contains', value: 'contains' },
    { label: 'does not contain', value: 'notContains' },
    { label: 'starts with', value: 'startsWith' },
    { label: 'ends with', value: 'endsWith' },
    { label: 'has no value', value: 'blank' },
    { label: 'has any value', value: 'notBlank' },
  ],
}

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

type FilterFieldState = {
  filterConfigs: FilterConfig[]
  config: FilterConfig | undefined
  operatorOptions: { label: string; value: string }[]
  valueInputConfig: ValueInputConfig | undefined
}

type Action = {
  type: 'setField' | 'setOperator' | 'initialize'
  payload: string | undefined
  currentFieldFilter?: Filter
}

const buildValueInputConfig = (
  config: FilterConfig,
  operator: string
): ValueInputConfig | undefined => {
  if (config.type === 'select') {
    if (operator === 'blank' || operator === 'notBlank') return

    return {
      type: 'select',
      valueOptions: config.options || [],
    }
  }

  if (config.type === 'number') {
    if (operator === 'blank' || operator === 'notBlank') return

    return {
      type: 'number',
      inputCount: operator === 'between' ? 2 : 1,
    }
  }

  if (config.type === 'text') {
    if (operator === 'blank' || operator === 'notBlank') return

    return {
      type: 'text',
    }
  }
}

const filterFieldReducer = (state: FilterFieldState, action: Action) => {
  switch (action.type) {
    case 'setField': {
      const config =
        state.filterConfigs.find((config) => config.field === action.payload) ||
        state.filterConfigs[0]

      const operatorOptions = config ? TypeToOperatorOptions[config.type] : []

      return {
        ...state,
        config,
        operatorOptions,
        valueInputConfig:
          operatorOptions.length > 0
            ? buildValueInputConfig(config, operatorOptions[0].value)
            : undefined,
      }
    }
    case 'setOperator': {
      if (!state.config) return state
      if (!action.payload) return state

      return {
        ...state,
        valueInputConfig: buildValueInputConfig(state.config, action.payload),
      }
    }
    case 'initialize': {
      const config =
        state.filterConfigs.find((config) => config.field === action.payload) ||
        state.filterConfigs[0]

      const operatorOptions = config ? TypeToOperatorOptions[config.type] : []

      const currentFieldFilter = action.currentFieldFilter?.operator

      return {
        ...state,
        config,
        operatorOptions,
        valueInputConfig:
          operatorOptions.length > 0
            ? buildValueInputConfig(
                config,
                currentFieldFilter || operatorOptions[0].value
              )
            : undefined,
      }
    }
    default:
      return state
  }
}

export const useFilterField = ({
  filterConfigs,
  index,
}: UseFilterFieldInputs): UseFilterFieldOutputs => {
  const formKey = `filters.${index}`
  const { setFieldValue, values } = useFormikContext<FilterForm>()
  const filter = values.filters[index]
  const [{ config, operatorOptions, valueInputConfig }, dispatch] =
    React.useReducer(
      filterFieldReducer,
      {
        filterConfigs,
        config: undefined,
        operatorOptions: [],
        valueInputConfig: undefined,
      },
      (state) => {
        return filterFieldReducer(state, {
          type: 'initialize',
          payload: filter.field,
          currentFieldFilter: filter,
        })
      }
    )

  const handleFieldChange = (value: string) => {
    dispatch({
      type: 'setField',
      payload: value,
    })
    setFieldValue(`${formKey}.values`, undefined)
    setFieldValue(`${formKey}.operator`, undefined)
  }

  const handleOperatorChange = (value: string) => {
    dispatch({
      type: 'setOperator',
      payload: value,
    })
  }

  React.useEffect(() => {
    const currentValue = values.filters[index]

    if (!currentValue.operator) {
      setFieldValue(
        `${formKey}.operator`,
        operatorOptions.length > 0 ? operatorOptions[0].value : undefined
      )
    }

    setFieldValue(`${formKey}.type`, config?.type)
  }, [config])

  return {
    formKey,
    config,
    operatorOptions,
    valueInputConfig,
    handleFieldChange,
    handleOperatorChange,
    filterFormValues: values,
  }
}
