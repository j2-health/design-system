import { render } from '@testing-library/react'
import { InputNumber } from '../InputNumber'
import { Formik } from 'formik'

describe('InputNumber', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Formik initialValues={{ test: 1 }} onSubmit={() => {}}>
        <InputNumber name="test" />
      </Formik>
    )
    expect(container).toMatchSnapshot()
  })
})
