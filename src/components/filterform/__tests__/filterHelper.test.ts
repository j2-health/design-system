import { Filter, FormFilter } from '../types'
import { isEmptyFilter, isFilter, validateFilterField } from '../filterHelpers'

describe('validateFilterField', () => {
  it('should return operator required error when operator is undefined', () => {
    const filter: Filter = {
      field: 'test',
      type: 'text',
      operator: undefined,
      values: [],
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

describe('isEmptyFilter', () => {
  it('should return true when all fields are empty', () => {
    const filter: Filter = {
      field: 'test',
      type: 'text',
      operator: undefined,
      values: [],
    }

    expect(isEmptyFilter(filter)).toBe(true)
  })

  it('should return false if operator is blank', () => {
    const filter: Filter = {
      field: 'test',
      type: 'text',
      operator: 'blank',
      values: [],
    }
    expect(isEmptyFilter(filter)).toBe(false)
  })

  it('should return false if values are not empty', () => {
    const filter: Filter = {
      field: 'test',
      type: 'text',
      operator: 'blank',
      values: ['test'],
    }
    expect(isEmptyFilter(filter)).toBe(false)
  })
})

describe('isFilter', () => {
  it('should return true when all fields are defined', () => {
    const filter: FormFilter = {
      field: 'test',
      type: 'text',
      operator: 'contains',
      values: [],
      errors: [],
    }
    expect(isFilter(filter)).toBe(true)
  })

  it('should return false when any non value field is undefined', () => {
    const filter: FormFilter = {
      field: 'test',
      type: 'text',
      operator: undefined,
      values: [],
      errors: [],
    }
    expect(isFilter(filter)).toBe(false)
  })
})
