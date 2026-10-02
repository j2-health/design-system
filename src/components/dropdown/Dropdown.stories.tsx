import type { Meta, StoryObj } from '@storybook/react-vite'

import { Dropdown } from './Dropdown'
import { Button } from '../button'
import { ItemType } from 'antd/es/menu/interface'
import {
  ArrowSquareOutIcon,
  DownloadIcon,
  SortAscendingIcon,
} from '@phosphor-icons/react'

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  args: {
    arrow: false,
    disabled: false,
    trigger: ['click'],
    placement: 'bottomLeft',
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['basic', 'twofold', 'basic-inline'],
    },
    trigger: {
      control: 'check',
      options: ['click', 'hover'],
    },
    placement: {
      control: 'radio',
      options: [
        'bottom',
        'top',
        'bottomLeft',
        'bottomRight',
        'topLeft',
        'topRight',
      ],
    },
    arrow: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

const items: ItemType[] = [
  {
    key: 'Download',
    label: 'Download',
    type: 'group',
    children: [
      { key: 'csv', label: '.csv' },
      { key: 'pdf', label: '.pdf' },
      { key: 'excel', label: '.xlsx' },
    ],
  },
  { type: 'divider' },
  { key: 'print', label: 'Print' },
  { key: 'email', label: 'Email' },
]

export const Default: Story = {
  args: {
    label: 'Export Reports',
    type: 'basic',
  },
  render: (args) => {
    return (
      <Dropdown
        {...args}
        menu={{
          items: items,
        }}
      />
    )
  },
}

export const Twofold: Story = {
  args: {
    label: 'Click to Download',
    type: 'twofold',
  },
  render: (args) => {
    return <Dropdown {...args} menu={{ items: items }} />
  },
}

export const BasicInline: Story = {
  args: {
    label: 'Export Data',
    type: 'basic-inline',
  },
  render: (args) => {
    return <Dropdown {...args} menu={{ items: items }} />
  },
}

export const Icon: Story = {
  args: {
    icon: <DownloadIcon />,
    type: 'basic',
  },
  render: (args) => {
    return <Dropdown {...args} menu={{ items: items }} />
  },
}

export const IconInline: Story = {
  args: {
    icon: <DownloadIcon />,
    type: 'basic-inline',
  },
  render: (args) => {
    return <Dropdown {...args} menu={{ items: items }} />
  },
}

export const IconTwofold: Story = {
  args: {
    icon: <DownloadIcon />,
    type: 'twofold',
  },
  render: (args) => {
    return <Dropdown {...args} menu={{ items: items }} />
  },
}

export const SlimMenu: Story = {
  args: {
    icon: <SortAscendingIcon weight="regular" size={20} />,
    label: 'Gaps',
    type: 'basic-inline',
    menuType: 'slim',
    menu: {
      items: [
        {
          type: 'group',
          label: 'Sort by',
          children: [
            { key: 'name-asc', label: 'Name (A->Z)' },
            { key: 'name-desc', label: 'Name (Z->A)' },
            { key: 'gap-asc', label: 'Gaps (Low->High)' },
            { key: 'gap-desc', label: 'Gaps (High->Low)' },
            { key: 'population-asc', label: 'Population (Low->High)' },
            { key: 'population-desc', label: 'Population (High->Low)' },
          ],
        },
      ],
      selectable: true,
      selectedKeys: ['gap-desc'],
    },
  },
  render: (args) => {
    return <Dropdown {...args} />
  },
}

// Custom trigger — pass any element as children and it opens the menu. Use it
// when the built-in targets don't fit, e.g. a primary button or a text toggle.
export const CustomTrigger: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <Dropdown
        {...args}
        menu={{ items: [{ key: 'png', label: 'Export as image' }] }}
      >
        <Button size="small" type="primary" icon={<ArrowSquareOutIcon />}>
          Share
        </Button>
      </Dropdown>
      <Dropdown {...args} menu={{ items }}>
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-j2-primary hover:opacity-70"
        >
          More actions
        </button>
      </Dropdown>
    </div>
  ),
}

// Placement only shows when the menu is wider than its trigger: antd never
// makes a menu narrower than the trigger. Left/right align the menu's edge
// with the trigger's; the plain value centers it.
export const Placement: Story = {
  render: (args) => (
    <div className="flex" style={{ gap: 240 }}>
      {(['bottomLeft', 'bottom', 'bottomRight'] as const).map((placement) => (
        <Dropdown
          {...args}
          key={placement}
          placement={placement}
          open
          menu={{
            items: [
              { key: 'a', label: 'A longer menu item label' },
              { key: 'b', label: 'Another item' },
            ],
          }}
        >
          <Button size="small">{placement}</Button>
        </Dropdown>
      ))}
    </div>
  ),
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="flex justify-center pb-40 pt-6">
        <Story />
      </div>
    ),
  ],
}
