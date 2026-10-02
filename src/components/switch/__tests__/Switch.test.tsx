import { render, screen } from '@testing-library/react'
import { Switch } from '../Switch'

describe('Switch', () => {
  it('keeps a consumer className alongside its own', () => {
    render(<Switch className="custom" />)
    const el = screen.getByRole('switch')
    expect(el).toHaveClass('j2-switch')
    expect(el).toHaveClass('custom')
  })

  it('honours size, and small still wins', () => {
    const { rerender } = render(<Switch size="small" />)
    expect(screen.getByRole('switch')).toHaveClass('ant-switch-small')
    rerender(<Switch small size="default" />)
    expect(screen.getByRole('switch')).toHaveClass('ant-switch-small')
  })

  it('marks a switch with text in its track as labelled', () => {
    const { rerender } = render(<Switch small unCheckedChildren="Off" />)
    expect(screen.getByRole('switch')).toHaveClass('j2-switch-labelled')
    rerender(<Switch small unCheckedChildren={<svg />} />)
    expect(screen.getByRole('switch')).not.toHaveClass('j2-switch-labelled')
  })
})
