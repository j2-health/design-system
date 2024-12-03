import { render } from '@testing-library/react'
import { Alert } from '../Alert'

describe('Alert', () => {
  it('should render correctly', () => {
    const { container } = render(<Alert message="Hello world" type="success" />)
    expect(container).toMatchSnapshot()
  })
})
