import { render } from '@testing-library/react'
import { Collapse } from '../Collapse'

const items = [{ key: '1', label: 'Details', children: 'Body' }]

describe('Collapse', () => {
  it('renders the section variant ghost, caret at the end', () => {
    const { container } = render(
      <Collapse variant="section" items={items} defaultActiveKey={['1']} />
    )
    const root = container.querySelector('.ant-collapse') as HTMLElement
    expect(root.className).toMatch(/section/)
    expect(root).toHaveClass('ant-collapse-ghost')
    expect(root).toHaveClass('ant-collapse-icon-placement-end')
  })

  it('leaves the default variant as it was', () => {
    const { container } = render(<Collapse items={items} />)
    const root = container.querySelector('.ant-collapse') as HTMLElement
    expect(root.className).not.toMatch(/section/)
    expect(root).not.toHaveClass('ant-collapse-ghost')
  })
})
