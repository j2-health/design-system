import { CheckboxTreeDataNode } from './CheckboxTree'

export const getLeafKeys = (
  node: CheckboxTreeDataNode
): (string | number)[] => {
  const keys: (string | number)[] = []
  const traverse = (currentNode: CheckboxTreeDataNode) => {
    if (!currentNode.children || currentNode.children.length === 0) {
      // This is a leaf node
      keys.push(currentNode.key)
    } else {
      // This is a parent node, traverse children
      currentNode.children.forEach((child) => traverse(child))
    }
  }
  traverse(node)
  return keys
}

export const getAllLeafKeys = (
  nodes: CheckboxTreeDataNode[]
): (string | number)[] => {
  const keys: (string | number)[] = []
  nodes.forEach((node) => {
    keys.push(...getLeafKeys(node))
  })
  return keys
}

export const getNodeCheckState = (
  node: CheckboxTreeDataNode,
  leafNodeStates: Record<string | number, boolean>
): { checked: boolean; indeterminate: boolean } => {
  let hasChecked = false
  let hasUnchecked = false
  const visit = (current: CheckboxTreeDataNode): boolean => {
    if (!current.children || current.children.length === 0) {
      if (leafNodeStates[current.key] === true) {
        hasChecked = true
      } else {
        hasUnchecked = true
      }
      return hasChecked && hasUnchecked
    }
    return current.children.some(visit)
  }
  visit(node)
  return {
    checked: hasChecked && !hasUnchecked,
    indeterminate: hasChecked && hasUnchecked,
  }
}

export const getAllParentKeys = (
  nodes: CheckboxTreeDataNode[]
): (string | number)[] => {
  const keys: (string | number)[] = []
  const traverse = (currentNodes: CheckboxTreeDataNode[]) => {
    currentNodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        keys.push(node.key)
        traverse(node.children)
      }
    })
  }
  traverse(nodes)
  return keys
}

export const findNode = (
  key: string | number,
  nodes: CheckboxTreeDataNode[]
): CheckboxTreeDataNode | null => {
  for (const node of nodes) {
    if (node.key === key) {
      return node
    }
    if (node.children) {
      const found = findNode(key, node.children)
      if (found) return found
    }
  }
  return null
}
