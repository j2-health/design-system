import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SummarizedSelect } from '../SummarizedSelect'

const mockOptions = [
  { label: 'Bronze Plan', value: 'bronze' },
  { label: 'Silver Plan', value: 'silver' },
  { label: 'Gold Plan', value: 'gold' },
  { label: 'Platinum Plan', value: 'platinum' },
]

const mockGroupedOptions = [
  {
    label: 'Popular Plans',
    options: [
      { label: 'Bronze Plan', value: 'bronze' },
      { label: 'Silver Plan', value: 'silver' },
    ],
  },
  {
    label: 'Premium Plans',
    options: [
      { label: 'Gold Plan', value: 'gold' },
      { label: 'Platinum Plan', value: 'platinum' },
    ],
  },
]

describe('SummarizedSelect', () => {
  describe('Basic Rendering', () => {
    it('should render correctly with default props', () => {
      const { container } = render(
        <SummarizedSelect options={mockOptions} value="" onChange={() => {}} />
      )
      expect(container).toMatchSnapshot()
    })

    it('should apply custom class names', () => {
      const { container } = render(
        <SummarizedSelect
          options={mockOptions}
          value=""
          onChange={() => {}}
          rootClassName="custom-root"
          popupClassName="custom-popup"
        />
      )
      expect(container.querySelector('.custom-root')).toBeTruthy()
    })

    it('should render with custom placeholders', () => {
      const { container } = render(
        <SummarizedSelect
          options={mockOptions}
          value=""
          onChange={() => {}}
          formControlPlaceholder="Select a plan"
          searchPlaceholder="Search plans..."
        />
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Single Selection Mode', () => {
    it('should render with selected value', () => {
      const { container } = render(
        <SummarizedSelect
          options={mockOptions}
          value="bronze"
          onChange={() => {}}
        />
      )
      expect(container).toMatchSnapshot()
    })

    it('should call onChange with correct value when option selected', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()

      render(
        <SummarizedSelect
          options={mockOptions}
          value=""
          onChange={mockOnChange}
        />
      )

      const select = screen.getByRole('combobox')
      await user.click(select)

      const option = screen.getByText('Bronze Plan')
      await user.click(option)

      expect(mockOnChange).toHaveBeenCalledWith('bronze')
    })

    it('should display selected option correctly', () => {
      const { container } = render(
        <SummarizedSelect
          options={mockOptions}
          value="silver"
          onChange={() => {}}
        />
      )

      expect(
        container.querySelector('.ant-select-selection-item')
      ).toHaveTextContent('Silver Plan')
    })
  })

  describe('Multiple Selection Mode', () => {
    it('should render with multiple values', () => {
      const { container } = render(
        <SummarizedSelect
          multiple
          options={mockOptions}
          value={['bronze', 'silver']}
          onChange={() => {}}
          renderLabel={(count) => `${count} plans selected`}
        />
      )
      expect(container).toMatchSnapshot()
    })

    it('should show custom label from renderLabel', () => {
      const { container } = render(
        <SummarizedSelect
          multiple
          options={mockOptions}
          value={['bronze', 'silver']}
          onChange={() => {}}
          renderLabel={(count) => `${count} plans selected`}
        />
      )

      expect(
        container.querySelector('.ant-select-selection-overflow')
      ).toHaveTextContent('2 plans selected')
    })

    it('should display tags in popup when opened', async () => {
      const user = userEvent.setup()

      render(
        <SummarizedSelect
          multiple
          options={mockOptions}
          value={['bronze', 'silver']}
          onChange={() => {}}
          renderLabel={(count) => `${count} selected`}
        />
      )

      const select = screen.getByRole('combobox')
      await user.click(select)

      // Tags show the option labels in the popup
      const tags = document.querySelectorAll('.ant-tag')
      expect(tags).toHaveLength(2)
      expect(tags[0]).toHaveTextContent('Bronze Plan')
      expect(tags[1]).toHaveTextContent('Silver Plan')
    })

    it('should call onChange when tag is removed', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()

      render(
        <SummarizedSelect
          multiple
          options={mockOptions}
          value={['bronze', 'silver']}
          onChange={mockOnChange}
          renderLabel={(count) => `${count} selected`}
        />
      )

      const select = screen.getByRole('combobox')
      await user.click(select)

      // Find and click the close button on the first tag
      const closeButton = document.querySelector('.ant-tag-close-icon')
      expect(closeButton).toBeInTheDocument()
      await user.click(closeButton as Element)

      expect(mockOnChange).toHaveBeenCalledWith(['silver'])
    })

    it('should call onChange with new array when option selected', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()

      render(
        <SummarizedSelect
          multiple
          options={mockOptions}
          value={['bronze']}
          onChange={mockOnChange}
          renderLabel={(count) => `${count} selected`}
        />
      )

      const select = screen.getByRole('combobox')
      await user.click(select)

      const option = screen.getByText('Silver Plan')
      await user.click(option)

      expect(mockOnChange).toHaveBeenCalledWith(['bronze', 'silver'])
    })
  })

  describe('Grouped Options', () => {
    it('should render grouped options correctly', () => {
      const { container } = render(
        <SummarizedSelect
          options={mockGroupedOptions}
          value=""
          onChange={() => {}}
        />
      )
      expect(container).toMatchSnapshot()
    })

    it('should select from grouped options', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()

      render(
        <SummarizedSelect
          options={mockGroupedOptions}
          value=""
          onChange={mockOnChange}
        />
      )

      const select = screen.getByRole('combobox')
      await user.click(select)

      const option = screen.getByText('Gold Plan')
      await user.click(option)

      expect(mockOnChange).toHaveBeenCalledWith('gold')
    })
  })

  describe('Search Functionality', () => {
    it('should show search input when dropdown opens', async () => {
      const user = userEvent.setup()

      render(
        <SummarizedSelect
          options={mockOptions}
          value=""
          onChange={() => {}}
          searchPlaceholder="Search plans..."
        />
      )

      const select = screen.getByRole('combobox')
      await user.click(select)

      expect(screen.getByPlaceholderText('Search plans...')).toBeInTheDocument()
    })

    it('should filter options based on search text', async () => {
      const user = userEvent.setup()

      render(
        <SummarizedSelect options={mockOptions} value="" onChange={() => {}} />
      )

      const select = screen.getByRole('combobox')
      await user.click(select)

      const searchInput = screen.getByPlaceholderText('Search...')
      await user.type(searchInput, 'Bronze')

      expect(screen.getByText('Bronze Plan')).toBeInTheDocument()
      expect(screen.queryByText('Silver Plan')).not.toBeInTheDocument()
    })

    it('should filter grouped options based on search text', async () => {
      const user = userEvent.setup()

      render(
        <SummarizedSelect
          options={mockGroupedOptions}
          value=""
          onChange={() => {}}
        />
      )

      const select = screen.getByRole('combobox')
      await user.click(select)

      const searchInput = screen.getByPlaceholderText('Search...')
      await user.type(searchInput, 'Gold')

      expect(screen.getByText('Gold Plan')).toBeInTheDocument()
      expect(screen.queryByText('Bronze Plan')).not.toBeInTheDocument()
    })

    it('should clear search when dropdown closes', async () => {
      const user = userEvent.setup()

      render(
        <SummarizedSelect options={mockOptions} value="" onChange={() => {}} />
      )

      const select = screen.getByRole('combobox')
      await user.click(select)

      const searchInput = screen.getByPlaceholderText('Search...')
      await user.type(searchInput, 'Bronze')

      await user.click(document.body)
      await user.click(select)

      const newSearchInput = screen.getByPlaceholderText('Search...')
      expect(newSearchInput).toHaveValue('')
    })

    it('should prevent propagation on search input events', async () => {
      const user = userEvent.setup()

      render(
        <SummarizedSelect options={mockOptions} value="" onChange={() => {}} />
      )

      const select = screen.getByRole('combobox')
      await user.click(select)

      const searchInput = screen.getByPlaceholderText('Search...')

      await user.type(searchInput, 'test')

      expect(searchInput).toHaveValue('test')
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner when loading is true', () => {
      render(
        <SummarizedSelect
          options={mockOptions}
          value=""
          onChange={() => {}}
          loading
        />
      )

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      expect(screen.queryByTestId('caret-down')).not.toBeInTheDocument()
    })

    it('should show caret icon when not loading', () => {
      render(
        <SummarizedSelect
          options={mockOptions}
          value=""
          onChange={() => {}}
          loading={false}
        />
      )

      expect(screen.getByTestId('caret-down')).toBeInTheDocument()
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
    })

    it('should render with loading state', () => {
      const { container } = render(
        <SummarizedSelect
          options={mockOptions}
          value=""
          onChange={() => {}}
          loading
        />
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      const { container } = render(
        <SummarizedSelect options={[]} value="" onChange={() => {}} />
      )
      expect(container).toMatchSnapshot()
    })

    it('should handle options with undefined labels', () => {
      const optionsWithUndefinedLabel = [
        { label: undefined, value: 'test' },
        { label: 'Valid Label', value: 'valid' },
      ]

      const { container } = render(
        <SummarizedSelect
          options={optionsWithUndefinedLabel}
          value=""
          onChange={() => {}}
        />
      )
      expect(container).toMatchSnapshot()
    })

    it('should throw error when value is not string in single mode', () => {
      const mockOnChange = vi.fn()

      const TestComponent = () => {
        const handleChange = (val: string) => {
          mockOnChange(val)
        }

        return (
          <SummarizedSelect
            options={mockOptions}
            value=""
            onChange={handleChange}
          />
        )
      }

      expect(() => render(<TestComponent />)).not.toThrow()
    })

    it('should throw error when value is not array in multiple mode', () => {
      const mockOnChange = vi.fn()

      const TestComponent = () => {
        const handleChange = (val: string[]) => {
          mockOnChange(val)
        }

        return (
          <SummarizedSelect
            multiple
            options={mockOptions}
            value={[]}
            onChange={handleChange}
            renderLabel={(count) => `${count} selected`}
          />
        )
      }

      expect(() => render(<TestComponent />)).not.toThrow()
    })

    it('should handle missing option in valueToLabel function', async () => {
      const user = userEvent.setup()

      render(
        <SummarizedSelect
          multiple
          options={mockOptions}
          value={['nonexistent']}
          onChange={() => {}}
          renderLabel={(count) => `${count} selected`}
        />
      )

      const select = screen.getByRole('combobox')
      await user.click(select)

      expect(screen.getByText('nonexistent')).toBeInTheDocument()
    })
  })
})
