import { Checkbox } from '../checkbox'
import { CheckboxTreeDataNode } from './CheckboxTree'
import { isNodeChecked } from './utils'

type TreeNodeProps = {
  node: CheckboxTreeDataNode
  level: number
  leafNodeStates: Record<string | number, boolean>
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
  leafNodeStates,
  onCheck,
  disabled,
}: TreeNodeProps) => {
  const isChecked = isNodeChecked(node, leafNodeStates)
  const isDisabled = disabled || node.disabled
  const isCheckboxDisabled = isDisabled || node.disableCheckbox

  return (
    <div>
      <div
        className="flex items-center min-h-6 mb-1"
        style={{ paddingLeft: level * 20 }}
      >
        <Checkbox
          checked={isChecked}
          disabled={isCheckboxDisabled}
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
              leafNodeStates={leafNodeStates}
              onCheck={onCheck}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  )
}
