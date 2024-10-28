import type { Meta, StoryObj } from '@storybook/react'
import { TypographyExample } from './TypographyExample'

const meta = {
  title: 'Typography',
  component: TypographyExample,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TypographyExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
