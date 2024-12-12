import { render } from '@testing-library/react'
import { Rate } from '../Rate'

describe('Rate', () => {
  it('should render correctly', () => {
    const { container } = render(<Rate value={4.5} />)
    expect(container).toMatchSnapshot()
  })
})
