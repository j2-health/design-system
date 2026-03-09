import { CaretDownIcon } from '@phosphor-icons/react'
import { Checkbox } from '../checkbox'
import { CheckboxTreeDataNode } from './CheckboxTree'
import { isNodeChecked } from './utils'

type TreeNodeProps = {
  node: CheckboxTreeDataNode
  level: number
  leafNodeValues: Record<string | number, boolean>
  onCheck: (
    key: string | number,
    checked: boolean,
    node: CheckboxTreeDataNode
  ) => void
  disabled: boolean
  expandedKeys: Set<string | number>
  onToggleExpand: (key: string | number) => void
}

export const TreeNode = ({
  node,
  level,
  leafNodeValues,
  onCheck,
  disabled,
  expandedKeys,
  onToggleExpand,
}: TreeNodeProps) => {
  const isChecked = isNodeChecked(node, leafNodeValues)
  const isDisabled = disabled || node.disabled
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedKeys.has(node.key)

  return (
    <div>
      <div
        className="flex items-center min-h-6 mb-1"
        style={{ paddingLeft: level * 20 }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggleExpand(node.key)}
            className="flex items-center justify-center w-4 mr-1 cursor-pointer bg-transparent border-none p-0"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <CaretDownIcon
              size={14}
              style={{
                transform: `rotate(${isExpanded ? 0 : -90}deg)`,
                transition: 'transform 150ms ease',
              }}
            />
          </button>
        ) : (
          <span className="w-4 mr-1 inline-block" />
        )}
        <Checkbox
          checked={isChecked}
          disabled={isDisabled}
          onChange={(e) => onCheck(node.key, e.target.checked, node)}
        >
          {node.title}
        </Checkbox>
      </div>

      {hasChildren && (
        <div
          style={{
            display: 'grid',
            gridTemplateRows: isExpanded ? '1fr' : '0fr',
            transition: 'grid-template-rows 150ms ease',
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            {node.children!.map((childNode) => (
              <TreeNode
                key={childNode.key}
                node={childNode}
                level={level + 1}
                leafNodeValues={leafNodeValues}
                onCheck={onCheck}
                disabled={disabled}
                expandedKeys={expandedKeys}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
