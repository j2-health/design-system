import { FieldArray, Formik, useFormikContext } from 'formik'
import { Form } from '../form/Form'
import { FilterField } from './FilterField'
import { Button } from '../button'
import { PlusCircle, Trash } from '@phosphor-icons/react'
import s from './FiltersForm.module.css'
import cx from 'classnames'
import { FilterForm, FilterConfig } from '.'
import {
  isEmptyFilter,
  isFilter,
  isValidFilter,
  validateFilterField,
} from './filterHelpers'
import { debounce } from 'lodash'
import { useEffect, useMemo } from 'react'
import { FilterInput } from './FilterInput'
import { useFiltersForm } from './useFiltersForm'

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

export const FiltersForm = ({
  filterConfigs,
  onSubmit,
  initialValues,
}: Props) => {
  const { dispatch, filterGroups, isNewFilterInputOpen, isValid } =
    useFiltersForm({
      initialValues,
    })

  const handleSubmit = () => {
    onSubmit({
      filters: filterGroups
        .flatMap((group) => group.filters)
        .filter((filter) => isFilter(filter))
        .filter((filter) => !isEmptyFilter(filter)),
    })
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
        {filterGroups.map((filterGroup, groupIndex) =>
          filterGroup.filters.length > 0 ? (
            <div key={filterGroup.field} className={cx('flex flex-col gap-4')}>
              {filterGroup.filters.map((filter, filterIndex) => (
                <div
                  key={`${groupIndex}:${filterIndex}-input-container`}
                  className="flex items-center justify-between"
                >
                  <FilterInput
                    key={`${groupIndex}:${filterIndex}`}
                    value={filter}
                    filterConfigs={filterConfigs}
                    className="flex-1"
                    onChange={(filter) => {
                      dispatch({
                        type: 'changeFilter',
                        payload: {
                          groupIndex,
                          filterIndex,
                          filter,
                        },
                      })
                    }}
                    onBlur={(filter) => {
                      dispatch({
                        type: 'updateFilter',
                        payload: {
                          groupIndex,
                          filterIndex,
                          filter,
                        },
                      })
                    }}
                  />
                  <Button
                    type="text"
                    icon={<Trash />}
                    onClick={() =>
                      dispatch({
                        type: 'removeFilter',
                        payload: { groupIndex, filterIndex },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          ) : null
        )}
        {isNewFilterInputOpen && (
          <div className="flex items-center justify-between">
            <FilterInput
              key={JSON.stringify(filterGroups)}
              filterConfigs={filterConfigs}
              className="flex-1"
              onChange={(filter) => {
                dispatch({ type: 'changeNewFilter', payload: filter })
              }}
              onBlur={(filter) => {
                dispatch({ type: 'addNewFilter', payload: filter })
              }}
            />
            <div className="w-8" />
          </div>
        )}
        <div className="flex items-center">
          <Button
            icon={<PlusCircle />}
            onClick={() => dispatch({ type: 'openNewFilterInput' })}
            disabled={isNewFilterInputOpen || !isValid}
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
      <div className="flex justify-end">
        <Button onClick={handleSubmit} type="primary" disabled={!isValid}>
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
