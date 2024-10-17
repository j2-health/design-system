import { render } from '@testing-library/react'
import { Radio, RadioGroup } from '../Radio'

describe('Radio', () => {
  it('should render correctly', () => {
    const { container } = render(<Radio value="aetna" />)
    expect(container).toMatchSnapshot()
  })
})

describe('RadioGroup', () => {
  it('should render correctly', () => {
    const { container } = render(<RadioGroup options={['aetna', 'cigna']} />)
    expect(container).toMatchSnapshot()
  })
})
