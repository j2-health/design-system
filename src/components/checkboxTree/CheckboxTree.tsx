import React, { useState, useCallback } from 'react'
import { TreeNode } from './TreeNode'

export type CheckboxTreeDataNode = {
  key: string | number
  title: React.ReactNode
  children?: CheckboxTreeDataNode[]
  disabled?: boolean
  disableCheckbox?: boolean
}

const getChildrenKeys = (node: CheckboxTreeDataNode): (string | number)[] => {
  const keys: (string | number)[] = []
  const traverse = (currentNode: CheckboxTreeDataNode) => {
    if (currentNode.children) {
      currentNode.children.forEach((child) => {
        keys.push(child.key)
        traverse(child)
      })
    }
  }
  traverse(node)
  return keys
}

const getParentKey = (
  key: string | number,
  nodes: CheckboxTreeDataNode[]
): string | number | null => {
  for (const node of nodes) {
    if (node.children) {
      if (node.children.some((child) => child.key === key)) {
        return node.key
      }
      const parentKey = getParentKey(key, node.children)
      if (parentKey !== null) {
        return parentKey
      }
    }
  }
  return null
}

const findNode = (
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

export type CheckboxTreeProps = {
  treeData: CheckboxTreeDataNode[]
  defaultCheckedKeys?: (string | number)[]
  checkedKeys?: (string | number)[]
  onCheck?: (
    checkedKeys: (string | number)[],
    info: {
      checked: boolean
      checkedNodes: CheckboxTreeDataNode[]
      node: CheckboxTreeDataNode
    }
  ) => void
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export const CheckboxTree = ({
  treeData,
  defaultCheckedKeys = [],
  checkedKeys: controlledCheckedKeys,
  onCheck,
  disabled = false,
  className,
  style,
}: CheckboxTreeProps) => {
  const [internalCheckedKeys, setInternalCheckedKeys] = useState<
    Set<string | number>
  >(() => new Set(defaultCheckedKeys))

  const checkedKeys = controlledCheckedKeys
    ? new Set(controlledCheckedKeys)
    : internalCheckedKeys

  const handleCheck = useCallback(
    (key: string | number, checked: boolean, node: CheckboxTreeDataNode) => {
      const newCheckedKeys = new Set(checkedKeys)

      if (checked) {
        newCheckedKeys.add(key)
        // Check all children when parent is checked
        const childrenKeys = getChildrenKeys(node)
        childrenKeys.forEach((childKey) => newCheckedKeys.add(childKey))
      } else {
        newCheckedKeys.delete(key)
        // Uncheck all children when parent is unchecked
        const childrenKeys = getChildrenKeys(node)
        childrenKeys.forEach((childKey) => newCheckedKeys.delete(childKey))
      }

      // Update parent nodes based on children state
      let parentKey = getParentKey(key, treeData)
      while (parentKey !== null) {
        const parentNode = findNode(parentKey, treeData)
        if (parentNode && parentNode.children) {
          const allChildrenChecked = parentNode.children.every((child) =>
            newCheckedKeys.has(child.key)
          )

          if (allChildrenChecked) {
            newCheckedKeys.add(parentKey)
          } else {
            // If not all children are checked, uncheck the parent
            newCheckedKeys.delete(parentKey)
          }
        }
        parentKey = getParentKey(parentKey, treeData)
      }

      if (!controlledCheckedKeys) {
        setInternalCheckedKeys(newCheckedKeys)
      }

      if (onCheck) {
        const checkedNodes: CheckboxTreeDataNode[] = []
        const traverse = (nodes: CheckboxTreeDataNode[]) => {
          nodes.forEach((node) => {
            if (newCheckedKeys.has(node.key)) {
              checkedNodes.push(node)
            }
            if (node.children) {
              traverse(node.children)
            }
          })
        }
        traverse(treeData)

        onCheck(Array.from(newCheckedKeys), {
          checked,
          checkedNodes,
          node,
        })
      }
    },
    [checkedKeys, controlledCheckedKeys, onCheck, treeData]
  )

  return (
    <div className={className} style={style}>
      {treeData.map((node) => (
        <TreeNode
          key={node.key}
          node={node}
          level={0}
          checkedKeys={checkedKeys}
          onCheck={handleCheck}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
