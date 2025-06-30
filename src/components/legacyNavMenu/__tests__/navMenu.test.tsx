import { act, render } from '@testing-library/react'
import { LegacyNavMenu } from '../LegacyNavMenu'

describe('LegacyNavMenu', () => {
  it('should render correctly', async () => {
    const { container } = await act(async () => render(<LegacyNavMenu />))

    expect(container).toMatchSnapshot()
  })
})
