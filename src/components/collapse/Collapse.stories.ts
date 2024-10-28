import type { Meta, StoryObj } from '@storybook/react'
import { Collapse } from 'antd'
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
    expandIconPosition: {
      control: 'radio',
      options: ['start', 'end'],
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
  },
}
