import { render } from '@testing-library/react'
import { Tabs } from '../Tabs'

const items = [
  { key: 'a', label: 'One', children: 'First' },
  { key: 'b', label: 'Two', children: 'Second' },
]

describe('Tabs', () => {
  it('adds no layout classes by default', () => {
    const { container } = render(<Tabs items={items} />)
    const root = container.querySelector('.ant-tabs') as HTMLElement
    expect(root.className).not.toMatch(/flush|justified/)
  })

  it('applies flush and justified, keeping a consumer class', () => {
    const { container } = render(
      <Tabs items={items} flush justified className="custom" />
    )
    const root = container.querySelector('.ant-tabs') as HTMLElement
    expect(root.className).toMatch(/flush/)
    expect(root.className).toMatch(/justified/)
    expect(root).toHaveClass('custom')
  })
})
