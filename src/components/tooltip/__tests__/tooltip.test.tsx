import { render } from '@testing-library/react'
import { Tooltip } from '../Tooltip'

describe('Tooltip', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Tooltip title="The best healthcare">Aetna</Tooltip>
    )
    expect(container).toMatchSnapshot()
  })
})
