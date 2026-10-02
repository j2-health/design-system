import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Card } from '../Card'

describe('Card selected', () => {
  it('becomes a toggle button with selected and onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Card selected onClick={onClick}>
        Option
      </Card>
    )
    const card = screen.getByRole('button')
    expect(card).toHaveClass('j2-card-selected')
    expect(card).toHaveAttribute('aria-pressed', 'true')

    await user.click(card)
    card.focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(3)
  })

  it('reports unselected as aria-pressed false', () => {
    render(
      <Card selected={false} onClick={() => {}}>
        Option
      </Card>
    )
    const card = screen.getByRole('button')
    expect(card).toHaveAttribute('aria-pressed', 'false')
    expect(card).not.toHaveClass('j2-card-selected')
  })

  it('stays a plain card without selected', () => {
    render(<Card onClick={() => {}}>Plain</Card>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
