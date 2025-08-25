import type { Meta, StoryObj } from '@storybook/react'

import { Dropdown } from './Dropdown'
import { ItemType } from 'antd/es/menu/interface'
import { DownloadIcon } from '@phosphor-icons/react'

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
    placement: 'bottom',
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
