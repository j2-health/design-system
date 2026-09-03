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
  // Opt-in operator list for this field. Unset, the field offers its type's
  // standard operators (`TypeToOperatorOptions`). Set it to add the
  // multi-value text operators (`isAnyOf` / `isNoneOf`) or to narrow the
  // choices; operators the type doesn't support are ignored. The multi-value
  // operators are opt-in because a consumer's backend must understand them —
  // an unknown text operator is silently dropped by some Q-builders, which
  // leaves a table looking filtered when it isn't.
  operators?: Operator[]
  // Upper bound on the number of values a multi-value text rule may hold. The
  // value input shows a counter and the form refuses to apply past it. Unset
  // means unlimited.
  maxValues?: number
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
  // Multi-value exact match (text fields only, opt-in via
  // `FilterConfig.operators`): `values` holds every token, one chip each.
  | 'isAnyOf'
  | 'isNoneOf'

type SelectFilter = {
  field: string
  type: 'select'
  operator:
    Extract<Operator, 'equals' | 'notEqual' | 'blank' | 'notBlank'> | undefined
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
        | 'isAnyOf'
        | 'isNoneOf'
      >
    | undefined
  values: string[]
}

export type Filter = SelectFilter | NumberFilter | TextFilter
