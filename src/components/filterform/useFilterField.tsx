import * as React from 'react'
import { Filter, FilterConfig, FilterType, Operator } from './types'
import { isValidFilter } from './filterHelpers'
export type UseFilterFieldInputs = {
  filterConfigs: FilterConfig[]
  filter?: Filter
}

type UseFilterFieldOutputs = {
  filter: Filter | undefined
  config: FilterConfig | undefined
  operatorOptions: { label: string; value: string }[]
  valueInputConfig: ValueInputConfig | undefined
  handleFieldChange: (value: string) => void
  handleOperatorChange: (value: string) => void
  handleValuesChange: (value: (string | number | undefined | null)[]) => void
  isValid: boolean
}

export const TypeToOperatorOptions: Record<
  FilterType,
  { label: string; value: Operator }[]
> = {
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
    { label: 'is between', value: 'inRange' },
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

export type ValueInputConfig =
  | SelectValueInputConfig
  | NumberValueInputConfig
  | TextValueInputConfig

type FilterFieldState = {
  filter: Filter | undefined
  filterConfigs: FilterConfig[]
  config: FilterConfig | undefined
  operatorOptions: { label: string; value: string }[]
  valueInputConfig: ValueInputConfig | undefined
  isValid: boolean
}

type Action = {
  type: 'setField' | 'setOperator' | 'initialize'
  payload: string | undefined
}
type SetValuesAction = {
  type: 'setValues'
  payload: (string | number | undefined | null)[]
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
      inputCount: operator === 'inRange' ? 2 : 1,
    }
  }

  if (config.type === 'text') {
    if (operator === 'blank' || operator === 'notBlank') return

    return {
      type: 'text',
    }
  }
}

const filterFieldReducer = (
  state: FilterFieldState,
  action: Action | SetValuesAction
) => {
  switch (action.type) {
    case 'setField': {
      const config =
        state.filterConfigs.find((config) => config.field === action.payload) ||
        state.filterConfigs[0]

      const operatorOptions = config ? TypeToOperatorOptions[config.type] : []

      const newFilter = {
        ...state.filter,
        field: action.payload,
        operator: operatorOptions[0].value,
        values: [],
      } as Filter

      return {
        ...state,
        filter: newFilter,
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

      const newFilter = {
        ...state.filter,
        operator: action.payload,
      } as Filter

      return {
        ...state,
        filter: newFilter,
        valueInputConfig: buildValueInputConfig(state.config, action.payload),
        isValid: newFilter ? isValidFilter(newFilter) : false,
      }
    }
    case 'setValues': {
      const filter = state.filter
        ? ({
            ...state.filter,
            values: action.payload,
          } as Filter)
        : undefined

      return {
        ...state,
        filter,
        isValid: filter ? isValidFilter(filter) : false,
      }
    }
    case 'initialize': {
      const field = state.filter?.field || state.filterConfigs[0].field
      const config =
        state.filterConfigs.find((config) => config.field === field) ||
        state.filterConfigs[0]

      const operatorOptions = config ? TypeToOperatorOptions[config.type] : []

      const operator = state.filter?.operator || operatorOptions[0].value

      const filter =
        state.filter ??
        ({
          field,
          type: config.type,
          operator,
          values: [],
        } as Filter)

      return {
        ...state,
        config,
        filter,
        operatorOptions,
        valueInputConfig:
          operatorOptions.length > 0
            ? buildValueInputConfig(config, operator)
            : undefined,
      }
    }
    default:
      return state
  }
}

export const useFilterField = ({
  filterConfigs,
  filter: initialFilter,
}: UseFilterFieldInputs): UseFilterFieldOutputs => {
  const [
    { filter, config, operatorOptions, valueInputConfig, isValid },
    dispatch,
  ] = React.useReducer(
    filterFieldReducer,
    {
      filter: initialFilter,
      filterConfigs,
      config: undefined,
      operatorOptions: [],
      valueInputConfig: undefined,
      isValid: false,
    },
    (state) => {
      return filterFieldReducer(state, {
        type: 'initialize',
        payload: undefined,
      })
    }
  )

  const handleFieldChange = (value: string) => {
    dispatch({
      type: 'setField',
      payload: value,
    })
  }

  const handleOperatorChange = (value: string) => {
    dispatch({
      type: 'setOperator',
      payload: value,
    })
  }

  const handleValuesChange = (
    value: (string | number | undefined | null)[]
  ) => {
    dispatch({
      type: 'setValues',
      payload: value,
    })
  }

  return {
    filter,
    config,
    operatorOptions,
    valueInputConfig,
    handleFieldChange,
    handleOperatorChange,
    handleValuesChange,
    isValid,
  }
}
