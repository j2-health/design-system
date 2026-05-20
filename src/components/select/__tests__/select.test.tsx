import { vi } from 'vitest'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik, useFormikContext } from 'formik'
import { Form } from 'formik-antd'
import { Select } from '../Select'

const renderWithForm = (selectElement: JSX.Element) => {
  return render(
    <Formik initialValues={{ test: '' }} onSubmit={() => {}}>
      <Form>{selectElement}</Form>
    </Formik>
  )
}

// Exposes the current Formik values via a data-testid so tests can assert on
// state changes the Select pushes to the form (e.g. select-all / clear-all).
const FormStateProbe = () => {
  const { values } = useFormikContext<Record<string, unknown>>()
  return <div data-testid="form-state">{JSON.stringify(values)}</div>
}

const renderMultipleWithForm = (
  selectElement: JSX.Element,
  initialValue: string[] = []
) => {
  return render(
    <Formik initialValues={{ test: initialValue }} onSubmit={() => {}}>
      <Form>
        {selectElement}
        <FormStateProbe />
      </Form>
    </Formik>
  )
}

const planOptions = [
  { label: 'Bronze Plan', value: 'bronze' },
  { label: 'Silver Plan', value: 'silver' },
  { label: 'Gold Plan', value: 'gold' },
  { label: 'Platinum Plan', value: 'platinum' },
]

