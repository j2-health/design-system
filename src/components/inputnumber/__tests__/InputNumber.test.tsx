import { render } from '@testing-library/react'
import { InputNumber } from '../InputNumber'

describe('InputNumber', () => {
  it('should render correctly', () => {
    const { container } = render(<InputNumber />)
    expect(container).toMatchSnapshot()
  })
})
