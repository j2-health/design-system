import { Filter } from './types'

// The only `FilterConfig` fields validation consults. Passed separately from
// the filter because a submitted `Filter` doesn't carry its config.
export type FilterValueLimits = { maxValues?: number }

export const tooManyValuesMessage = (maxValues: number) =>
  `Up to ${maxValues} values`

const exceedsMaxValues = (
  values: unknown[] | undefined,
  limits: FilterValueLimits | undefined
): limits is { maxValues: number } =>
  limits?.maxValues !== undefined &&
  values !== undefined &&
  values.length > limits.maxValues

export const isEmptyFilter = (filter: Filter) => {
  if (filter.operator === 'blank' || filter.operator === 'notBlank') {
    return false
  }

  if (
    filter.values &&
    filter.values.length > 0 &&
    filter.values.every(
      (value) => value !== '' && value !== undefined && value !== null
    )
  ) {
    return false
  }

  return true
}

export const isValidFilter = (filter: Filter, limits?: FilterValueLimits) => {
  return validateFilterField(filter, limits).length === 0
}

export const validateFilterField = (
  filter: Filter,
  limits?: FilterValueLimits
): { field: string; message: string }[] => {
  const errors = []

  if (!filter.operator) {
    errors.push({ field: filter.field, message: 'Operator is required' })
    return errors
  }

  if (isEmptyFilter(filter)) {
    errors.push({ field: filter.field, message: 'Value is required' })
  }

  if (exceedsMaxValues(filter.values, limits)) {
    errors.push({
      field: filter.field,
      message: tooManyValuesMessage(limits.maxValues),
    })
  }

  if (filter.type === 'number' && filter.operator === 'inRange') {
    if (filter.values && filter.values.length !== 2) {
      errors.push({ field: filter.field, message: 'Value is required' })
    }
  }

  return errors
}

import { FormFilter } from './types'

export const isEmptyFormFilter = (filter: FormFilter) => {
  if (filter.operator === 'blank' || filter.operator === 'notBlank') {
    return false
  }

  if (
    filter.values &&
    filter.values.length > 0 &&
    filter.values.every(
      (value) => value !== '' && value !== undefined && value !== null
    )
  ) {
    return false
  }

  return true
}

export const isValidFormFilter = (
  filter: FormFilter,
  limits?: FilterValueLimits
) => {
  return validateFormFilter(filter, limits).length === 0
}

export const validateFormFilter = (
  filter: FormFilter,
  limits?: FilterValueLimits
): string[] => {
  const errors = []

  if (!filter.operator) {
    errors.push('Operator is required')
    return errors
  }

  if (isEmptyFormFilter(filter)) {
    errors.push('Value is required')
  }

  if (exceedsMaxValues(filter.values, limits)) {
    errors.push(tooManyValuesMessage(limits.maxValues))
  }

  if (filter.type === 'number' && filter.operator === 'inRange') {
    if (filter.values && filter.values.length !== 2) {
      errors.push('Value is required')
    }
  }

  return errors
}

export const isFilter = (filter: FormFilter): filter is Filter => {
  return (
    filter.operator !== undefined &&
    filter.field !== undefined &&
    filter.type !== undefined
  )
}
