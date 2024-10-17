import { render } from '@testing-library/react'
import { Dropdown } from '../Dropdown'

describe('Dropdown', () => {
  it('should render correctly', () => {
    const { container } = render(<Dropdown label="Test">Test</Dropdown>)
    expect(container).toMatchSnapshot()
  })
})
