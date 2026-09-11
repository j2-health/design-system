import { Button } from '../button'
import { PlusCircleIcon, TrashIcon } from '@phosphor-icons/react'
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
  const {
    dispatch,
    filterGroups,
    newFilter,
    isNewFilterInputOpen,
    isValid,
    isEmpty,
  } = useFiltersForm({
    initialValues,
  })

  const handleSubmit = () => {
    // A rule still in the "new rule" input only joins `filterGroups` when
    // that input blurs. Clicking Apply does blur it, but the commit is not
    // guaranteed to have landed by the time this handler reads the groups
    // (the inputs defer their blur so a chip committed during it isn't
    // lost), so a user who types a value and clicks Apply straight away
    // would submit without the rule they just wrote. `newFilter` tracks
    // that input on every change, so include it here when it is complete;
    // once the blur commit lands it is cleared, so it is never counted twice.
    // `errors` lives on the form-side FormFilter, so it is read before
    // `isFilter` narrows to the public Filter type.
    const pending =
      newFilter &&
      (newFilter.errors?.length ?? 0) === 0 &&
      isFilter(newFilter) &&
      !isEmptyFilter(newFilter)
        ? [newFilter]
        : []
    onSubmit({
      filters: [
        ...filterGroups
          .flatMap((group) => group.filters)
          .filter((filter) => isFilter(filter))
          .filter((filter) => !isEmptyFilter(filter)),
        ...pending,
      ],
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
            className={cx('flex gap-3', {
              'items-center': filterGroup.filters.length === 1,
            })}
          >
            {groupIndex > 0 ? (
              <span
                className={cx(s.filterFormConjunction, {
                  'pt-4': filterGroup.filters.length > 1,
                })}
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
          <div className={cx('flex gap-3 items-center')}>
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
                    icon={<TrashIcon />}
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
            icon={<PlusCircleIcon />}
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
