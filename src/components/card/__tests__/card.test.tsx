import { render } from '@testing-library/react'
import { Card } from '../Card'

describe('Card', () => {
  it('should render correctly', () => {
    const { container } = render(<Card title="Test">Test</Card>)
    expect(container).toMatchSnapshot()
  })
})
