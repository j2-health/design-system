import * as React from 'react'
import {
  FilterConfig,
  FilterType,
  FormFilter,
  NumberOptionsType,
  Operator,
  SelectOptionsType,
} from './types'
import { validateFormFilter } from './filterHelpers'
export type UseFilterFieldInputs = {
  filterConfigs: FilterConfig[]
  filter?: FormFilter
}

type UseFilterFieldOutputs = {
  filter: FormFilter | undefined
  config: FilterConfig | undefined
  operatorOptions: { label: string; value: string }[]
  valueInputConfig: ValueInputConfig | undefined
  handleFieldChange: (value: string) => void
  handleOperatorChange: (value: string) => void
  handleValuesChange: (value: (string | number | undefined | null)[]) => void
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

// Multi-value exact-match operators for text fields. Deliberately NOT part of
// `TypeToOperatorOptions.text`: a field only offers them when its
// `FilterConfig.operators` lists them, so every existing consumer keeps the
// operator list it has today (see the `operators` doc in types.ts).
export const MultiValueTextOperatorOptions: {
  label: string
  value: Operator
}[] = [
  { label: 'is any of', value: 'isAnyOf' },
  { label: 'is not any of', value: 'isNoneOf' },
]

export const isMultiValueTextOperator = (
  operator: string | undefined
): boolean => operator === 'isAnyOf' || operator === 'isNoneOf'

/**
 * Operator options a field offers: its type's default list unless the config
 * names its own (`operators`), in which case that list — in the given order,
 * dropping anything the type can't express. `operators` may therefore both
 * narrow the defaults and add the opt-in multi-value text operators.
 */
export const operatorOptionsFor = (
  config: FilterConfig
): { label: string; value: Operator }[] => {
  const defaults = TypeToOperatorOptions[config.type]
  if (!config.operators) return defaults
  const known =
    config.type === 'text'
      ? [...defaults, ...MultiValueTextOperatorOptions]
      : defaults
  return config.operators.flatMap((operator) => {
    const option = known.find((candidate) => candidate.value === operator)
    return option ? [option] : []
  })
}

type SelectValueInputConfig = {
  type: 'select'
  valueOptions: { label: string; value: string }[]
}

type NumberValueInputConfig = {
  type: 'number'
  inputCount: number
  numberOptions?: { max: number; min: number; step: number }
}

type TextValueInputConfig = {
  type: 'text'
  // True for `isAnyOf` / `isNoneOf`: the value input is a chips list rather
  // than a single text box. `maxValues` is the config's cap, if any.
  multiValue?: boolean
  maxValues?: number
}

export type ValueInputConfig =
  SelectValueInputConfig | NumberValueInputConfig | TextValueInputConfig

type FilterFieldState = {
  filter: FormFilter | undefined
  filterConfigs: FilterConfig[]
  config: FilterConfig | undefined
  operatorOptions: { label: string; value: string }[]
  valueInputConfig: ValueInputConfig | undefined
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
      valueOptions: (config.options as SelectOptionsType) || [],
    }
  }

  if (config.type === 'number') {
    if (operator === 'blank' || operator === 'notBlank') return

    return {
      type: 'number',
      inputCount: operator === 'inRange' ? 2 : 1,
      numberOptions: config.options as NumberOptionsType,
    }
  }

  if (config.type === 'text') {
    if (operator === 'blank' || operator === 'notBlank') return

    return {
      type: 'text',
      multiValue: isMultiValueTextOperator(operator),
      maxValues: config.maxValues,
    }
  }
}

const filterFieldReducer = (
  state: FilterFieldState,
  action: Action | SetValuesAction
) => {
  switch (action.type) {
    case 'setField': {
      const config = state.filterConfigs.find(
        (config) => config.field === action.payload
      )

      if (!config) return state

      const operatorOptions = operatorOptionsFor(config)

      const newFilter = {
        ...state.filter,
        type: config.type,
        field: action.payload,
        operator: operatorOptions[0]?.value,
        values: [],
      } as FormFilter

      const pendingFilter = {
        ...newFilter,
        errors: validateFormFilter(newFilter, config),
      }

      return {
        ...state,
        filter: pendingFilter,
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

      const pendingFilter = {
        ...state.filter,
        operator: action.payload,
        values: [],
      } as FormFilter

      return {
        ...state,
        filter: {
          ...pendingFilter,
          errors: validateFormFilter(pendingFilter, state.config),
        },
        valueInputConfig: buildValueInputConfig(state.config, action.payload),
      }
    }
    case 'setValues': {
      if (!state.filter) return state

      const values =
        state.filter.type === 'number'
          ? action.payload.map((value) => Number(value))
          : (action.payload.filter(
              (value) => value !== null && value !== undefined
            ) as string[])

      const pendingFilter = {
        ...state.filter,
        values: values,
      }

      pendingFilter.errors = validateFormFilter(pendingFilter, state.config)

      return {
        ...state,
        filter: pendingFilter,
      }
    }
    case 'initialize': {
      const field =
        state.filter?.field ||
        state.filterConfigs.find((config) => !config.disabled)?.field
      const config = state.filterConfigs.find(
        (config) => config.field === field
      )

      if (!config) return state

      const operatorOptions = operatorOptionsFor(config)

      const operator = state.filter?.operator || operatorOptions[0]?.value

      const filter =
        state.filter ??
        ({
          field,
          type: config.type,
          operator,
          values: [],
        } as FormFilter)

      const errors = validateFormFilter(filter, config)
      filter.errors = errors

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
  const [{ filter, config, operatorOptions, valueInputConfig }, dispatch] =
    React.useReducer(
      filterFieldReducer,
      {
        filter: initialFilter,
        filterConfigs,
        config: undefined,
        operatorOptions: [],
        valueInputConfig: undefined,
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
  }
}
