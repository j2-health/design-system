import * as React from 'react'
import {
  FilterConfig,
  FilterType,
  FormFilter,
  NumberOptionsType,
  Operator,
  SelectOptionsType,
} from './types'
import {
  isMultiValueTextOperator,
  normalizeMultiValues,
  validateFormFilter,
} from './filterHelpers'
export { isMultiValueTextOperator } from './filterHelpers'
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
          : isMultiValueTextOperator(state.filter.operator)
            ? // Normalized on the way into state, not just for display —
              // validation counts and `onSubmit` emit exactly these chips.
              normalizeMultiValues(action.payload)
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

      // A persisted filter's operator must still be one this field offers.
      // Configs change between sessions (a field narrowed to `contains`, or
      // one that never opted into the multi-value operators), and the
      // backend may not understand a stale operator — so it falls back to
      // the field's first operator with its values cleared, rather than
      // re-submitting something the config no longer allows.
      const persisted = state.filter?.operator
      const persistedAllowed =
        persisted !== undefined &&
        operatorOptions.some((option) => option.value === persisted)
      const operator = persistedAllowed ? persisted : operatorOptions[0]?.value

      let filter: FormFilter
      if (!state.filter) {
        filter = {
          field,
          type: config.type,
          operator,
          values: [],
        } as FormFilter
      } else if (!persistedAllowed) {
        filter = { ...state.filter, operator, values: [] } as FormFilter
      } else if (isMultiValueTextOperator(operator)) {
        // Same normalization as `setValues`, so a persisted chip list that
        // predates it (or was hand-edited) can't show one chip and count two.
        filter = {
          ...state.filter,
          values: normalizeMultiValues(state.filter.values),
        }
      } else {
        // A copy: the incoming object is the caller's, and writing `errors`
        // onto it would hide the correction from `FilterInput`'s comparison
        // of what it was given against what it initialized to.
        filter = { ...state.filter }
      }

      filter.errors = validateFormFilter(filter, config)

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
