import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ManageColumnsSelectAll } from '../ManageColumnsSelectAll'
import {
  ManageColumnsPanel,
  type ManageColumnsColumn,
} from '../ManageColumnsPanel'

const columns: ManageColumnsColumn[] = [
  { id: 'name', label: 'Name', visible: true, pinned: true },
  { id: 'category', label: 'Category', visible: true },
  { id: 'status', label: 'Status', visible: false },
]

describe('ManageColumnsSelectAll', () => {
  it('shows "Select all" when some toggleable columns are hidden', () => {
    render(<ManageColumnsSelectAll columns={columns} onToggle={() => {}} />)
    expect(
      screen.getByRole('button', { name: 'Select all' })
    ).toBeInTheDocument()
  })

  it('shows "Clear all" once every toggleable column is visible', () => {
    const allVisible = columns.map((c) => ({ ...c, visible: true }))
    render(<ManageColumnsSelectAll columns={allVisible} onToggle={() => {}} />)
    expect(
      screen.getByRole('button', { name: 'Clear all' })
    ).toBeInTheDocument()
  })

  it('select-all toggles only the currently-hidden, non-pinned columns', () => {
    const onToggle = vi.fn()
    render(<ManageColumnsSelectAll columns={columns} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button', { name: 'Select all' }))
    // 'name' is pinned (excluded) and already visible; 'category' is already
    // visible; only 'status' is hidden.
    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith('status')
  })

  it('clear-all toggles every currently-visible, non-pinned column', () => {
    const onToggle = vi.fn()
    const allVisible = columns.map((c) => ({ ...c, visible: true }))
    render(<ManageColumnsSelectAll columns={allVisible} onToggle={onToggle} />)
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
      <ManageColumnsSelectAll
        columns={allVisible}
        onToggle={onToggle}
        onToggleAll={onToggleAll}
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
      <ManageColumnsSelectAll
        columns={allVisible}
        onToggle={staleSnapshotToggle}
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
      <ManageColumnsSelectAll
        columns={allVisible}
        onToggle={staleSnapshotToggle}
        onToggleAll={onToggleAll}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }))
    // Fixed: one call, one snapshot resolution, both columns land.
    expect(visibility).toEqual({ category: false, status: false })
  })

  it('renders nothing when every column is pinned', () => {
    const allPinned = columns.map((c) => ({ ...c, pinned: true }))
    const { container } = render(
      <ManageColumnsSelectAll columns={allPinned} onToggle={() => {}} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('is meant to pair with ManageColumnsPanel, not replace it', () => {
    // Sanity check that both components accept the same `columns` shape —
    // a consumer renders them side by side (e.g. one in a header, one in
    // the panel body), not one instead of the other.
    render(
      <>
        <ManageColumnsSelectAll columns={columns} onToggle={() => {}} />
        <ManageColumnsPanel
          columns={columns}
          onToggle={() => {}}
          onReorder={() => {}}
        />
      </>
    )
    expect(
      screen.getByRole('button', { name: 'Select all' })
    ).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
  })
})