describe('Select', () => {
  it('should render correctly', () => {
    const { container } = renderWithForm(<Select name="test" />)
    expect(container).toMatchSnapshot()
  })

  it('should render with options', () => {
    const { container } = renderWithForm(
      <Select
        name="test"
        options={[
          { label: 'Bronze Plan', value: 'bronze' },
          { label: 'Silver Plan', value: 'silver' },
          { label: 'Gold Plan', value: 'gold' },
          { label: 'Platinum Plan', value: 'platinum' },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should render with loading indicator', () => {
    const { container } = renderWithForm(
      <Select
        name="test"
        loading
        options={[
          { label: 'Bronze Plan', value: 'bronze' },
          { label: 'Silver Plan', value: 'silver' },
          { label: 'Gold Plan', value: 'gold' },
          { label: 'Platinum Plan', value: 'platinum' },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should render with search enabled', () => {
    const { container } = renderWithForm(
      <Select
        name="test"
        showSearch
        options={[
          { label: 'Bronze Plan', value: 'bronze' },
          { label: 'Silver Plan', value: 'silver' },
          { label: 'Gold Plan', value: 'gold' },
          { label: 'Platinum Plan', value: 'platinum' },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should call onSearch when search input changes', () => {
    const handleSearch = vi.fn()
    const { getByRole } = renderWithForm(
      <Select
        name="test"
        showSearch
        onSearch={handleSearch}
        options={[
          { label: 'UHC', value: 'united_healthcare' },
          { label: 'Aetna', value: 'aetna' },
        ]}
      />
    )
    const input = getByRole('combobox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'UHC' } })
    expect(handleSearch).toHaveBeenCalledWith('UHC')
  })

  it('should render with allowClear enabled', () => {
    const { container } = renderWithForm(
      <Select
        name="test"
        allowClear
        options={[
          { label: 'Bronze Plan', value: 'bronze' },
          { label: 'Silver Plan', value: 'silver' },
          { label: 'Gold Plan', value: 'gold' },
          { label: 'Platinum Plan', value: 'platinum' },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should not render clear icon when allowClear is disabled', () => {
    const { container } = renderWithForm(
      <Select
        name="test"
        options={[
          { label: 'Bronze Plan', value: 'bronze' },
          { label: 'Silver Plan', value: 'silver' },
          { label: 'Gold Plan', value: 'gold' },
          { label: 'Platinum Plan', value: 'platinum' },
        ]}
      />
    )
    fireEvent.mouseOver(container.firstChild as Element)
    expect(container.querySelector('[data-testid="clear-icon"]')).toBeFalsy()
    expect(container).toMatchSnapshot()
  })

  describe('Multiple mode select-all / clear-all footer', () => {
    it('renders "Select all" footer when value is empty', async () => {
      const user = userEvent.setup()
      renderMultipleWithForm(
        <Select name="test" mode="multiple" options={planOptions} />
      )

      await user.click(screen.getByRole('combobox'))

      expect(await screen.findByText('Select all')).toBeInTheDocument()
      expect(screen.queryByText('Clear all')).not.toBeInTheDocument()
    })

    it('renders "Clear all" footer when value has items', async () => {
      const user = userEvent.setup()
      renderMultipleWithForm(
        <Select name="test" mode="multiple" options={planOptions} />,
        ['bronze', 'silver']
      )

      await user.click(screen.getByRole('combobox'))

      expect(await screen.findByText('Clear all')).toBeInTheDocument()
      expect(screen.queryByText('Select all')).not.toBeInTheDocument()
    })

    it('selects every option when "Select all" is clicked', async () => {
      const user = userEvent.setup()
      renderMultipleWithForm(
        <Select name="test" mode="multiple" options={planOptions} />
      )

      await user.click(screen.getByRole('combobox'))
      await user.click(await screen.findByText('Select all'))

      await waitFor(() => {
        expect(screen.getByTestId('form-state')).toHaveTextContent(
          JSON.stringify({ test: ['bronze', 'silver', 'gold', 'platinum'] })
        )
      })
    })

    it('empties value when "Clear all" is clicked', async () => {
      const user = userEvent.setup()
      renderMultipleWithForm(
        <Select name="test" mode="multiple" options={planOptions} />,
        ['bronze', 'silver']
      )

      await user.click(screen.getByRole('combobox'))
      await user.click(await screen.findByText('Clear all'))

      await waitFor(() => {
        expect(screen.getByTestId('form-state')).toHaveTextContent(
          JSON.stringify({ test: [] })
        )
      })
    })

    it('flips label from "Select all" to "Clear all" after selecting all', async () => {
      const user = userEvent.setup()
      renderMultipleWithForm(
        <Select name="test" mode="multiple" options={planOptions} />
      )

      await user.click(screen.getByRole('combobox'))
      await user.click(await screen.findByText('Select all'))

      expect(await screen.findByText('Clear all')).toBeInTheDocument()
      expect(screen.queryByText('Select all')).not.toBeInTheDocument()
    })

    it('hides footer while user is searching', async () => {
      const user = userEvent.setup()
      renderMultipleWithForm(
        <Select
          name="test"
          mode="multiple"
          showSearch
          optionFilterProp="label"
          options={planOptions}
        />
      )

      const combobox = screen.getByRole('combobox')
      await user.click(combobox)
      expect(await screen.findByText('Select all')).toBeInTheDocument()

      await user.type(combobox, 'bro')

      await waitFor(() => {
        expect(screen.queryByText('Select all')).not.toBeInTheDocument()
      })
      expect(screen.queryByText('Clear all')).not.toBeInTheDocument()
    })

    it('restores footer when search input is cleared', async () => {
      const user = userEvent.setup()
      renderMultipleWithForm(
        <Select
          name="test"
          mode="multiple"
          showSearch
          optionFilterProp="label"
          options={planOptions}
        />
      )

      const combobox = screen.getByRole('combobox')
      await user.click(combobox)
      await user.type(combobox, 'bro')
      await waitFor(() => {
        expect(screen.queryByText('Select all')).not.toBeInTheDocument()
      })

      await user.clear(combobox)

      expect(await screen.findByText('Select all')).toBeInTheDocument()
    })

    it('does not render footer in single-select mode', async () => {
      const user = userEvent.setup()
      renderWithForm(<Select name="test" options={planOptions} />)

      await user.click(screen.getByRole('combobox'))
      // The Bronze Plan option should be visible to confirm dropdown is open.
      expect(await screen.findByText('Bronze Plan')).toBeInTheDocument()
      expect(screen.queryByText('Select all')).not.toBeInTheDocument()
      expect(screen.queryByText('Clear all')).not.toBeInTheDocument()
    })

    it('does not render footer when loading', async () => {
      const user = userEvent.setup()
      renderMultipleWithForm(
        <Select name="test" mode="multiple" loading options={planOptions} />
      )

      await user.click(screen.getByRole('combobox'))
      expect(await screen.findByText('Loading...')).toBeInTheDocument()
      expect(screen.queryByText('Select all')).not.toBeInTheDocument()
    })

    it('does not render footer when options list is empty', async () => {
      const user = userEvent.setup()
      renderMultipleWithForm(
        <Select name="test" mode="multiple" options={[]} />
      )

      await user.click(screen.getByRole('combobox'))
      expect(await screen.findByText('No options')).toBeInTheDocument()
      expect(screen.queryByText('Select all')).not.toBeInTheDocument()
    })

    it('forwards consumer onSearch callback while tracking search internally', async () => {
      const user = userEvent.setup()
      const handleSearch = vi.fn()
      renderMultipleWithForm(
        <Select
          name="test"
          mode="multiple"
          showSearch
          optionFilterProp="label"
          onSearch={handleSearch}
          options={planOptions}
        />
      )

      const combobox = screen.getByRole('combobox')
      await user.click(combobox)
      await user.type(combobox, 'bro')

      expect(handleSearch).toHaveBeenCalledWith('bro')
    })
  })
})
