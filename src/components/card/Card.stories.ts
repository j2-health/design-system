import type { Meta, StoryObj } from '@storybook/react'

import { Card } from './Card'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Card Title',
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac ante vel libero tincidunt, eget efficitur augue tincidunt. Nullam ac ante vel libero tincidunt, eget efficitur augue tincidunt.',
  },
}

export const WithTabs: Story = {
  args: {
    title: 'Card Title',
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac ante vel libero tincidunt, eget efficitur augue tincidunt. Nullam ac ante vel libero tincidunt, eget efficitur augue tincidunt.',
    tabList: [
      {
        key: '1',
        tab: 'Tab 1',
      },
      {
        key: '2',
        tab: 'Tab 2',
      },
    ],
  },
}
