export type FilterForm = {
  filters: Filter[]
}

export type FormFilter = {
  field: string
  type: FilterType
  operator: Operator | undefined
  values: (number | string | null | undefined)[]
  errors?: string[]
}

export type FilterGroup = {
  field: string
  filters: FormFilter[]
}

export type FilterType = 'select' | 'number' | 'text'
export type SelectOptionsType = { label: string; value: string }[]
export type NumberOptionsType = { max: number; min: number; step: number }

export type FilterConfig = {
  label: string
  field: string
  type: FilterType
  disabled?: boolean
  options?: SelectOptionsType | NumberOptionsType
}

export type Operator =
  | 'equals'
  | 'notEqual'
  | 'blank'
  | 'notBlank'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'inRange'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'

type SelectFilter = {
  field: string
  type: 'select'
  operator:
    | Extract<Operator, 'equals' | 'notEqual' | 'blank' | 'notBlank'>
    | undefined
  values: string[]
}

type NumberFilter = {
  field: string
  type: 'number'
  operator:
    | Extract<Operator, 'equals' | 'notEqual' | 'blank' | 'notBlank'>
    | 'greaterThan'
    | 'greaterThanOrEqual'
    | 'lessThan'
    | 'lessThanOrEqual'
    | 'inRange'
    | undefined
  values: number[]
}

type TextFilter = {
  field: string
  type: 'text'
  operator:
    | Extract<
        Operator,
        | 'contains'
        | 'notContains'
        | 'startsWith'
        | 'endsWith'
        | 'blank'
        | 'notBlank'
      >
    | undefined
  values: string[]
}

export type Filter = SelectFilter | NumberFilter | TextFilter
