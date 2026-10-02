import { render } from '@testing-library/react'
import { Popover } from '../Popover'

describe('Popover paddingSize', () => {
  it('drops the container padding with "none"', () => {
    render(
      <Popover open content="Body" paddingSize="none">
        <button type="button">Open</button>
      </Popover>
    )
    const root = document.querySelector('.ant-popover') as HTMLElement
    expect(root.className).toMatch(/nonePadding/)
  })
})
