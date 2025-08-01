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

export const isNodeChecked = (
  node: CheckboxTreeDataNode,
  leafNodeStates: Record<string | number, boolean>
): boolean => {
  if (!node.children || node.children.length === 0) {
    // Leaf node - check if it's checked
    return leafNodeStates[node.key] === true
  }

  // Parent node - check if all leaf descendants are checked
  const leafKeys = getLeafKeys(node)
  return (
    leafKeys.length > 0 && leafKeys.every((key) => leafNodeStates[key] === true)
  )
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
