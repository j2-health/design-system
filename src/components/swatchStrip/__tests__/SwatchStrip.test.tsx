import { render, screen } from '@testing-library/react'
import { SwatchStrip } from '../SwatchStrip'

const items = (n: number, prefix: string) =>
  Array.from({ length: n }, (_, i) => ({
    key: `${prefix}${i}`,
    label: `${prefix} ${i + 1}`,
    swatch: { color: 'red' },
  }))

describe('SwatchStrip', () => {
  it('caps each group at max and shows the overflow', () => {
    render(
      <SwatchStrip max={3} groups={[{ key: 'a', items: items(5, 'A') }]} />
    )
    expect(screen.getAllByRole('img')).toHaveLength(3)
    expect(screen.getByText('+2')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'A 1' })).toBeInTheDocument()
  })

  it('divides groups and skips empty ones', () => {
    const { container } = render(
      <SwatchStrip
        groups={[
          { key: 'a', items: items(1, 'A') },
          { key: 'empty', items: [] },
          { key: 'b', items: items(1, 'B') },
        ]}
      />
    )
    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(1)
    expect(screen.getAllByRole('img')).toHaveLength(2)
  })

  it('renders nothing with no items', () => {
    const { container } = render(<SwatchStrip groups={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
