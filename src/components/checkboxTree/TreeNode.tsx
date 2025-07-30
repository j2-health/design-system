import { Checkbox } from '../checkbox'
import { CheckboxTreeDataNode } from './CheckboxTree'

type TreeNodeProps = {
  node: CheckboxTreeDataNode
  level: number
  checkedKeys: Set<string | number>
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
  checkedKeys,
  onCheck,
  disabled,
}: TreeNodeProps) => {
  const isChecked = checkedKeys.has(node.key)
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
              checkedKeys={checkedKeys}
              onCheck={onCheck}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  )
}
