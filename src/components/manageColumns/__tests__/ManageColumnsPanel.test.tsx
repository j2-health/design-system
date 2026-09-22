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
})
