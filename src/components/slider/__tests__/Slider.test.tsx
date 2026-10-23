import { render, screen } from '@testing-library/react'
import { Slider } from '../Slider'

describe('Slider', () => {
  it('keeps a consumer className alongside its own', () => {
    const { container } = render(<Slider className="custom" />)
    const el = container.querySelector('.ant-slider')
    expect(el).toHaveClass('j2-slider')
    expect(el).toHaveClass('custom')
  })

  it('renders a handle with the value', () => {
    render(<Slider min={0} max={10} defaultValue={4} />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '4')
  })

  it('renders two handles as a range', () => {
    render(<Slider range defaultValue={[2, 6]} />)
    expect(screen.getAllByRole('slider')).toHaveLength(2)
  })
})
