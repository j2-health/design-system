import React, { useState, useCallback, useMemo } from 'react'
import { TreeNode } from './TreeNode'
import { getLeafKeys, getAllLeafKeys, isNodeChecked, findNode } from './utils'

export type CheckboxTreeDataNode = {
  key: string | number
  title: React.ReactNode
  children?: CheckboxTreeDataNode[]
  disabled?: boolean
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

  const [internalLeafNodeValues, setInternalLeafNodeValues] = useState<
    Record<string | number, boolean>
  >(() =>
    allLeafKeys.reduce(
      (acc, key) => {
        return {
          ...acc,
          [key]: defaultLeafKeys.includes(key),
        }
      },
      {} as Record<string | number, boolean>
    )
  )

  const leafNodeValues: Record<string | number, boolean> = useMemo(() => {
    if (!controlledCheckedKeys) {
      return internalLeafNodeValues
    }

    // Filter controlledCheckedKeys to only include leaf nodes
    const controlledLeafKeys = controlledCheckedKeys.filter((key) => {
      const node = findNode(key, treeData)
      return node && (!node.children || node.children.length === 0)
    })

    return allLeafKeys.reduce(
      (acc, key) => {
        return {
          ...acc,
          [key]: controlledLeafKeys.includes(key),
        }
      },
      {} as Record<string | number, boolean>
    )
  }, [allLeafKeys, controlledCheckedKeys, internalLeafNodeValues, treeData])

  const handleCheck = useCallback(
    (_key: string | number, checked: boolean, node: CheckboxTreeDataNode) => {
      const newLeafNodeValues = { ...leafNodeValues }

      if (checked) {
        // When checking, set all leaf descendants to true
        const leafKeys = getLeafKeys(node)
        leafKeys.forEach((leafKey) => (newLeafNodeValues[leafKey] = true))
      } else {
        // When unchecking, set all leaf descendants to false
        const leafKeys = getLeafKeys(node)
        leafKeys.forEach((leafKey) => (newLeafNodeValues[leafKey] = false))
      }

      if (!controlledCheckedKeys) {
        setInternalLeafNodeValues(newLeafNodeValues)
      }

      if (onCheck) {
        // Get all checked leaf nodes
        const checkedLeafNodes: Record<string | number, CheckboxTreeDataNode> =
          {}

        // Get all nodes that appear checked (including parents)
        const allCheckedNodes: CheckboxTreeDataNode[] = []

        const traverse = (nodes: CheckboxTreeDataNode[]) => {
          nodes.forEach((node) => {
            if (isNodeChecked(node, newLeafNodeValues)) {
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

        onCheck(newLeafNodeValues, {
          checked,
          checkedLeafNodes,
          allCheckedNodes,
          node,
        })
      }
    },
    [controlledCheckedKeys, onCheck, treeData]
  )

  return (
    <div className={className} style={style}>
      {treeData.map((node) => (
        <TreeNode
          key={node.key}
          node={node}
          level={0}
          leafNodeValues={leafNodeValues}
          onCheck={handleCheck}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
