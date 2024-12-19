import * as React from 'react'
import { Select } from '../select'
import { useFilterField } from './useFilterField'
import { Input, InputNumber } from 'antd'
import { Field, FieldProps } from 'formik'

type FilterType = 'select' | 'number' | 'text'

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
    | 'between'
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
  field: undefined
  type: undefined
  operator: undefined
  values: undefined
}

export type Filter = SelectFilter | NumberFilter | TextFilter | EmptyFilter

type FilterFieldProps = {
  filterConfigs: FilterConfig[]
  index: number
  filter: Filter
}

export const FilterField = ({
  filterConfigs,
  index,
  filter,
}: FilterFieldProps) => {
  const {
    formKey,
    operatorOptions,
    valueInputConfig,
    handleFieldChange,
    handleOperatorChange,
  } = useFilterField({ filterConfigs, filter, index })

  const fieldOptions = React.useMemo(() => {
    return filterConfigs.map((filter) => ({
      label: filter.label,
      value: filter.field,
    }))
  }, [filterConfigs])

  return (
    <div className="grid grid-cols-3 gap-2">
      <Select
        options={fieldOptions}
        name={`${formKey}.field`}
        className="w-full"
        onChange={handleFieldChange}
      />
      <Select
        options={operatorOptions}
        name={`${formKey}.operator`}
        className="w-full"
        onChange={handleOperatorChange}
      />
      {valueInputConfig?.type === 'select' && (
        <Select
          options={valueInputConfig.valueOptions}
          name={`${formKey}.values`}
          className="w-full"
          mode="multiple"
          allowClear
        />
      )}
      {valueInputConfig?.type === 'number' && (
        <div className="flex gap-2">
          {Array.from({ length: valueInputConfig.inputCount }).map(
            (_, index) => (
              <React.Fragment key={`${formKey}.values.${index}`}>
                {index !== 0 && <span>and</span>}
                <Field name={`${formKey}.values.${index}`}>
                  {({ field, form }: FieldProps) => (
                    <InputNumber
                      {...field}
                      onChange={(value) =>
                        form.setFieldValue(field.name, value)
                      }
                      className="w-full"
                    />
                  )}
                </Field>
              </React.Fragment>
            )
          )}
        </div>
      )}
      {valueInputConfig?.type === 'text' && (
        <Field name={`${formKey}.values.0`}>
          {({ field, form }: FieldProps) => (
            <Input
              {...field}
              onChange={(e) => form.setFieldValue(field.name, e.target.value)}
              className="w-full"
            />
          )}
        </Field>
      )}
    </div>
  )
}
