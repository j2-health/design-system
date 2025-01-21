import { Button } from '../button'
import { Trash } from '@phosphor-icons/react'
import { FilterInput } from './FilterInput'
import cx from 'classnames'
import s from './FiltersForm.module.css'
import { FilterConfig } from '.'
import { FormFilter } from './types'

type FilterGroupProps = {
  filterGroup: {
    field: string
    filters: FormFilter[]
  }
  groupIndex: number
  filterConfigs: FilterConfig[]
  className?: string
  onRemove: (index: number) => void
  onChange: (filter: FormFilter, index: number) => void
  onDone: (filter: FormFilter, index: number) => void
}

export const FilterGroup = ({
  filterGroup,
  groupIndex,
  filterConfigs,
  className,
  onRemove,
  onChange,
  onDone,
}: FilterGroupProps) => {
  return filterGroup.filters.length > 0 ? (
    <div
      key={filterGroup.field}
      className={cx(
        'flex flex-col gap-4',
        filterGroup.filters.length > 1 && s.filterFormGroupContainer,
        filterGroup.filters.length > 1 && 'p-3',
        filterGroup.filters.length === 1 && 'pr-3',
        className
      )}
    >
      {filterGroup.filters.map((filter, filterIndex) => (
        <div
          key={`${groupIndex}:${filterIndex}-input-container`}
          className="flex items-center justify-between"
        >
          {filterGroup.filters.length > 1 && filterIndex > 0 && (
            <span className={cx(s.filterFormConjunction, 'mr-3')}>and</span>
          )}
          <FilterInput
            key={`${groupIndex}:${filterIndex}`}
            value={filter}
            filterConfigs={filterConfigs}
            className="flex-1"
            onChange={(filter) => onChange(filter, filterIndex)}
            onBlur={(filter) => onDone(filter, filterIndex)}
          />
          <Button
            type="text"
            icon={<Trash />}
            onClick={() => onRemove(filterIndex)}
          />
        </div>
      ))}
    </div>
  ) : null
}
