export type FilterForm = {
  filters: Filter[]
}

export type FilterType = 'select' | 'number' | 'text'

export type FilterConfig = {
  label: string
  field: string
  type: FilterType
  options?: { label: string; value: string }[]
}

type SelectFilter = {
  field: string
  type: 'select'
  operator: 'equals' | 'notEqual' | 'blank' | 'notBlank'
  values: string[]
}

type NumberFilter = {
  field: string
  type: 'number'
  operator:
    | 'equals'
    | 'notEqual'
    | 'blank'
    | 'notBlank'
    | 'greaterThan'
    | 'greaterThanOrEqual'
    | 'lessThan'
    | 'lessThanOrEqual'
    | 'inRange'
  values: number[]
}

type TextFilter = {
  field: string
  type: 'text'
  operator:
    | 'contains'
    | 'notContains'
    | 'startsWith'
    | 'endsWith'
    | 'blank'
    | 'notBlank'
  values: string[]
}

type EmptyFilter = {
  field: string
  type: FilterType
  operator: undefined
  values: undefined
}

export type Filter = SelectFilter | NumberFilter | TextFilter | EmptyFilter
