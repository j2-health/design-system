import { render } from '@testing-library/react'
import { Breadcrumb } from '../Breadcrumb'

describe('Breadcrumb', () => {
  it('should render correctly', () => {
    const { container } = render(<Breadcrumb items={[]} />)
    expect(container).toMatchSnapshot()
  })
})
