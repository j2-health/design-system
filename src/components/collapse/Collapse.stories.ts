import type { Meta, StoryObj } from '@storybook/react-vite'
import { Collapse } from './Collapse'
import type { CollapseProps } from 'antd'

const text = `
  Value-based care is a healthcare delivery model in which providers,
  including hospitals and physicians, are paid based on patient health outcomes.
  Under value-based care agreements, providers are rewarded for helping patients
  improve their health, reduce the effects and incidence of chronic disease,
  and live healthier lives in an evidence-based way.
`

const items: CollapseProps['items'] = [
  {
    key: 'value-based-care',
    label: 'Value-Based Care',
    children: text,
  },
]

const meta = {
  title: 'Components/Collapse',
  component: Collapse,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    state: {
      control: 'radio',
      options: ['default', 'warning', 'error'],
    },
    expandIconPosition: {
      control: 'radio',
      options: ['start', 'end'],
    },
    bordered: {
      control: 'boolean',
    },
    showIcon: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Collapse>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: items,
    defaultActiveKey: ['value-based-care'],
    expandIconPosition: 'end',
    bordered: true,
    state: 'default',
    showIcon: true,
  },
}

export const Warning: Story = {
  args: {
    items: items,
    defaultActiveKey: ['value-based-care'],
    expandIconPosition: 'end',
    bordered: true,
    state: 'warning',
    showIcon: true,
  },
}

export const Error: Story = {
  args: {
    items: items,
    defaultActiveKey: ['value-based-care'],
    expandIconPosition: 'end',
    bordered: true,
    state: 'error',
    showIcon: true,
  },
}
