import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  ManageColumnsPanel,
  type ManageColumnsColumn,
} from '../ManageColumnsPanel'

const columns: ManageColumnsColumn[] = [
  { id: 'name', label: 'Name', visible: true, pinned: true },
  { id: 'category', label: 'Category', visible: true },
  { id: 'status', label: 'Status', visible: false },
]

describe('ManageColumnsPanel', () => {
  it('renders every column label', () => {
    render(
      <ManageColumnsPanel
        columns={columns}
        onToggle={() => {}}
        onReorder={() => {}}
      />
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('calls onToggle with the column id when its checkbox is clicked', () => {
    const onToggle = vi.fn()
    render(
      <ManageColumnsPanel
        columns={columns}
        onToggle={onToggle}
        onReorder={() => {}}
      />
    )
    fireEvent.click(screen.getByLabelText('Category'))
    expect(onToggle).toHaveBeenCalledWith('category')
  })

  it('renders pinned columns as checked, disabled, and without a drag handle', () => {
    render(
      <ManageColumnsPanel
        columns={columns}
        onToggle={() => {}}
        onReorder={() => {}}
      />
    )
    const pinnedCheckbox = screen.getByLabelText('Name')
    expect(pinnedCheckbox).toBeChecked()
    expect(pinnedCheckbox).toBeDisabled()
    expect(
      screen.queryByLabelText('Drag to reorder Name')
    ).not.toBeInTheDocument()
    expect(
      screen.getByLabelText('Drag to reorder Category')
    ).toBeInTheDocument()
  })

  it('does not call onToggle when a pinned checkbox is clicked', () => {
    const onToggle = vi.fn()
    render(
      <ManageColumnsPanel
        columns={columns}
        onToggle={onToggle}
        onReorder={() => {}}
      />
    )
    fireEvent.click(screen.getByLabelText('Name'))
    expect(onToggle).not.toHaveBeenCalled()
  })

  it('shows "Select all" when some toggleable columns are hidden', () => {
    render(
      <ManageColumnsPanel
        columns={columns}
        onToggle={() => {}}
        onReorder={() => {}}
      />
    )
    expect(
      screen.getByRole('button', { name: 'Select all' })
    ).toBeInTheDocument()
  })

  it('shows "Clear all" once every toggleable column is visible', () => {
    const allVisible = columns.map((c) => ({ ...c, visible: true }))
    render(
      <ManageColumnsPanel
        columns={allVisible}
        onToggle={() => {}}
        onReorder={() => {}}
      />
    )
    expect(
      screen.getByRole('button', { name: 'Clear all' })
    ).toBeInTheDocument()
  })

  it('select-all toggles only the currently-hidden, non-pinned columns', () => {
    const onToggle = vi.fn()
    render(
      <ManageColumnsPanel
        columns={columns}
        onToggle={onToggle}
        onReorder={() => {}}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Select all' }))
    // 'name' is pinned (excluded) and already visible; 'category' is already
    // visible; only 'status' is hidden.
    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith('status')
  })

  it('clear-all toggles every currently-visible, non-pinned column', () => {
    const onToggle = vi.fn()
    const allVisible = columns.map((c) => ({ ...c, visible: true }))
    render(
      <ManageColumnsPanel
        columns={allVisible}
        onToggle={onToggle}
        onReorder={() => {}}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }))
    // 'name' is pinned and excluded; 'category' and 'status' are both
    // toggleable and visible, so clear-all hides both.
    expect(onToggle).toHaveBeenCalledTimes(2)
    expect(onToggle).toHaveBeenCalledWith('category')
    expect(onToggle).toHaveBeenCalledWith('status')
  })

  it('prefers onToggleAll over the onToggle loop when both are provided', () => {
    const onToggle = vi.fn()
    const onToggleAll = vi.fn()
    const allVisible = columns.map((c) => ({ ...c, visible: true }))
    render(
      <ManageColumnsPanel
        columns={allVisible}
        onToggle={onToggle}
        onToggleAll={onToggleAll}
        onReorder={() => {}}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }))
    expect(onToggleAll).toHaveBeenCalledTimes(1)
    expect(onToggleAll).toHaveBeenCalledWith(['category', 'status'], false)
    expect(onToggle).not.toHaveBeenCalled()
  })

  it('onToggleAll fixes the stale-snapshot bug a naive onToggle loop hits', () => {
    // renderSnapshot is frozen once, like a real render's closure over
    // state — re-reading `visibility` fresh each call would self-correct
    // and fail to reproduce the bug.
    let visibility: Record<string, boolean> = { category: true, status: true }
    const renderSnapshot = visibility
    const staleSnapshotToggle = (id: string) => {
      visibility = { ...renderSnapshot, [id]: !renderSnapshot[id] }
    }
    const allVisible = columns.map((c) => ({ ...c, visible: true }))

    const { unmount } = render(
      <ManageColumnsPanel
        columns={allVisible}
        onToggle={staleSnapshotToggle}
        onReorder={() => {}}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }))
    expect(visibility).toEqual({ category: true, status: false })
    unmount()

    visibility = { category: true, status: true }
    const onToggleAll = (ids: string[], visible: boolean) => {
      const next = { ...visibility }
      ids.forEach((id) => {
        next[id] = visible
      })
      visibility = next
    }
    render(
      <ManageColumnsPanel
        columns={allVisible}
        onToggle={staleSnapshotToggle}
        onToggleAll={onToggleAll}
        onReorder={() => {}}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }))
    // Fixed: one call, one snapshot resolution, both columns land.
    expect(visibility).toEqual({ category: false, status: false })
  })

  it('hides the select-all footer when every column is pinned', () => {
    const allPinned = columns.map((c) => ({ ...c, pinned: true }))
    render(
      <ManageColumnsPanel
        columns={allPinned}
        onToggle={() => {}}
        onReorder={() => {}}
      />
    )
    expect(
      screen.queryByRole('button', { name: /select all|clear all/i })
    ).not.toBeInTheDocument()
  })

  it('renders custom description text when provided', () => {
    render(
      <ManageColumnsPanel
        columns={columns}
        onToggle={() => {}}
        onReorder={() => {}}
        description="Custom copy"
      />
    )
    expect(screen.getByText('Custom copy')).toBeInTheDocument()
  })

  it('renders no description paragraph when none is provided', () => {
    const { container } = render(
      <ManageColumnsPanel
        columns={columns}
        onToggle={() => {}}
        onReorder={() => {}}
      />
    )
    expect(container.querySelector('p')).not.toBeInTheDocument()
  })

  it('sets a title attribute on the label so a truncated name is still readable', () => {
    render(
      <ManageColumnsPanel
        columns={columns}
        onToggle={() => {}}
        onReorder={() => {}}
      />
    )
    expect(screen.getByText('Category')).toHaveAttribute('title', 'Category')
  })

  it('renders no scroll container of its own', () => {
    // Plain flow content, scrolled by whichever ancestor owns the
    // scrollbar (e.g. DataTableSidePanel's own overflow-y-auto region).
    const { container } = render(
      <ManageColumnsPanel
        columns={columns}
        onToggle={() => {}}
        onReorder={() => {}}
      />
    )
    expect(container.querySelector('.overflow-y-auto')).toBeNull()
  })

  it('renders the select-all footer as plain, non-sticky flow content', () => {
    render(
      <ManageColumnsPanel
        columns={columns}
        onToggle={() => {}}
        onReorder={() => {}}
      />
    )
    const footer = screen.getByRole('button', {
      name: 'Select all',
    }).parentElement
    expect(footer?.className).not.toContain('sticky')
  })

  it('renders the select-all footer after every column row', () => {
    const { container } = render(
      <ManageColumnsPanel
        columns={columns}
        onToggle={() => {}}
        onReorder={() => {}}
      />
    )
    const footer = screen.getByRole('button', { name: 'Select all' })
    const rows = [...container.querySelectorAll('.ant-checkbox-wrapper')]
    const lastRow = rows[rows.length - 1]
    expect(
      lastRow.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })
})
