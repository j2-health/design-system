import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { TreeNode } from './TreeNode'
import {
  getLeafKeys,
  getAllLeafKeys,
  getAllParentKeys,
  isNodeChecked,
} from './utils'

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
  defaultExpandAll?: boolean
  defaultExpandedKeys?: (string | number)[]
  expandedKeys?: (string | number)[]
  onExpand?: (expandedKeys: (string | number)[]) => void
  className?: string
  style?: React.CSSProperties
}

export const CheckboxTree = ({
  treeData,
  defaultCheckedKeys = [],
  checkedKeys: controlledCheckedKeys,
  onCheck,
  disabled = false,
  defaultExpandAll = true,
  defaultExpandedKeys,
  expandedKeys: controlledExpandedKeys,
  onExpand,
  className,
  style,
}: CheckboxTreeProps) => {
  const allLeafKeys = useMemo(() => getAllLeafKeys(treeData), [treeData])
  const leafKeySet = useMemo(() => new Set(allLeafKeys), [allLeafKeys])

  const [internalLeafNodeValues, setInternalLeafNodeValues] = useState<
    Record<string | number, boolean>
  >(() => {
    const defaultLeafKeySet = new Set(
      defaultCheckedKeys.filter((key) => leafKeySet.has(key))
    )
    const values: Record<string | number, boolean> = {}
    for (const key of allLeafKeys) {
      values[key] = defaultLeafKeySet.has(key)
    }
    return values
  })

  const [internalExpandedKeys, setInternalExpandedKeys] = useState<
    (string | number)[]
  >(() => {
    if (defaultExpandedKeys) return defaultExpandedKeys
    if (defaultExpandAll) return getAllParentKeys(treeData)
    return []
  })

  // When defaultExpandAll is true and treeData changes, auto-expand new parent nodes
  useEffect(() => {
    if (controlledExpandedKeys || !defaultExpandAll || defaultExpandedKeys)
      return
    const allParentKeys = getAllParentKeys(treeData)
    setInternalExpandedKeys((prev) => {
      const prevSet = new Set(prev)
      const newKeys = allParentKeys.filter((key) => !prevSet.has(key))
      if (newKeys.length === 0) return prev
      return [...prev, ...newKeys]
    })
  }, [treeData, defaultExpandAll, controlledExpandedKeys, defaultExpandedKeys])

  const expandedKeysSet = useMemo(() => {
    const keys = controlledExpandedKeys ?? internalExpandedKeys
    return new Set(keys)
  }, [controlledExpandedKeys, internalExpandedKeys])

  const handleToggleExpand = useCallback(
    (key: string | number) => {
      const currentKeys = controlledExpandedKeys ?? internalExpandedKeys
      const newKeys = currentKeys.includes(key)
        ? currentKeys.filter((k) => k !== key)
        : [...currentKeys, key]

      if (!controlledExpandedKeys) {
        setInternalExpandedKeys(newKeys)
      }
      onExpand?.(newKeys)
    },
    [controlledExpandedKeys, internalExpandedKeys, onExpand]
  )

  const leafNodeValues: Record<string | number, boolean> = useMemo(() => {
    if (!controlledCheckedKeys) {
      return internalLeafNodeValues
    }

    const controlledLeafKeySet = new Set(
      controlledCheckedKeys.filter((key) => leafKeySet.has(key))
    )

    const values: Record<string | number, boolean> = {}
    for (const key of allLeafKeys) {
      values[key] = controlledLeafKeySet.has(key)
    }
    return values
  }, [allLeafKeys, leafKeySet, controlledCheckedKeys, internalLeafNodeValues])

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
          expandedKeys={expandedKeysSet}
          onToggleExpand={handleToggleExpand}
        />
      ))}
    </div>
  )
}
