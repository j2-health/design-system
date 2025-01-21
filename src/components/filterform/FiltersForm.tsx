import { FieldArray, Formik, useFormikContext } from 'formik'
import { Form } from '../form/Form'
import { FilterField } from './FilterField'
import { Button } from '../button'
import { PlusCircle, Trash } from '@phosphor-icons/react'
import s from './FiltersForm.module.css'
import cx from 'classnames'
import { FilterForm, FilterConfig, FilterGroup } from '.'
import {
  isEmptyFilter,
  isValidFilter,
  validateFilterField,
} from './filterHelpers'
import { debounce } from 'lodash'
import { useEffect, useMemo, useReducer, useState } from 'react'
import { FilterInput } from './FilterInput'
import { FormFilter } from './types'
import { isParameterPropertyDeclaration } from 'typescript'

type Props = {
  filterConfigs: FilterConfig[]
  title?: string
  onSubmit: (values: FilterForm) => void
  initialValues?: FilterForm
  maxFiltersPerField?: number
}

export const DeprecatedFiltersForm = ({
  filterConfigs,
  title,
  onSubmit,
  initialValues,
  maxFiltersPerField = 5,
}: Props) => {
  const handleSubmit = (values: FilterForm) => {
    const nonEmptyFilters = values.filters.filter(
      (filter) => !isEmptyFilter(filter)
    )
    onSubmit({ filters: nonEmptyFilters })
  }

  return (
    <Formik<FilterForm>
      initialValues={
        initialValues ?? {
          filters: [
            {
              field: filterConfigs[0].field,
              type: filterConfigs[0].type,
              operator: undefined,
              values: [],
            },
          ],
        }
      }
      validateOnChange={false}
      validate={(values) => {
        if (values.filters.every((filter) => isEmptyFilter(filter))) {
          return
        }

        return values.filters
          .map((filter) => validateFilterField(filter))
          .flat()
      }}
      onSubmit={handleSubmit}
    >
      {({ isValid }) => (
        <Form className={s.j2FilterForm}>
          <div
            className={cx(
              s.filterFormFieldsContainer,
              'flex flex-col gap-4  p-4 mb-6'
            )}
          >
            {title && <span className={s.filterFormTitle}>{title}</span>}
            <FilterFormFields
              filterConfigs={filterConfigs}
              maxFiltersPerField={maxFiltersPerField}
            />
          </div>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" disabled={!isValid}>
              Apply Filters
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

type FilterFormFieldsProps = {
  filterConfigs: FilterConfig[]
  maxFiltersPerField: number
}

const FilterFormFields = ({
  filterConfigs,
  maxFiltersPerField,
}: FilterFormFieldsProps) => {
  const { values, setValues, validateForm } = useFormikContext<FilterForm>()

  const debouncedValidateForm = debounce(validateForm, 500)

  const filledFilters = values.filters.filter((f) => !isEmptyFilter(f))

  const availableFilterConfigs = useMemo(() => {
    const filterFieldCounts = filledFilters.reduce(
      (acc, filter) => {
        acc[filter.field] = (acc[filter.field] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return filterConfigs.filter(
      (config) =>
        !filterFieldCounts[config.field] ||
        filterFieldCounts[config.field] < maxFiltersPerField
    )
  }, [
    filterConfigs,
    filledFilters.map((f) => f.field).join(','),
    maxFiltersPerField,
  ])

  useEffect(() => {
    debouncedValidateForm()
  }, [values])

  return (
    <div>
      <FieldArray
        name="filters"
        render={(arrayHelpers) => (
          <div className={cx('flex flex-col gap-4')}>
            {values.filters.map((filter, index) => (
              <div
                key={`filter-field-${index}-${filter.field}-${filter.operator}`}
                className="flex items-center justify-between"
              >
                <FilterField
                  filterConfigs={availableFilterConfigs}
                  index={index}
                  className="flex-1"
                />
                {index === 0 && values.filters.length === 1 ? (
                  <div className="w-8" />
                ) : (
                  <Button
                    icon={<Trash />}
                    onClick={() => arrayHelpers.remove(index)}
                    type="text"
                  />
                )}
              </div>
            ))}
            <div className="flex items-center">
              <Button
                icon={<PlusCircle />}
                onClick={() =>
                  arrayHelpers.push({
                    field: availableFilterConfigs[0].field,
                    type: availableFilterConfigs[0].type,
                    operator: undefined,
                    values: undefined,
                  })
                }
                disabled={
                  !values.filters.every((filter) => isValidFilter(filter))
                }
              >
                Add Rule
              </Button>
              {!values.filters.every((filter) => isEmptyFilter(filter)) && (
                <Button
                  type="text"
                  onClick={() =>
                    setValues({
                      filters: [
                        {
                          field: filterConfigs[0].field,
                          type: filterConfigs[0].type,
                          operator: undefined,
                          values: [],
                        },
                      ],
                    })
                  }
                >
                  Clear All Rules
                </Button>
              )}
            </div>
          </div>
        )}
      />
    </div>
  )
}

type FilterFormState = {
  filterGroups: FilterGroup[]
  newFilter: FormFilter | undefined
  isNewFilterInputOpen: boolean
}

type AddFilterAction = {
  type: 'addFilter'
  payload: FormFilter
}

type ClearAllFiltersAction = {
  type: 'clearAllFilters'
}

type ChangeFilterAction = {
  type: 'changeFilter'
  payload: {
    groupIndex: number
    filterIndex: number
    filter: FormFilter
  }
}

type SetNewFilterAction = {
  type: 'setNewFilter'
  payload: FormFilter
}

type AddNewFilterAction = {
  type: 'addNewFilter'
}

type Action =
  | AddFilterAction
  | ChangeFilterAction
  | ClearAllFiltersAction
  | SetNewFilterAction
  | AddNewFilterAction
const filterFormReducer = (state: FilterFormState, action: Action) => {
  const addFilter = (filter: FormFilter) => {
    const filterGroupIndex = state.filterGroups.findIndex(
      (filterGroup) => filterGroup.field === filter.field
    )

    if (filterGroupIndex !== -1) {
      state.filterGroups[filterGroupIndex].filters.push(filter)
    } else {
      state.filterGroups.push({ field: filter.field, filters: [filter] })
    }
  }

  switch (action.type) {
    case 'addNewFilter': {
      return {
        ...state,
        isNewFilterInputOpen: true,
      }
    }
    case 'addFilter': {
      if (action.payload.errors && action.payload.errors.length > 0) {
        return state
      }

      addFilter(action.payload)

      return {
        ...state,
        filterGroups: [...state.filterGroups],
        newFilter: undefined,
        isNewFilterInputOpen: false,
      }
    }
    case 'changeFilter': {
      if (
        action.payload.filter.errors &&
        action.payload.filter.errors.length > 0
      ) {
        return state
      }

      const { groupIndex, filterIndex, filter } = action.payload
      const prevFilter = state.filterGroups[groupIndex].filters[filterIndex]
      if (prevFilter.field === filter.field) {
        state.filterGroups[groupIndex].filters[filterIndex] = filter
      } else {
        addFilter(filter)
        state.filterGroups[groupIndex].filters.splice(filterIndex, 1)
      }

      return {
        ...state,
        filterGroups: [...state.filterGroups],
      }
    }
    case 'clearAllFilters': {
      return {
        ...state,
        filterGroups: [],
      }
    }
    case 'setNewFilter': {
      return {
        ...state,
        newFilter: action.payload,
      }
    }
    default:
      return state
  }
}

export const FiltersForm = ({ filterConfigs }: Props) => {
  const [{ filterGroups, newFilter, isNewFilterInputOpen }, dispatch] =
    useReducer(filterFormReducer, {
      filterGroups: [],
      newFilter: undefined,
      isNewFilterInputOpen: true,
    })

  const handleSubmit = () => {
    console.log('submitting', filterGroups)
  }

  return (
    <div className={cx(s.j2FilterForm)}>
      <div
        className={cx(
          s.filterFormFieldsContainer,
          'flex flex-col gap-4',
          'p-4 mb-6'
        )}
      >
        {filterGroups.map((filterGroup, groupIndex) => (
          <div key={filterGroup.field} className={cx('flex flex-col gap-4')}>
            {filterGroup.filters.map((filter, filterIndex) => (
              <FilterInput
                key={`${filter.field}-${filter.operator}-${filter.values.join('-')}`}
                value={filter}
                filterConfigs={filterConfigs}
                onBlur={(filter) => {
                  dispatch({
                    type: 'changeFilter',
                    payload: {
                      groupIndex,
                      filterIndex,
                      filter,
                    },
                  })
                }}
              />
            ))}
          </div>
        ))}
        {isNewFilterInputOpen && (
          <FilterInput
            key={JSON.stringify(filterGroups)}
            filterConfigs={filterConfigs}
            onChange={(filter) => {
              console.log({ filter })
              dispatch({ type: 'setNewFilter', payload: filter })
            }}
            onBlur={(filter) => {
              dispatch({ type: 'addFilter', payload: filter })
            }}
          />
        )}
        <div className="flex items-center">
          <Button
            icon={<PlusCircle />}
            onClick={() => dispatch({ type: 'addNewFilter' })}
            disabled={
              isNewFilterInputOpen &&
              newFilter &&
              newFilter.errors &&
              newFilter.errors.length > 0
            }
          >
            Add Rule
          </Button>
          <Button
            type="text"
            onClick={() => {
              dispatch({
                type: 'clearAllFilters',
              })
            }}
          >
            Clear All Rules
          </Button>
        </div>
      </div>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  )
}
