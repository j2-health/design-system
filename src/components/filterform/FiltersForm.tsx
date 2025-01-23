import { Button } from '../button'
import { PlusCircle, Trash } from '@phosphor-icons/react'
import s from './FiltersForm.module.css'
import cx from 'classnames'
import { FilterForm, FilterConfig } from '.'
import { isEmptyFilter, isFilter } from './filterHelpers'
import { useMemo } from 'react'
import { FilterInput } from './FilterInput'
import { useFiltersForm } from './useFiltersForm'
import { FilterGroup } from './FilterGroup'

type Props = {
  filterConfigs: FilterConfig[]
  title?: string
  onSubmit: (values: FilterForm) => void
  initialValues?: FilterForm
  maxFiltersPerField?: number
}

export const FiltersForm = ({
  title,
  filterConfigs,
  onSubmit,
  initialValues,
  maxFiltersPerField = 5,
}: Props) => {
  const { dispatch, filterGroups, isNewFilterInputOpen, isValid, isEmpty } =
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

  const availableFilterConfigs = useMemo(() => {
    const filterFieldCounts = filterGroups.reduce(
      (acc, filterGroup) => {
        acc[filterGroup.field] = filterGroup.filters.length
        return acc
      },
      {} as Record<string, number>
    )

    return filterConfigs.map((config) => ({
      ...config,
      disabled: (filterFieldCounts[config.field] || 0) >= maxFiltersPerField,
    }))
  }, [
    filterConfigs,
    filterGroups.map((g) => `${g.field}-${g.filters.length}`).join(','),
    maxFiltersPerField,
  ])

  return (
    <div className={cx(s.j2FilterForm)}>
      <div
        className={cx(
          s.filterFormFieldsContainer,
          'flex flex-col gap-4',
          'p-4 mb-6'
        )}
      >
        {title && <span className={s.filterFormTitle}>{title}</span>}
        {filterGroups.map((filterGroup, groupIndex) => (
          <div
            key={`filter-group-${filterGroup.field}-${filterGroup.filters.length}`}
            className="flex gap-3"
          >
            {groupIndex > 0 ? (
              <span
                className={cx(
                  s.filterFormConjunction,
                  filterGroup.filters.length > 1 && 'pt-3'
                )}
              >
                and
              </span>
            ) : null}
            <FilterGroup
              filterGroup={filterGroup}
              groupIndex={groupIndex}
              filterConfigs={availableFilterConfigs}
              className="grow"
              onChange={(filter, filterIndex) => {
                dispatch({
                  type: 'changeFilter',
                  payload: { groupIndex, filterIndex, filter },
                })
              }}
              onDone={(filter, filterIndex) => {
                dispatch({
                  type: 'updateFilter',
                  payload: { groupIndex, filterIndex, filter },
                })
              }}
              onRemove={(filterIndex) => {
                dispatch({
                  type: 'removeFilter',
                  payload: { groupIndex, filterIndex },
                })
              }}
            />
          </div>
        ))}
        {isNewFilterInputOpen && (
          <div className="flex gap-3">
            {filterGroups.length > 0 ? (
              <span className={cx(s.filterFormConjunction)}>and</span>
            ) : null}
            <div className={cx('flex items-center justify-between', 'grow')}>
              <FilterInput
                key={JSON.stringify(filterGroups)}
                filterConfigs={availableFilterConfigs}
                className="flex-1"
                onChange={(filter) => {
                  dispatch({ type: 'changeNewFilter', payload: filter })
                }}
                onBlur={(filter) => {
                  dispatch({ type: 'addNewFilter', payload: filter })
                }}
              />
              <div className="mr-3">
                {filterGroups.length > 0 ? (
                  <Button
                    type="text"
                    icon={<Trash />}
                    onClick={() => dispatch({ type: 'removeNewFilter' })}
                  />
                ) : (
                  <div className="w-8" />
                )}
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center">
          <Button
            icon={<PlusCircle />}
            onClick={() => dispatch({ type: 'openNewFilterInput' })}
            disabled={!isValid}
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
        <Button
          onClick={handleSubmit}
          type="primary"
          disabled={isEmpty ? false : !isValid}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
