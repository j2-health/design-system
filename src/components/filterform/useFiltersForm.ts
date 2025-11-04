import { useReducer } from 'react'
import { FilterForm, FilterGroup, FormFilter } from './types'
import cloneDeep from 'lodash/cloneDeep'
import { isEmptyFormFilter } from './filterHelpers'

type UseFiltersFormInput = {
  initialValues?: FilterForm
}

type UseFiltersFormOutput = {
  dispatch: (action: Action) => void
  filterGroups: FilterGroup[]
  newFilter: FormFilter | undefined
  isNewFilterInputOpen: boolean
  isValid: boolean
  isEmpty: boolean
}

type FilterFormState = {
  filterGroups: FilterGroup[]
  newFilter: FormFilter | undefined
  isNewFilterInputOpen: boolean
}

type InitializeAction = {
  type: 'initialize'
  payload: FilterForm | undefined
}

type OpenNewFilterInputAction = {
  type: 'openNewFilterInput'
}

type AddNewFilterAction = {
  type: 'addNewFilter'
  payload: FormFilter
}

type ChangeNewFilterAction = {
  type: 'changeNewFilter'
  payload: FormFilter
}

type RemoveNewFilterAction = {
  type: 'removeNewFilter'
}

type ClearAllFiltersAction = {
  type: 'clearAllFilters'
}

type UpdateFilterAction = {
  type: 'updateFilter'
  payload: {
    groupIndex: number
    filterIndex: number
    filter: FormFilter
  }
}

type ChangeFilterAction = {
  type: 'changeFilter'
  payload: {
    groupIndex: number
    filterIndex: number
    filter: FormFilter
  }
}

type RemoveFilterAction = {
  type: 'removeFilter'
  payload: {
    groupIndex: number
    filterIndex: number
  }
}

type Action =
  | AddNewFilterAction
  | UpdateFilterAction
  | ClearAllFiltersAction
  | ChangeNewFilterAction
  | OpenNewFilterInputAction
  | ChangeFilterAction
  | RemoveFilterAction
  | InitializeAction
  | RemoveNewFilterAction

const copyFilterGroups = (filterGroups: FilterGroup[]): FilterGroup[] => {
  return cloneDeep(filterGroups)
}

const addFilter = (
  filter: FormFilter,
  filterGroups: FilterGroup[]
): FilterGroup[] => {
  const copy = copyFilterGroups(filterGroups)
  const filterGroupIndex = copy.findIndex(
    (filterGroup) => filterGroup.field === filter.field
  )

  if (filterGroupIndex === -1) {
    copy.push({ field: filter.field, filters: [filter] })
  } else {
    copy[filterGroupIndex].filters.push(filter)
  }

  return copy
}

const removeFilter = (
  groupIndex: number,
  filterIndex: number,
  filterGroups: FilterGroup[]
): FilterGroup[] => {
  const copy = copyFilterGroups(filterGroups)
  copy[groupIndex].filters.splice(filterIndex, 1)

  return copy.filter((group) => group.filters.length > 0)
}

const filterFormReducer = (state: FilterFormState, action: Action) => {
  switch (action.type) {
    case 'initialize': {
      const filterGroups = action.payload?.filters.reduce(
        (acc, filter) => {
          return addFilter(filter, acc)
        },
        [...state.filterGroups]
      )

      return {
        ...state,
        filterGroups: filterGroups ?? [],
        isNewFilterInputOpen: !filterGroups?.length,
      }
    }
    case 'openNewFilterInput': {
      return {
        ...state,
        isNewFilterInputOpen: true,
      }
    }
    case 'addNewFilter': {
      if (action.payload.errors && action.payload.errors.length > 0) {
        return state
      }

      const filterGroups = addFilter(action.payload, state.filterGroups)

      return {
        ...state,
        filterGroups,
        newFilter: undefined,
        isNewFilterInputOpen: false,
      }
    }
    case 'changeNewFilter': {
      return {
        ...state,
        newFilter: action.payload,
      }
    }
    case 'removeNewFilter': {
      const allFiltersRemoved = state.filterGroups.every(
        (group) => group.filters.length === 0
      )
      return {
        ...state,
        newFilter: undefined,
        isNewFilterInputOpen: allFiltersRemoved,
      }
    }
    case 'updateFilter': {
      const { groupIndex, filterIndex, filter } = action.payload
      let filterGroups = copyFilterGroups(state.filterGroups)
      const groupField = filterGroups[groupIndex].field

      if (groupField === filter.field) {
        filterGroups[groupIndex].filters[filterIndex] = filter
      } else {
        filterGroups = removeFilter(groupIndex, filterIndex, filterGroups)
        filterGroups = addFilter(filter, filterGroups)
      }

      return {
        ...state,
        filterGroups,
      }
    }
    case 'changeFilter': {
      const { groupIndex, filterIndex, filter } = action.payload
      const filterGroups = copyFilterGroups(state.filterGroups)
      filterGroups[groupIndex].filters[filterIndex] = filter

      return {
        ...state,
        filterGroups,
      }
    }
    case 'removeFilter': {
      const { groupIndex, filterIndex } = action.payload

      const filterGroups = removeFilter(
        groupIndex,
        filterIndex,
        state.filterGroups
      )

      return {
        ...state,
        filterGroups,
        isNewFilterInputOpen:
          state.isNewFilterInputOpen || filterGroups.length === 0,
      }
    }
    case 'clearAllFilters': {
      return {
        ...state,
        filterGroups: [],
        isNewFilterInputOpen: true,
      }
    }
    default:
      return state
  }
}

export const useFiltersForm = ({
  initialValues,
}: UseFiltersFormInput): UseFiltersFormOutput => {
  const [{ filterGroups, newFilter, isNewFilterInputOpen }, dispatch] =
    useReducer(
      filterFormReducer,
      {
        filterGroups: [],
        newFilter: undefined,
        isNewFilterInputOpen: true,
      },
      (state) => {
        return filterFormReducer(state, {
          type: 'initialize',
          payload: initialValues,
        })
      }
    )

  const isValid =
    (filterGroups.length === 0 ||
      filterGroups.every((group) =>
        group.filters.every(
          (filter) => filter.errors && filter.errors.length === 0
        )
      )) &&
    (newFilter?.errors ? newFilter.errors.length === 0 : true)

  const isEmpty =
    filterGroups.length === 0 &&
    (newFilter ? isEmptyFormFilter(newFilter) : true)

  return {
    dispatch,
    filterGroups,
    newFilter,
    isNewFilterInputOpen,
    isValid,
    isEmpty,
  }
}
