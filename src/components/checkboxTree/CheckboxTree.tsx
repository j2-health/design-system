import React, { useState, useCallback } from 'react'
import { TreeNode } from './TreeNode'
import { getLeafKeys, getAllLeafKeys, isNodeChecked, findNode } from './utils'

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
    values: Record<string | number, boolean>,
    info: {
      checked: boolean
      checkedLeafNodes: Record<string | number, CheckboxTreeDataNode>
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
  // Get all leaf keys from tree data
  const allLeafKeys = getAllLeafKeys(treeData)

  // Filter defaultCheckedKeys to only include leaf nodes
  const defaultLeafKeys = defaultCheckedKeys.filter((key) => {
    const node = findNode(key, treeData)
    return node && (!node.children || node.children.length === 0)
  })

  const [internalLeafNodeStates, setInternalLeafNodeStates] = useState<
    Record<string | number, boolean>
  >(() => {
    const states: Record<string | number, boolean> = {}
    allLeafKeys.forEach((key) => {
      states[key] = defaultLeafKeys.includes(key)
    })
    return states
  })

  // Filter controlledCheckedKeys to only include leaf nodes
  const controlledLeafKeys = controlledCheckedKeys
    ? controlledCheckedKeys.filter((key) => {
        const node = findNode(key, treeData)
        return node && (!node.children || node.children.length === 0)
      })
    : undefined

  const leafNodeStates = controlledLeafKeys
    ? (() => {
        const states: Record<string | number, boolean> = {}
        allLeafKeys.forEach((key) => {
          states[key] = controlledLeafKeys.includes(key)
        })
        return states
      })()
    : internalLeafNodeStates

  const handleCheck = useCallback(
    (_key: string | number, checked: boolean, node: CheckboxTreeDataNode) => {
      const newLeafNodeStates = { ...leafNodeStates }

      if (checked) {
        // When checking, set all leaf descendants to true
        const leafKeys = getLeafKeys(node)
        leafKeys.forEach((leafKey) => (newLeafNodeStates[leafKey] = true))
      } else {
        // When unchecking, set all leaf descendants to false
        const leafKeys = getLeafKeys(node)
        leafKeys.forEach((leafKey) => (newLeafNodeStates[leafKey] = false))
      }

      if (!controlledCheckedKeys) {
        setInternalLeafNodeStates(newLeafNodeStates)
      }

      if (onCheck) {
        // Get all checked leaf nodes
        const checkedLeafNodes: Record<string | number, CheckboxTreeDataNode> =
          {}

        // Get all nodes that appear checked (including parents)
        const allCheckedNodes: CheckboxTreeDataNode[] = []

        const traverse = (nodes: CheckboxTreeDataNode[]) => {
          nodes.forEach((node) => {
            if (isNodeChecked(node, newLeafNodeStates)) {
              allCheckedNodes.push(node)

              // If it's a leaf node, add to checkedLeafNodes
              if (!node.children || node.children.length === 0) {
                checkedLeafNodes[node.key] = node
              }
            }
            if (node.children) {
              traverse(node.children)
            }
          })
        }
        traverse(treeData)

        onCheck(newLeafNodeStates, {
          checked,
          checkedLeafNodes,
          allCheckedNodes,
          node,
        })
      }
    },
    [internalLeafNodeStates, controlledCheckedKeys, onCheck, treeData]
  )

  return (
    <div className={className} style={style}>
      {treeData.map((node) => (
        <TreeNode
          key={node.key}
          node={node}
          level={0}
          leafNodeStates={leafNodeStates}
          onCheck={handleCheck}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
