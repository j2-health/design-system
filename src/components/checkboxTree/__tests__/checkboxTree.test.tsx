import { render, screen, fireEvent } from '@testing-library/react'
import { CheckboxTree } from '../CheckboxTree'

const simpleTreeData = [
  {
    key: '0',
    title: 'Documents',
    children: [
      {
        key: '0-0',
        title: 'Projects',
        children: [
          { key: '0-0-0', title: 'Project A' },
          { key: '0-0-1', title: 'Project B' },
        ],
      },
      {
        key: '0-1',
        title: 'Reports',
        children: [
          { key: '0-1-0', title: 'Annual Report' },
          { key: '0-1-1', title: 'Monthly Report' },
        ],
      },
    ],
  },
  {
    key: '1',
    title: 'Media',
    children: [
      { key: '1-0', title: 'Images' },
      { key: '1-1', title: 'Videos' },
    ],
  },
]

const flatTreeData = [
  { key: 'a', title: 'Item A' },
  { key: 'b', title: 'Item B' },
  { key: 'c', title: 'Item C' },
]

describe('CheckboxTree', () => {
  it('should render correctly', () => {
    const { container } = render(<CheckboxTree treeData={simpleTreeData} />)
    expect(container).toMatchSnapshot()
  })

  it('should render with some checked items', () => {
    const { container } = render(
      <CheckboxTree
        treeData={simpleTreeData}
        defaultCheckedKeys={['0-0-0', '1-0']}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should render disabled', () => {
    const { container } = render(
      <CheckboxTree treeData={simpleTreeData} disabled />
    )
    expect(container).toMatchSnapshot()
  })

  describe('expand/collapse', () => {
    it('should render all nodes expanded by default', () => {
      render(<CheckboxTree treeData={simpleTreeData} />)

      expect(screen.getByText('Project A')).toBeTruthy()
      expect(screen.getByText('Project B')).toBeTruthy()
      expect(screen.getByText('Images')).toBeTruthy()
      expect(screen.getByText('Videos')).toBeTruthy()

      const expandButtons = screen.getAllByRole('button', {
        name: 'Collapse',
      })
      expect(expandButtons.length).toBe(4) // Documents, Projects, Reports, Media
    })

    it('should collapse children on toggle click', () => {
      render(<CheckboxTree treeData={simpleTreeData} />)

      const documentsToggle = screen.getAllByRole('button', {
        name: 'Collapse',
      })[0]
      fireEvent.click(documentsToggle)

      // Button label should change to Expand
      expect(documentsToggle).toHaveAttribute('aria-label', 'Expand')

      // Children container should have grid-template-rows: 0fr
      const childrenContainer = documentsToggle
        .closest('div')!
        .parentElement!.querySelector('[style*="grid-template-rows"]')
      expect(childrenContainer).toHaveStyle({ gridTemplateRows: '0fr' })
    })

    it('should re-expand children on second toggle click', () => {
      render(<CheckboxTree treeData={simpleTreeData} />)

      const documentsToggle = screen.getAllByRole('button', {
        name: 'Collapse',
      })[0]

      // Collapse
      fireEvent.click(documentsToggle)
      expect(documentsToggle).toHaveAttribute('aria-label', 'Expand')

      // Re-expand
      fireEvent.click(documentsToggle)
      expect(documentsToggle).toHaveAttribute('aria-label', 'Collapse')

      const childrenContainer = documentsToggle
        .closest('div')!
        .parentElement!.querySelector('[style*="grid-template-rows"]')
      expect(childrenContainer).toHaveStyle({ gridTemplateRows: '1fr' })
    })

    it('should start collapsed when defaultExpandAll is false', () => {
      render(
        <CheckboxTree treeData={simpleTreeData} defaultExpandAll={false} />
      )

      const expandButtons = screen.getAllByRole('button', { name: 'Expand' })
      expect(expandButtons.length).toBe(4) // Documents, Projects, Reports, Media

      // Children containers should be collapsed
      expandButtons.forEach((button) => {
        const childrenContainer = button
          .closest('div')!
          .parentElement!.querySelector('[style*="grid-template-rows"]')
        expect(childrenContainer).toHaveStyle({ gridTemplateRows: '0fr' })
      })
    })

    it('should expand only specified keys with defaultExpandedKeys', () => {
      render(
        <CheckboxTree treeData={simpleTreeData} defaultExpandedKeys={['1']} />
      )

      // Media (key '1') should be expanded
      const mediaExpandBtn = screen.getByRole('button', { name: 'Collapse' })
      expect(mediaExpandBtn).toBeTruthy()

      // Documents (key '0'), Projects (key '0-0'), Reports (key '0-1') should be collapsed
      const collapsedButtons = screen.getAllByRole('button', {
        name: 'Expand',
      })
      expect(collapsedButtons.length).toBe(3)
    })

    it('should support controlled expandedKeys with onExpand', () => {
      const onExpand = vi.fn()

      const { rerender } = render(
        <CheckboxTree
          treeData={simpleTreeData}
          expandedKeys={['0']}
          onExpand={onExpand}
        />
      )

      // Click to collapse Documents
      const documentsToggle = screen.getByRole('button', { name: 'Collapse' })
      fireEvent.click(documentsToggle)

      expect(onExpand).toHaveBeenCalledWith([])

      // Rerender with new controlled keys
      rerender(
        <CheckboxTree
          treeData={simpleTreeData}
          expandedKeys={['0', '1']}
          onExpand={onExpand}
        />
      )

      const collapseButtons = screen.getAllByRole('button', {
        name: 'Collapse',
      })
      expect(collapseButtons.length).toBe(2)
    })

    it('should not render toggle buttons for leaf-only trees', () => {
      render(<CheckboxTree treeData={flatTreeData} />)

      const buttons = screen.queryAllByRole('button')
      expect(buttons.length).toBe(0)
    })

    it('should not fire onCheck when toggle is clicked', () => {
      const onCheck = vi.fn()
      render(<CheckboxTree treeData={simpleTreeData} onCheck={onCheck} />)

      const toggleButton = screen.getAllByRole('button', {
        name: 'Collapse',
      })[0]
      fireEvent.click(toggleButton)

      expect(onCheck).not.toHaveBeenCalled()
    })
  })
})
