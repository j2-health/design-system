import { render } from '@testing-library/react'
import { Input } from '../Input'
import { Formik } from 'formik'
import { Form } from '../../form'

describe('Input', () => {
  const renderInForm = (component: React.ReactNode) => {
    return render(
      <Formik initialValues={{ name: '' }} onSubmit={() => {}}>
        <Form>{component}</Form>
      </Formik>
    )
  }

  it('should render correctly', () => {
    const { container } = renderInForm(<Input name="name" />)
    expect(container).toMatchSnapshot()
  })
})
