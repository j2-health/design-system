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
