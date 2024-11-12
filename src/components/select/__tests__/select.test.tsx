import { render, fireEvent } from '@testing-library/react'
import { Formik } from 'formik'
import { Form } from 'formik-antd'
import { Select } from '../Select'

const renderWithForm = (selectElement: JSX.Element) => {
  return render(
    <Formik initialValues={{ test: '' }} onSubmit={() => {}}>
      <Form>{selectElement}</Form>
    </Formik>
  )
}

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
    const handleSearch = jest.fn()
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
})
