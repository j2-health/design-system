import { Filter } from './types'
import { validateFilterField } from './validateFilterField'

describe('validateFilterField', () => {
  it('should return operator required error when operator is undefined', () => {
    const filter: Filter = {
      field: 'test',
      type: 'text',
      operator: undefined,
      values: undefined,
    }

    const errors = validateFilterField(filter)

    expect(errors).toEqual([{ field: 'test', message: 'Operator is required' }])
  })

  it('should return value required error when values are empty and operator is not blank/notBlank', () => {
    const filter: Filter = {
      field: 'test',
      type: 'text',
      operator: 'contains',
      values: [],
    }

    const errors = validateFilterField(filter)

    expect(errors).toEqual([{ field: 'test', message: 'Value is required' }])
  })

  it('should return value required error when values are blank/undefined/null and operator is not blank/notBlank', () => {
    const filter: Filter = {
      field: 'test',
      type: 'text',
      operator: 'contains',
      values: [''],
    }

    const errors = validateFilterField(filter)
    expect(errors).toEqual([{ field: 'test', message: 'Value is required' }])
  })

  it('should not return error when operator is blank and values are empty', () => {
    const filter: Filter = {
      field: 'test',
      type: 'text',
      operator: 'blank',
      values: [],
    }

    const errors = validateFilterField(filter)

    expect(errors).toEqual([])
  })

  it('should return value required error for number inRange with wrong number of values', () => {
    const filter: Filter = {
      field: 'test',
      type: 'number',
      operator: 'inRange',
      values: [1],
    }

    const errors = validateFilterField(filter)

    expect(errors).toEqual([{ field: 'test', message: 'Value is required' }])
  })

  it('should not return error for number inRange with exactly 2 values', () => {
    const filter: Filter = {
      field: 'test',
      type: 'number',
      operator: 'inRange',
      values: [1, 2],
    }

    const errors = validateFilterField(filter)

    expect(errors).toEqual([])
  })
})
