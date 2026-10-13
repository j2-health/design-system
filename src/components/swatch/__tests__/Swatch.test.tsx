import { render } from '@testing-library/react'
import { Swatch, type SwatchProps } from '../Swatch'

describe('Swatch', () => {
  it('fills a solid swatch with its color at its size', () => {
    const { container } = render(<Swatch color="rgb(1, 2, 3)" size={12} />)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.background).toBe('rgb(1, 2, 3)')
    expect(el.style.width).toBe('12px')
    expect(el.querySelector('svg')).toBeNull()
  })

  it('draws a hatched swatch with a border and a diagonal stroke', () => {
    const { container } = render(
      <Swatch
        variant="hatched"
        color="rgb(1, 2, 3)"
        tint="rgb(9, 9, 9)"
        stroke="rgb(4, 5, 6)"
      />
    )
    const el = container.firstElementChild as HTMLElement
    expect(el.style.borderColor).toBe('rgb(1, 2, 3)')
    expect(el.style.background).toBe('rgb(9, 9, 9)')
    expect(el.querySelector('line')).toHaveAttribute('stroke', 'rgb(4, 5, 6)')
  })

  it('draws an outline swatch with no fill color', () => {
    const { container } = render(<Swatch variant="outline" color="red" />)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.background).toBe('')
    expect(el).toHaveClass('border-j2-border')
  })
})

describe.each(['solid', 'hatched', 'outline'] as const)(
  'a %s swatch',
  (variant) => {
    it('passes span attributes to its root and keeps its own size', () => {
      const { container } = render(
        <Swatch
          variant={variant}
          color="rgb(1, 2, 3)"
          size={10}
          role="img"
          aria-label="Key"
          data-testid="swatch"
          className="extra"
          style={{ width: 99, marginLeft: 3 }}
        />
      )
      const el = container.firstElementChild as HTMLElement
      expect(el).toHaveAttribute('role', 'img')
      expect(el).toHaveAttribute('aria-label', 'Key')
      expect(el).toHaveAttribute('data-testid', 'swatch')
      expect(el).toHaveClass('block', 'extra')
      expect(el.style.width).toBe('10px')
      expect(el.style.marginLeft).toBe('3px')
      if (variant === 'solid') expect(el.style.background).toBe('rgb(1, 2, 3)')
      if (variant === 'hatched')
        expect(el.style.borderColor).toBe('rgb(1, 2, 3)')
    })
  }
)

it('accepts span attributes through the exported props type', () => {
  const props: SwatchProps = { role: 'img', 'aria-label': 'Area A' }
  const { getByRole } = render(<Swatch {...props} />)
  expect(getByRole('img', { name: 'Area A' })).toBeInTheDocument()
})
