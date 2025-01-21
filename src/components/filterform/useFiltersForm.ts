import { useReducer } from 'react'
import { FilterForm, FilterGroup, FormFilter } from './types'

type UseFiltersFormInput = {
  initialValues?: FilterForm
}

type UseFiltersFormOutput = {
  dispatch: (action: Action) => void
  filterGroups: FilterGroup[]
  newFilter: FormFilter | undefined
  isNewFilterInputOpen: boolean
  isValid: boolean
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
    case 'initialize': {
      action.payload?.filters.forEach((filter) => {
        addFilter(filter)
      })

      return {
        ...state,
        filterGroups: [...state.filterGroups],
        isNewFilterInputOpen: true,
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

      addFilter(action.payload)

      return {
        ...state,
        filterGroups: [...state.filterGroups],
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
    case 'changeFilter': {
      const { groupIndex, filterIndex, filter } = action.payload
      state.filterGroups[groupIndex].filters[filterIndex] = filter
      return {
        ...state,
        filterGroups: [...state.filterGroups],
      }
    }
    case 'removeFilter': {
      const { groupIndex, filterIndex } = action.payload
      state.filterGroups[groupIndex].filters.splice(filterIndex, 1)

      const allFiltersRemoved = state.filterGroups.every(
        (group) => group.filters.length === 0
      )

      if (allFiltersRemoved) {
        return {
          ...state,
          isNewFilterInputOpen: allFiltersRemoved,
        }
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
    filterGroups.length === 0 ||
    filterGroups.every((group) =>
      group.filters.every(
        (filter) => filter.errors && filter.errors.length === 0
      )
    )

  return {
    dispatch,
    filterGroups,
    newFilter,
    isNewFilterInputOpen,
    isValid,
  }
}
