import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { RadioCardGroup } from '../RadioCardGroup'

const options = [
  { value: 'a', label: 'First' },
  { value: 'b', label: 'Second', description: 'With a line of description' },
  { value: 'c', label: 'Third' },
]

describe('RadioCardGroup', () => {
  it('renders a radio group with the selected card checked', () => {
    render(
      <RadioCardGroup
        aria-label="Choice"
        options={options}
        value="b"
        onChange={vi.fn()}
      />
    )
    expect(
      screen.getByRole('radiogroup', { name: 'Choice' })
    ).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Second/ })).toHaveAttribute(
      'aria-checked',
      'true'
    )
    expect(screen.getByText('With a line of description')).toBeInTheDocument()
  })

  it('selects a card on click', async () => {
    const onChange = vi.fn()
    render(<RadioCardGroup options={options} value="a" onChange={onChange} />)
    await userEvent.click(screen.getByRole('radio', { name: /Third/ }))
    expect(onChange).toHaveBeenCalledWith('c')
  })

  it('keeps only the selected card in the tab order', () => {
    render(<RadioCardGroup options={options} value="b" onChange={vi.fn()} />)
    const radios = screen.getAllByRole('radio')
    expect(radios.map((radio) => radio.tabIndex)).toEqual([-1, 0, -1])
  })

  it('puts the first card in the tab order when none is selected', () => {
    render(<RadioCardGroup options={options} onChange={vi.fn()} />)
    expect(screen.getAllByRole('radio')[0].tabIndex).toBe(0)
  })

  it('moves and selects with the arrow keys, wrapping and skipping disabled', async () => {
    const onChange = vi.fn()
    render(
      <RadioCardGroup
        options={[options[0], { ...options[1], disabled: true }, options[2]]}
        value="a"
        onChange={onChange}
      />
    )
    screen.getAllByRole('radio')[0].focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenLastCalledWith('c')
    await userEvent.keyboard('{ArrowLeft}')
    expect(onChange).toHaveBeenLastCalledWith('a')
  })

  it('ignores clicks on a disabled card', async () => {
    const onChange = vi.fn()
    render(
      <RadioCardGroup
        options={[options[0], { ...options[1], disabled: true }]}
        onChange={onChange}
      />
    )
    await userEvent.click(screen.getByRole('radio', { name: /Second/ }))
    expect(onChange).not.toHaveBeenCalled()
  })
})
