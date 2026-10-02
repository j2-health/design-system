import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button props', () => {
  it('renders xs as a small antd button with the xs class', () => {
    render(<Button size="xs">Go</Button>)
    const btn = screen.getByRole('button', { name: 'Go' })
    expect(btn).toHaveClass('j2-btn-xs')
    expect(btn).toHaveClass('ant-btn-sm')
  })

  it('makes a link button inline, and ignores inline on other types', () => {
    const { rerender } = render(
      <Button type="link" inline className="custom">
        Learn more
      </Button>
    )
    const btn = screen.getByRole('button', { name: 'Learn more' })
    expect(btn).toHaveClass('j2-btn-inline')
    expect(btn).toHaveClass('custom')
    rerender(
      <Button type="primary" inline>
        Learn more
      </Button>
    )
    expect(screen.getByRole('button')).not.toHaveClass('j2-btn-inline')
  })
})
