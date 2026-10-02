import { render } from '@testing-library/react'
import { Swatch } from '../Swatch'

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
