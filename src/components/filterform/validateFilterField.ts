import { Filter } from './types'

export const validateFilterField = (
  filter: Filter
): { field: string; message: string }[] => {
  const errors = []

  if (!filter.operator) {
    errors.push({ field: filter.field, message: 'Operator is required' })
    return errors
  }

  if (
    !['blank', 'notBlank'].includes(filter.operator) &&
    !(
      filter.values &&
      filter.values.length > 0 &&
      filter.values.every(
        (value) => value !== '' && value !== undefined && value !== null
      )
    )
  ) {
    errors.push({ field: filter.field, message: 'Value is required' })
  }

  if (filter.type === 'number' && filter.operator === 'inRange') {
    if (filter.values && filter.values.length !== 2) {
      errors.push({ field: filter.field, message: 'Value is required' })
    }
  }

  return errors
}
