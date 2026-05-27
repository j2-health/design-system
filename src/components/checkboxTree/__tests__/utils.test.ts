import {
  getLeafKeys,
  getAllLeafKeys,
  getNodeCheckState,
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

describe('getNodeCheckState', () => {
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

  it('should report a checked leaf', () => {
    expect(
      getNodeCheckState({ key: '0-0-0', title: 'Project A' }, someChecked)
    ).toEqual({ checked: true, indeterminate: false })
  })

  it('should report an unchecked leaf', () => {
    expect(
      getNodeCheckState({ key: '0-0-1', title: 'Project B' }, someChecked)
    ).toEqual({ checked: false, indeterminate: false })
  })

  it('should report a fully-checked parent as checked', () => {
    expect(getNodeCheckState(nestedTree[0], allChecked)).toEqual({
      checked: true,
      indeterminate: false,
    })
  })

  it('should report a partially-checked parent as indeterminate', () => {
    expect(getNodeCheckState(nestedTree[0], someChecked)).toEqual({
      checked: false,
      indeterminate: true,
    })
  })

  it('should report an unchecked parent as neither', () => {
    expect(getNodeCheckState(nestedTree[1], someChecked)).toEqual({
      checked: false,
      indeterminate: false,
    })
  })

  it('should report a partially-checked nested parent as indeterminate', () => {
    // Projects subtree: 0-0-0 checked, 0-0-1 unchecked in someChecked
    expect(getNodeCheckState(nestedTree[0].children![0], someChecked)).toEqual({
      checked: false,
      indeterminate: true,
    })
  })

  it('should report a fully-checked nested parent as checked', () => {
    // Reports subtree: 0-1-0 and 0-1-1 both checked in someChecked
    expect(getNodeCheckState(nestedTree[0].children![1], someChecked)).toEqual({
      checked: true,
      indeterminate: false,
    })
  })

  it('should report neither for a parent with no leaf states', () => {
    expect(getNodeCheckState(nestedTree[0], {})).toEqual({
      checked: false,
      indeterminate: false,
    })
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
