import { Formik } from 'formik'
import { useFilterField, UseFilterFieldInputs } from '../useFilterField'
import { act, renderHook } from '@testing-library/react'
import { Filter, FilterConfig } from '../types'

describe('useFilterField', () => {
  const filterConfigs: FilterConfig[] = [
    {
      field: 'number_field',
      type: 'number',
      label: 'Number Field',
    },
    {
      field: 'text_field',
      type: 'text',
      label: 'Text Field',
    },
    {
      field: 'select_field',
      type: 'select',
      label: 'Select Field',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ],
    },
  ]

  const renderWithFormik = (
    useFilterFieldInputs: UseFilterFieldInputs,
    initialFormFilters: Filter[]
  ) => {
    return act(() =>
      renderHook(() => useFilterField(useFilterFieldInputs), {
        wrapper: ({ children }) => (
          <Formik
            initialValues={{ filters: initialFormFilters }}
            onSubmit={() => {}}
          >
            {children}
          </Formik>
        ),
      })
    )
  }

  describe('initialization', () => {
    it('should initialize with the first filter config when filter does not have an operator selected', async () => {
      const { result } = await renderWithFormik(
        {
          filterConfigs: filterConfigs,
          index: 0,
        },
        [
          {
            field: filterConfigs[0].field,
            type: filterConfigs[0].type,
            operator: undefined,
            values: undefined,
          },
        ]
      )

      expect(result.current.config).toEqual(filterConfigs[0])
      expect(result.current.filterFormValues.filters[0]).toEqual({
        field: filterConfigs[0].field,
        type: filterConfigs[0].type,
        operator: 'equals',
        values: undefined,
      })
    })

    it('should initialize with the selected operator when filter has an operator selected', async () => {
      const { result } = await renderWithFormik(
        {
          filterConfigs: filterConfigs,
          index: 0,
        },
        [
          {
            field: 'number_field',
            type: 'number',
            operator: 'blank',
            values: [],
          },
        ]
      )

      expect(result.current.valueInputConfig).toBeUndefined()
      expect(result.current.filterFormValues.filters[0]).toEqual({
        field: 'number_field',
        type: 'number',
        operator: 'blank',
        values: [],
      })
    })
  })

  describe('number fields', () => {
    const NUMBER_FIELD_CONFIG_INDEX = 0
    it('initializes filter form configurations based on type', async () => {
      const { result } = await renderWithFormik(
        {
          filterConfigs: filterConfigs,
          index: 0,
        },
        [
          {
            field: filterConfigs[NUMBER_FIELD_CONFIG_INDEX].field,
            type: filterConfigs[NUMBER_FIELD_CONFIG_INDEX].type,
            operator: undefined,
            values: undefined,
          },
        ]
      )

      expect(result.current.config).toEqual(
        filterConfigs[NUMBER_FIELD_CONFIG_INDEX]
      )
      expect(result.current.operatorOptions.map((o) => o.value)).toEqual([
        'equals',
        'notEqual',
        'greaterThan',
        'greaterThanOrEqual',
        'lessThan',
        'lessThanOrEqual',
        'blank',
        'notBlank',
        'inRange',
      ])
      expect(result.current.valueInputConfig).toEqual({
        type: 'number',
        inputCount: 1,
      })
      expect(result.current.filterFormValues.filters[0]).toEqual({
        field: 'number_field',
        type: 'number',
        operator: 'equals',
        values: undefined,
      })
    })

    it('when the operator is between, the values input should have two inputs', async () => {
      const { result } = await renderWithFormik(
        {
          filterConfigs: filterConfigs,
          index: 0,
        },
        [
          {
            field: filterConfigs[NUMBER_FIELD_CONFIG_INDEX].field,
            type: filterConfigs[NUMBER_FIELD_CONFIG_INDEX].type,
            operator: undefined,
            values: undefined,
          },
        ]
      )

      act(() => {
        result.current.handleOperatorChange('inRange')
      })

      expect(result.current.valueInputConfig).toEqual({
        type: 'number',
        inputCount: 2,
      })
    })

    it('should hide value input when operator is blank/notBlank', async () => {
      const { result } = await renderWithFormik(
        {
          filterConfigs: filterConfigs,
          index: 0,
        },
        [
          {
            field: filterConfigs[NUMBER_FIELD_CONFIG_INDEX].field,
            type: filterConfigs[NUMBER_FIELD_CONFIG_INDEX].type,
            operator: undefined,
            values: undefined,
          },
        ]
      )

      act(() => {
        result.current.handleOperatorChange('blank')
      })

      expect(result.current.valueInputConfig).toBeUndefined()

      act(() => {
        result.current.handleOperatorChange('notBlank')
      })

      expect(result.current.valueInputConfig).toBeUndefined()
    })
  })
  describe('text field', () => {
    const TEXT_FIELD_CONFIG_INDEX = 1

    it('should initialize with text field options', async () => {
      const { result } = await renderWithFormik(
        {
          filterConfigs: filterConfigs,
          index: 0,
        },
        [
          {
            field: filterConfigs[TEXT_FIELD_CONFIG_INDEX].field,
            type: filterConfigs[TEXT_FIELD_CONFIG_INDEX].type,
            operator: undefined,
            values: undefined,
          },
        ]
      )

      expect(result.current.operatorOptions.map((o) => o.value)).toEqual([
        'contains',
        'notContains',
        'startsWith',
        'endsWith',
        'blank',
        'notBlank',
      ])
      expect(result.current.valueInputConfig).toEqual({
        type: 'text',
      })
      expect(result.current.filterFormValues.filters[0]).toEqual({
        field: 'text_field',
        type: 'text',
        operator: 'contains',
        values: undefined,
      })
    })

    it('should hide value input when operator is blank/notBlank', async () => {
      const { result } = await renderWithFormik(
        {
          filterConfigs: filterConfigs,
          index: 0,
        },
        [
          {
            field: filterConfigs[TEXT_FIELD_CONFIG_INDEX].field,
            type: filterConfigs[TEXT_FIELD_CONFIG_INDEX].type,
            operator: undefined,
            values: undefined,
          },
        ]
      )

      act(() => {
        result.current.handleOperatorChange('blank')
      })

      expect(result.current.valueInputConfig).toBeUndefined()

      act(() => {
        result.current.handleOperatorChange('notBlank')
      })

      expect(result.current.valueInputConfig).toBeUndefined()
    })
  })
  describe('select field', () => {
    const SELECT_FIELD_CONFIG_INDEX = 2
    it('should initialize with select type options', async () => {
      const { result } = await renderWithFormik(
        {
          filterConfigs: filterConfigs,
          index: 0,
        },
        [
          {
            field: filterConfigs[SELECT_FIELD_CONFIG_INDEX].field,
            type: filterConfigs[SELECT_FIELD_CONFIG_INDEX].type,
            operator: undefined,
            values: undefined,
          },
        ]
      )

      expect(result.current.operatorOptions.map((o) => o.value)).toEqual([
        'equals',
        'notEqual',
        'blank',
        'notBlank',
      ])
      expect(result.current.valueInputConfig).toEqual({
        type: 'select',
        valueOptions: filterConfigs[SELECT_FIELD_CONFIG_INDEX].options,
      })
      expect(result.current.filterFormValues.filters[0]).toEqual({
        field: 'select_field',
        type: 'select',
        operator: 'equals',
        values: undefined,
      })
    })

    it('should hide value input when operator is blank/notBlank', async () => {
      const { result } = await renderWithFormik(
        {
          filterConfigs: filterConfigs,
          index: 0,
        },
        [
          {
            field: filterConfigs[SELECT_FIELD_CONFIG_INDEX].field,
            type: filterConfigs[SELECT_FIELD_CONFIG_INDEX].type,
            operator: undefined,
            values: undefined,
          },
        ]
      )

      act(() => {
        result.current.handleOperatorChange('blank')
      })

      expect(result.current.valueInputConfig).toBeUndefined()

      act(() => {
        result.current.handleOperatorChange('notBlank')
      })

      expect(result.current.valueInputConfig).toBeUndefined()
    })
  })
})
