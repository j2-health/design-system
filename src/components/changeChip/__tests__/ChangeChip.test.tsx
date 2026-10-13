import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChangeChip } from '../ChangeChip'

describe('ChangeChip', () => {
  it('shows the label and a colored delta, and is a button', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ChangeChip
        label="Area B"
        delta={{
          direction: 'down',
          value: '1.8 pts',
          color: 'rgb(166, 82, 0)',
        }}
        srLabel="Area B: down 1.8 points"
        onClick={onClick}
      />
    )
    const chip = screen.getByRole('button', { name: /Area B: down 1.8/ })
    expect(screen.getByText('1.8 pts')).toHaveStyle({
      color: 'rgb(166, 82, 0)',
    })
    await user.click(chip)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('shows the placeholder only without a delta', () => {
    const { rerender } = render(<ChangeChip label="Area C" placeholder="—" />)
    expect(screen.getByText('—')).toBeInTheDocument()
    rerender(
      <ChangeChip
        label="Area C"
        placeholder="—"
        delta={{ direction: 'up', value: '2 pts' }}
      />
    )
    expect(screen.queryByText('—')).not.toBeInTheDocument()
  })

  it('renders as another element when asked, without button semantics', () => {
    render(
      <ChangeChip render={<span />} label="Area C" srLabel="Area C: none" />
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    const chip = screen.getByText('Area C').parentElement as HTMLElement
    expect(chip.tagName).toBe('SPAN')
    expect(chip).not.toHaveAttribute('type')
    expect(chip).toHaveTextContent('Area C: none')
  })

  it('keeps a replacement button out of form submission', () => {
    render(<ChangeChip render={<button className="x" />} label="Area A" />)
    expect(screen.getByRole('button', { name: 'Area A' })).toHaveAttribute(
      'type',
      'button'
    )
  })
})
