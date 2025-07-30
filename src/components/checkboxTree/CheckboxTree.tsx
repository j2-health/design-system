import React, { useState, useCallback } from 'react'
import { TreeNode } from './TreeNode'
import { getLeafKeys, isNodeChecked, findNode } from './utils'

export type CheckboxTreeDataNode = {
  key: string | number
  title: React.ReactNode
  children?: CheckboxTreeDataNode[]
  disabled?: boolean
  disableCheckbox?: boolean
}

export type CheckboxTreeProps = {
  treeData: CheckboxTreeDataNode[]
  defaultCheckedKeys?: (string | number)[]
  checkedKeys?: (string | number)[]
  onCheck?: (
    checkedLeafKeys: (string | number)[],
    info: {
      checked: boolean
      checkedLeafNodes: CheckboxTreeDataNode[]
      allCheckedNodes: CheckboxTreeDataNode[]
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
  // Filter defaultCheckedKeys to only include leaf nodes
  const defaultLeafKeys = defaultCheckedKeys.filter((key) => {
    const node = findNode(key, treeData)
    return node && (!node.children || node.children.length === 0)
  })

  const [internalCheckedLeafKeys, setInternalCheckedLeafKeys] = useState<
    Set<string | number>
  >(() => new Set(defaultLeafKeys))

  // Filter controlledCheckedKeys to only include leaf nodes
  const controlledLeafKeys = controlledCheckedKeys
    ? controlledCheckedKeys.filter((key) => {
        const node = findNode(key, treeData)
        return node && (!node.children || node.children.length === 0)
      })
    : undefined

  const checkedLeafKeys = controlledLeafKeys
    ? new Set(controlledLeafKeys)
    : internalCheckedLeafKeys

  const handleCheck = useCallback(
    (_key: string | number, checked: boolean, node: CheckboxTreeDataNode) => {
      const newCheckedLeafKeys = new Set(checkedLeafKeys)

      if (checked) {
        // When checking, add all leaf descendants
        const leafKeys = getLeafKeys(node)
        leafKeys.forEach((leafKey) => newCheckedLeafKeys.add(leafKey))
      } else {
        // When unchecking, remove all leaf descendants
        const leafKeys = getLeafKeys(node)
        leafKeys.forEach((leafKey) => newCheckedLeafKeys.delete(leafKey))
      }

      if (!controlledCheckedKeys) {
        setInternalCheckedLeafKeys(newCheckedLeafKeys)
      }

      if (onCheck) {
        // Get all checked leaf nodes
        const checkedLeafNodes: CheckboxTreeDataNode[] = []

        // Get all nodes that appear checked (including parents)
        const allCheckedNodes: CheckboxTreeDataNode[] = []

        const traverse = (nodes: CheckboxTreeDataNode[]) => {
          nodes.forEach((node) => {
            if (isNodeChecked(node, newCheckedLeafKeys)) {
              allCheckedNodes.push(node)

              // If it's a leaf node, add to checkedLeafNodes
              if (!node.children || node.children.length === 0) {
                checkedLeafNodes.push(node)
              }
            }
            if (node.children) {
              traverse(node.children)
            }
          })
        }
        traverse(treeData)

        onCheck(Array.from(newCheckedLeafKeys), {
          checked,
          checkedLeafNodes,
          allCheckedNodes,
          node,
        })
      }
    },
    [checkedLeafKeys, controlledCheckedKeys, onCheck, treeData]
  )

  return (
    <div className={className} style={style}>
      {treeData.map((node) => (
        <TreeNode
          key={node.key}
          node={node}
          level={0}
          checkedLeafKeys={checkedLeafKeys}
          onCheck={handleCheck}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
