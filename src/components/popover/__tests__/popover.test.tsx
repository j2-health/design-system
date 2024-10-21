import { render } from '@testing-library/react'
import { Popover } from '../Popover'

describe('Popover', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Popover title="What is this?" content={<span>The best healthcare</span>}>
        Aetna
      </Popover>
    )
    expect(container).toMatchSnapshot()
  })
})
