import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ListRow } from '../ListRow'

const SELECTED = 'bg-[var(--j2-color-primary-bg-hover)]'
const PENDING = 'bg-[var(--j2-color-warning-bg)]'

describe('ListRow', () => {
  it('is a plain container without onClick', () => {
    render(<ListRow>Row</ListRow>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByText('Row')).toHaveClass('hover:bg-j2-gray-3')
  })

  it('activates on click, Enter and Space', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<ListRow onClick={onClick}>Row</ListRow>)
    const row = screen.getByRole('button', { name: 'Row' })

    await user.click(row)
    row.focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(3)
  })

  it('shows selected without a hover tint', () => {
    render(
      <ListRow selected onClick={() => {}}>
        Row
      </ListRow>
    )
    const row = screen.getByRole('button')
    expect(row).toHaveClass(SELECTED)
    expect(row).not.toHaveClass('hover:bg-j2-gray-3')
    expect(row).toHaveAttribute('aria-pressed', 'true')
  })

  it('lets pending win over selected', () => {
    render(
      <ListRow pending selected>
        Row
      </ListRow>
    )
    const row = screen.getByText('Row')
    expect(row).toHaveClass(PENDING)
    expect(row).not.toHaveClass(SELECTED)
  })

  it('applies the hover tint when highlighted from outside', () => {
    render(<ListRow highlighted>Row</ListRow>)
    expect(screen.getByText('Row')).toHaveClass('bg-j2-gray-3')
  })

  it('reports pointer enter and leave', async () => {
    const user = userEvent.setup()
    const onHoverChange = vi.fn()
    render(<ListRow onHoverChange={onHoverChange}>Row</ListRow>)
    await user.hover(screen.getByText('Row'))
    await user.unhover(screen.getByText('Row'))
    expect(onHoverChange.mock.calls).toEqual([[true], [false]])
  })

  describe('keys from nested controls', () => {
    it('leave Space on a nested checkbox to the checkbox', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      const onToggle = vi.fn()
      render(
        <ListRow onClick={onClick}>
          {/* A nested control stops its own click, as it should in a
              clickable row; the row's key handler must not re-fire it. */}
          <span onClick={(event) => event.stopPropagation()}>
            <input type="checkbox" aria-label="Pick" onChange={onToggle} />
          </span>
          Record A
        </ListRow>
      )
      screen.getByRole('checkbox', { name: 'Pick' }).focus()
      await user.keyboard(' ')
      expect(onToggle).toHaveBeenCalledOnce()
      expect(onClick).not.toHaveBeenCalled()
    })

    it('leave Space on the selection control to the control', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      const onSelectedChange = vi.fn()
      render(
        <ListRow
          selection="checkbox"
          selectionLabel="Record A"
          onClick={onClick}
          onSelectedChange={onSelectedChange}
        >
          Record A
        </ListRow>
      )
      screen.getByRole('checkbox', { name: 'Record A' }).focus()
      await user.keyboard(' ')
      expect(onSelectedChange).toHaveBeenCalledWith(true)
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('selection control', () => {
    it('toggles a checkbox without running onClick', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      const onSelectedChange = vi.fn()
      render(
        <ListRow
          selection="checkbox"
          selectionLabel="Record A"
          onClick={onClick}
          onSelectedChange={onSelectedChange}
        >
          Record A
        </ListRow>
      )
      await user.click(screen.getByRole('checkbox', { name: 'Record A' }))
      expect(onSelectedChange).toHaveBeenCalledWith(true)
      expect(onClick).not.toHaveBeenCalled()
    })

    it('still runs onClick from the rest of the row', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <ListRow
          selection="checkbox"
          selectionLabel="Record A"
          onClick={onClick}
        >
          Record A
        </ListRow>
      )
      await user.click(screen.getByText('Record A'))
      expect(onClick).toHaveBeenCalledOnce()
    })

    it('reflects selected on a radio and reports a pick', async () => {
      const user = userEvent.setup()
      const onSelectedChange = vi.fn()
      const { rerender } = render(
        <ListRow
          selection="radio"
          selectionLabel="Record A"
          onSelectedChange={onSelectedChange}
        >
          Record A
        </ListRow>
      )
      const radio = screen.getByRole('radio', { name: 'Record A' })
      expect(radio).not.toBeChecked()
      await user.click(radio)
      expect(onSelectedChange).toHaveBeenCalledWith(true)
      rerender(
        <ListRow selection="radio" selectionLabel="Record A" selected>
          Record A
        </ListRow>
      )
      expect(screen.getByRole('radio', { name: 'Record A' })).toBeChecked()
    })

    it('drops aria-pressed when the row has its own control', () => {
      render(
        <ListRow
          selection="checkbox"
          selectionLabel="Record A"
          selected
          onClick={() => {}}
        >
          Record A
        </ListRow>
      )
      expect(
        screen.getByRole('button', { name: /Record A/ })
      ).not.toHaveAttribute('aria-pressed')
    })
  })

  it('requires a label whenever a selection control is shown', () => {
    // @ts-expect-error selectionLabel is required with selection
    const row = <ListRow selection="checkbox">Record A</ListRow>
    expect(row).toBeTruthy()
  })
})
