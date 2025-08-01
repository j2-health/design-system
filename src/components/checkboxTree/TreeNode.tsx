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
}

export const TreeNode = ({
  node,
  level,
  leafNodeValues,
  onCheck,
  disabled,
}: TreeNodeProps) => {
  const isChecked = isNodeChecked(node, leafNodeValues)
  const isDisabled = disabled || node.disabled

  return (
    <div>
      <div
        className="flex items-center min-h-6 mb-1"
        style={{ paddingLeft: level * 20 }}
      >
        <Checkbox
          checked={isChecked}
          disabled={isDisabled}
          onChange={(e) => onCheck(node.key, e.target.checked, node)}
        >
          {node.title}
        </Checkbox>
      </div>

      {node.children && (
        <div>
          {node.children.map((childNode) => (
            <TreeNode
              key={childNode.key}
              node={childNode}
              level={level + 1}
              leafNodeValues={leafNodeValues}
              onCheck={onCheck}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  )
}
