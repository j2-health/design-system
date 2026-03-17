import {
  getLeafKeys,
  getAllLeafKeys,
  isNodeChecked,
  getAllParentKeys,
} from '../utils'
import { CheckboxTreeDataNode } from '../CheckboxTree'

const nestedTree: CheckboxTreeDataNode[] = [
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

const flatTree: CheckboxTreeDataNode[] = [
  { key: 'a', title: 'Item A' },
  { key: 'b', title: 'Item B' },
  { key: 'c', title: 'Item C' },
]

describe('getLeafKeys', () => {
  it('should return the key itself for a leaf node', () => {
    expect(getLeafKeys({ key: '0-0-0', title: 'Project A' })).toEqual(['0-0-0'])
  })

  it('should return all leaf descendant keys for a parent node', () => {
    expect(getLeafKeys(nestedTree[0])).toEqual([
      '0-0-0',
      '0-0-1',
      '0-1-0',
      '0-1-1',
    ])
  })

  it('should return leaf keys for a shallow parent', () => {
    expect(getLeafKeys(nestedTree[1])).toEqual(['1-0', '1-1'])
  })
})

describe('getAllLeafKeys', () => {
  it('should return all leaf keys across multiple top-level nodes', () => {
    expect(getAllLeafKeys(nestedTree)).toEqual([
      '0-0-0',
      '0-0-1',
      '0-1-0',
      '0-1-1',
      '1-0',
      '1-1',
    ])
  })

  it('should return keys directly for a flat tree', () => {
    expect(getAllLeafKeys(flatTree)).toEqual(['a', 'b', 'c'])
  })

  it('should return empty array for empty input', () => {
    expect(getAllLeafKeys([])).toEqual([])
  })
})

describe('isNodeChecked', () => {
  const allChecked: Record<string, boolean> = {
    '0-0-0': true,
    '0-0-1': true,
    '0-1-0': true,
    '0-1-1': true,
    '1-0': true,
    '1-1': true,
  }

  const someChecked: Record<string, boolean> = {
    '0-0-0': true,
    '0-0-1': false,
    '0-1-0': true,
    '0-1-1': true,
    '1-0': false,
    '1-1': false,
  }

  it('should return true for a checked leaf', () => {
    expect(
      isNodeChecked({ key: '0-0-0', title: 'Project A' }, allChecked)
    ).toBe(true)
  })

  it('should return false for an unchecked leaf', () => {
    expect(
      isNodeChecked({ key: '0-0-1', title: 'Project B' }, someChecked)
    ).toBe(false)
  })

  it('should return true when all leaf descendants are checked', () => {
    expect(isNodeChecked(nestedTree[0], allChecked)).toBe(true)
  })

  it('should return false when some leaf descendants are unchecked', () => {
    expect(isNodeChecked(nestedTree[0], someChecked)).toBe(false)
  })

  it('should return true for a parent subtree with all leaves checked', () => {
    // Reports subtree: 0-1-0 and 0-1-1 are both true in someChecked
    expect(isNodeChecked(nestedTree[0].children![1], someChecked)).toBe(true)
  })

  it('should return false for a parent with no leaf states', () => {
    expect(isNodeChecked(nestedTree[0], {})).toBe(false)
  })
})

describe('getAllParentKeys', () => {
  it('should return all parent keys in the tree', () => {
    expect(getAllParentKeys(nestedTree)).toEqual(['0', '0-0', '0-1', '1'])
  })

  it('should return empty array for a flat tree', () => {
    expect(getAllParentKeys(flatTree)).toEqual([])
  })

  it('should return empty array for empty input', () => {
    expect(getAllParentKeys([])).toEqual([])
  })
})
