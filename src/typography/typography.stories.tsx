import type { Meta, StoryObj } from '@storybook/react'

const TypographyExample = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
    </div>
  )
}

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
