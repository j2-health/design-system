import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StatusPill } from '../StatusPill'

describe('StatusPill', () => {
  it('makes the label a button with onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<StatusPill label="Unsaved" detail="3" onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: /Unsaved/ }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('keeps trailing clicks away from the label', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onSave = vi.fn()
    render(
      <StatusPill
        label="Unsaved"
        onClick={onClick}
        trailing={
          <button type="button" onClick={onSave}>
            Save
          </button>
        }
      />
    )
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(onSave).toHaveBeenCalledOnce()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('opens a menu from the label', async () => {
    const user = userEvent.setup()
    render(
      <StatusPill
        label="Preview"
        labelAriaLabel="Preview actions"
        menu={{ items: [{ key: 'reset', label: 'Reset' }] }}
      />
    )
    await user.click(screen.getByRole('button', { name: 'Preview actions' }))
    expect(await screen.findByText('Reset')).toBeInTheDocument()
  })

  it('renders a static label when disabled or not interactive', () => {
    render(<StatusPill label="Nothing yet" disabled onClick={() => {}} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByText('Nothing yet')).toBeInTheDocument()
  })
})
