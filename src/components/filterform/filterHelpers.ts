import { Filter } from './types'

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

export const isValidFilter = (filter: Filter) => {
  return validateFilterField(filter).length === 0
}

export const validateFilterField = (
  filter: Filter
): { field: string; message: string }[] => {
  const errors = []

  if (!filter.operator) {
    errors.push({ field: filter.field, message: 'Operator is required' })
    return errors
  }

  if (isEmptyFilter(filter)) {
    errors.push({ field: filter.field, message: 'Value is required' })
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

export const isValidFormFilter = (filter: FormFilter) => {
  return validateFormFilter(filter).length === 0
}

export const validateFormFilter = (filter: FormFilter): string[] => {
  const errors = []

  if (!filter.operator) {
    errors.push('Operator is required')
    return errors
  }

  if (isEmptyFormFilter(filter)) {
    errors.push('Value is required')
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
