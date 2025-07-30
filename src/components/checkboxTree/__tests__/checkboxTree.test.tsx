import { render } from '@testing-library/react'
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
      <CheckboxTree 
        treeData={simpleTreeData} 
        disabled 
      />
    )
    expect(container).toMatchSnapshot()
  })
})