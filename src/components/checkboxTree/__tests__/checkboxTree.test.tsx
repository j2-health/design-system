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
        name: /Collapse/,
      })
      expect(expandButtons.length).toBe(4) // Documents, Projects, Reports, Media
      expandButtons.forEach((button) => {
        expect(button).toHaveAttribute('aria-expanded', 'true')
      })
    })

    it('should collapse children on toggle click', () => {
      render(<CheckboxTree treeData={simpleTreeData} />)

      const documentsToggle = screen.getAllByRole('button', {
        name: /Collapse/,
      })[0]
      fireEvent.click(documentsToggle)

      expect(documentsToggle).toHaveAttribute('aria-expanded', 'false')
    })

    it('should re-expand children on second toggle click', () => {
      render(<CheckboxTree treeData={simpleTreeData} />)

      const documentsToggle = screen.getAllByRole('button', {
        name: /Collapse/,
      })[0]

      // Collapse
      fireEvent.click(documentsToggle)
      expect(documentsToggle).toHaveAttribute('aria-expanded', 'false')

      // Re-expand
      fireEvent.click(documentsToggle)
      expect(documentsToggle).toHaveAttribute('aria-expanded', 'true')
    })

    it('should start collapsed when defaultExpandAll is false', () => {
      render(
        <CheckboxTree treeData={simpleTreeData} defaultExpandAll={false} />
      )

      const expandButtons = screen.getAllByRole('button', { name: /Expand/ })
      expect(expandButtons.length).toBe(4) // Documents, Projects, Reports, Media

      expandButtons.forEach((button) => {
        expect(button).toHaveAttribute('aria-expanded', 'false')
      })
    })

    it('should expand only specified keys with defaultExpandedKeys', () => {
      render(
        <CheckboxTree treeData={simpleTreeData} defaultExpandedKeys={['1']} />
      )

      // Media (key '1') should be expanded
      const mediaExpandBtn = screen.getByRole('button', {
        name: /Collapse/,
      })
      expect(mediaExpandBtn).toBeTruthy()

      // Documents (key '0'), Projects (key '0-0'), Reports (key '0-1') should be collapsed
      const collapsedButtons = screen.getAllByRole('button', {
        name: /Expand/,
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
      const documentsToggle = screen.getByRole('button', {
        name: /Collapse/,
      })
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
        name: /Collapse/,
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
        name: /Collapse/,
      })[0]
      fireEvent.click(toggleButton)

      expect(onCheck).not.toHaveBeenCalled()
    })
  })

  describe('checking', () => {
    it('should call onCheck when a leaf node is checked', () => {
      const onCheck = vi.fn()
      render(<CheckboxTree treeData={simpleTreeData} onCheck={onCheck} />)

      const projectA = screen.getByLabelText('Project A')
      fireEvent.click(projectA)

      expect(onCheck).toHaveBeenCalledTimes(1)
      const [values, info] = onCheck.mock.calls[0]
      expect(values['0-0-0']).toBe(true)
      expect(info.checked).toBe(true)
      expect(info.node.key).toBe('0-0-0')
      expect(info.checkedLeafNodes).toHaveProperty('0-0-0')
      expect(info.allCheckedNodes).toEqual(
        expect.arrayContaining([expect.objectContaining({ key: '0-0-0' })])
      )
    })

    it('should check all leaf descendants when a parent is checked', () => {
      const onCheck = vi.fn()
      render(<CheckboxTree treeData={simpleTreeData} onCheck={onCheck} />)

      const documents = screen.getByLabelText('Documents')
      fireEvent.click(documents)

      expect(onCheck).toHaveBeenCalledTimes(1)
      const [values] = onCheck.mock.calls[0]
      expect(values['0-0-0']).toBe(true)
      expect(values['0-0-1']).toBe(true)
      expect(values['0-1-0']).toBe(true)
      expect(values['0-1-1']).toBe(true)
    })

    it('should uncheck all leaf descendants when a parent is unchecked', () => {
      const onCheck = vi.fn()
      render(
        <CheckboxTree
          treeData={simpleTreeData}
          defaultCheckedKeys={['0-0-0', '0-0-1', '0-1-0', '0-1-1']}
          onCheck={onCheck}
        />
      )

      const documents = screen.getByLabelText('Documents')
      fireEvent.click(documents)

      expect(onCheck).toHaveBeenCalledTimes(1)
      const [values] = onCheck.mock.calls[0]
      expect(values['0-0-0']).toBe(false)
      expect(values['0-0-1']).toBe(false)
      expect(values['0-1-0']).toBe(false)
      expect(values['0-1-1']).toBe(false)
    })

    it('should not fire onCheck when disabled', () => {
      const onCheck = vi.fn()
      render(
        <CheckboxTree treeData={simpleTreeData} onCheck={onCheck} disabled />
      )

      const projectA = screen.getByLabelText('Project A')
      fireEvent.click(projectA)

      expect(onCheck).not.toHaveBeenCalled()
    })

    it('should not fire onCheck on a disabled node', () => {
      const onCheck = vi.fn()
      const treeDataWithDisabledNode = [
        {
          key: '0',
          title: 'Parent',
          children: [
            { key: '0-0', title: 'Enabled' },
            { key: '0-1', title: 'Disabled', disabled: true },
          ],
        },
      ]
      render(
        <CheckboxTree treeData={treeDataWithDisabledNode} onCheck={onCheck} />
      )

      const disabledNode = screen.getByLabelText('Disabled')
      fireEvent.click(disabledNode)

      expect(onCheck).not.toHaveBeenCalled()
    })

    it('should honor defaultCheckedKeys for leaf nodes', () => {
      const onCheck = vi.fn()
      render(
        <CheckboxTree
          treeData={simpleTreeData}
          defaultCheckedKeys={['0-0-0', '1-0']}
          onCheck={onCheck}
        />
      )

      // Click another leaf to trigger onCheck and inspect the values
      const projectB = screen.getByLabelText('Project B')
      fireEvent.click(projectB)

      const [values] = onCheck.mock.calls[0]
      expect(values['0-0-0']).toBe(true) // default checked
      expect(values['1-0']).toBe(true) // default checked
      expect(values['0-0-1']).toBe(true) // just clicked
    })

    it('should ignore parent keys in defaultCheckedKeys', () => {
      const onCheck = vi.fn()
      render(
        <CheckboxTree
          treeData={simpleTreeData}
          defaultCheckedKeys={['0']}
          onCheck={onCheck}
        />
      )

      // Click a leaf to trigger onCheck and inspect values
      const images = screen.getByLabelText('Images')
      fireEvent.click(images)

      const [values] = onCheck.mock.calls[0]
      // Parent key '0' should not have checked its leaf descendants
      expect(values['0-0-0']).toBe(false)
      expect(values['0-0-1']).toBe(false)
      expect(values['0-1-0']).toBe(false)
      expect(values['0-1-1']).toBe(false)
    })

    it('should support controlled checkedKeys', () => {
      const { rerender } = render(
        <CheckboxTree treeData={simpleTreeData} checkedKeys={['0-0-0']} />
      )

      const projectA = screen.getByLabelText('Project A') as HTMLInputElement
      expect(projectA.checked).toBe(true)

      rerender(<CheckboxTree treeData={simpleTreeData} checkedKeys={[]} />)

      expect(projectA.checked).toBe(false)
    })

    it('should render nothing for empty treeData', () => {
      const { container } = render(<CheckboxTree treeData={[]} />)
      expect(container.firstChild).toBeEmptyDOMElement()
    })
  })
})
