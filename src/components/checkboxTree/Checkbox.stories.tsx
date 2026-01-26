import { StoryObj, Meta } from '@storybook/react-vite'

import { CheckboxTree } from './CheckboxTree'

const meta: Meta<typeof CheckboxTree> = {
  title: 'Components/CheckboxTree',
  component: CheckboxTree,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    disabled: { control: 'boolean' },
  },
}

export default meta

type Story = StoryObj<typeof meta>

const simpleTreeData = [
  {
    key: '0',
    title: 'Documents',
    children: [
      {
        key: '0-0',
        title: 'Projects',
        children: [
          { key: '0-0-0', title: 'Project A' },
          { key: '0-0-1', title: 'Project B' },
        ],
      },
      {
        key: '0-1',
        title: 'Reports',
        children: [
          { key: '0-1-0', title: 'Annual Report' },
          { key: '0-1-1', title: 'Monthly Report' },
        ],
      },
    ],
  },
  {
    key: '1',
    title: 'Media',
    children: [
      { key: '1-0', title: 'Images' },
      { key: '1-1', title: 'Videos' },
    ],
  },
]

export const Default: Story = {
  args: {
    treeData: simpleTreeData,
    onCheck(checkedKeys, info) {
      console.log(checkedKeys, info)
    },
  },
}

export const WithSomeChecked: Story = {
  args: {
    treeData: simpleTreeData,
    defaultCheckedKeys: ['0-0-0', '1-0'],
  },
}
