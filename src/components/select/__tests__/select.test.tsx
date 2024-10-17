import { render } from '@testing-library/react'
import { Select } from '../Select'

describe('Select', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Select
        options={[
          { label: 'UHC', value: 'united_healthcare' },
          { label: 'Aetna', value: 'aetna' },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
