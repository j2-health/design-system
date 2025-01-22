import { renderHook, act } from '@testing-library/react'
import { useFiltersForm } from '../useFiltersForm'
import { Filter, FilterForm } from '../types'

describe('useFiltersForm', () => {
  const nameFilter: Filter = {
    field: 'name',
    type: 'text',
    operator: 'contains',
    values: ['test'],
  }

  const ageFilter: Filter = {
    field: 'age',
    type: 'number',
    operator: 'greaterThan',
    values: [18],
  }

  const initialValues: FilterForm = {
    filters: [nameFilter, ageFilter],
  }

  describe('initialize', () => {
    it('should initialize with empty state when no initial values provided', () => {
      const { result } = renderHook(() => useFiltersForm({}))

      expect(result.current.filterGroups).toEqual([])
      expect(result.current.newFilter).toBeUndefined()
      expect(result.current.isNewFilterInputOpen).toBe(true)
    })

    it('should initialize with provided initial values', () => {
      const initialValues: FilterForm = {
        filters: [nameFilter, ageFilter],
      }
      const { result } = renderHook(() => useFiltersForm({ initialValues }))

      expect(result.current.filterGroups).toEqual([
        {
          field: 'name',
          filters: [nameFilter],
        },
        {
          field: 'age',
          filters: [ageFilter],
        },
      ])
      expect(result.current.isNewFilterInputOpen).toBe(false)
    })
  })

  describe('addNewFilter', () => {
    it('should add new filter', () => {
      const { result } = renderHook(() => useFiltersForm({}))

      act(() => {
        result.current.dispatch({ type: 'addNewFilter', payload: nameFilter })
      })

      expect(result.current.filterGroups).toEqual([
        { field: 'name', filters: [nameFilter] },
      ])
      expect(result.current.isNewFilterInputOpen).toBe(false)
      expect(result.current.newFilter).toBeUndefined()
    })

    it('should not add invalid filter', () => {
      const { result } = renderHook(() => useFiltersForm({}))
      const invalidFilter = { ...nameFilter, errors: ['Invalid filter'] }

      act(() => {
        result.current.dispatch({
          type: 'changeNewFilter',
          payload: invalidFilter,
        })
        result.current.dispatch({
          type: 'addNewFilter',
          payload: invalidFilter,
        })
      })

      expect(result.current.filterGroups).toEqual([])
      expect(result.current.newFilter).toEqual(invalidFilter)
      expect(result.current.isNewFilterInputOpen).toBe(true)
    })

    it('should group filters with same field', () => {
      const { result } = renderHook(() =>
        useFiltersForm({
          initialValues: { filters: [nameFilter, ageFilter] },
        })
      )
      const anotherNameFilter: Filter = {
        field: 'name',
        type: 'text',
        operator: 'contains',
        values: ['another'],
      }

      act(() => {
        result.current.dispatch({
          type: 'addNewFilter',
          payload: anotherNameFilter,
        })
      })

      expect(result.current.filterGroups).toEqual([
        { field: 'name', filters: [nameFilter, anotherNameFilter] },
        { field: 'age', filters: [ageFilter] },
      ])
    })
  })

  describe('removeNewFilter', () => {
    it('should remove new filter', () => {
      const { result } = renderHook(() =>
        useFiltersForm({ initialValues: { filters: [nameFilter] } })
      )
      act(() => {
        result.current.dispatch({
          type: 'changeNewFilter',
          payload: nameFilter,
        })
        result.current.dispatch({ type: 'removeNewFilter' })
      })
      expect(result.current.newFilter).toBeUndefined()
      expect(result.current.isNewFilterInputOpen).toBe(false)
    })

    it('should open new filter input if there are no remaining filters', () => {
      const { result } = renderHook(() => useFiltersForm({}))
      act(() => {
        result.current.dispatch({
          type: 'changeNewFilter',
          payload: nameFilter,
        })
        result.current.dispatch({ type: 'removeNewFilter' })
      })
      expect(result.current.newFilter).toBeUndefined()
      expect(result.current.isNewFilterInputOpen).toBe(true)
    })
  })

  describe('updateFilter', () => {
    it('should update existing filter and re-group', () => {
      const { result } = renderHook(() =>
        useFiltersForm({ initialValues: { filters: [nameFilter, ageFilter] } })
      )
      const updatedFilter: Filter = {
        field: 'age',
        type: 'number',
        operator: 'lessThan',
        values: [44],
      }

      act(() => {
        result.current.dispatch({
          type: 'changeFilter',
          payload: {
            groupIndex: 0,
            filterIndex: 0,
            filter: updatedFilter,
          },
        })
        result.current.dispatch({
          type: 'updateFilter',
          payload: {
            groupIndex: 0,
            filterIndex: 0,
            filter: updatedFilter,
          },
        })
      })

      const ageFilterGroup = result.current.filterGroups.find(
        (group) => group.field === 'age'
      )
      expect(ageFilterGroup?.filters).toEqual([ageFilter, updatedFilter])

      const nameFilterGroup = result.current.filterGroups.find(
        (group) => group.field === 'name'
      )
      expect(nameFilterGroup?.filters).toEqual([])
    })
  })

  describe('removeFilter', () => {
    it('should remove filter', () => {
      const { result } = renderHook(() => useFiltersForm({ initialValues }))

      act(() => {
        result.current.dispatch({
          type: 'removeFilter',
          payload: {
            groupIndex: 0,
            filterIndex: 0,
          },
        })
      })

      expect(result.current.filterGroups[0].filters).toEqual([])
    })

    it('should open new filter input when all filters have been removed', () => {
      const { result } = renderHook(() =>
        useFiltersForm({ initialValues: { filters: [nameFilter] } })
      )

      act(() => {
        result.current.dispatch({
          type: 'removeFilter',
          payload: { groupIndex: 0, filterIndex: 0 },
        })
      })

      expect(result.current.filterGroups[0].filters).toEqual([])
      expect(result.current.isNewFilterInputOpen).toBe(true)
    })
  })

  describe('clearAllFilters', () => {
    it('should clear all filters and open new filter input', () => {
      const { result } = renderHook(() => useFiltersForm({ initialValues }))

      act(() => {
        result.current.dispatch({ type: 'clearAllFilters' })
      })

      expect(result.current.filterGroups).toEqual([])
      expect(result.current.isNewFilterInputOpen).toBe(true)
    })
  })

  describe('changeNewFilter', () => {
    it('should change new filter', () => {
      const { result } = renderHook(() => useFiltersForm({}))

      act(() => {
        result.current.dispatch({
          type: 'changeNewFilter',
          payload: nameFilter,
        })
      })

      expect(result.current.newFilter).toEqual(nameFilter)
    })
  })

  describe('isValid', () => {
    it('should update isValid when filters have errors', () => {
      const { result } = renderHook(() => useFiltersForm({}))
      const filterWithError = { ...nameFilter, errors: ['Invalid filter'] }

      act(() => {
        result.current.dispatch({ type: 'addNewFilter', payload: nameFilter })
        result.current.dispatch({
          type: 'changeFilter',
          payload: {
            groupIndex: 0,
            filterIndex: 0,
            filter: filterWithError,
          },
        })
      })
    })

    it('should be valid if there are no filters', () => {
      const { result } = renderHook(() => useFiltersForm({}))
      expect(result.current.isValid).toBe(true)
    })
  })
})
