import type { Meta, StoryObj } from '@storybook/react'

import { VennDiagram } from './VennDiagram'

const meta = {
  title: 'Components/VennDiagram',
  component: VennDiagram,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: '450px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VennDiagram>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: [
      {
        sets: ['A'],
        value: 10,
        color: 'var(--j2-blue-9)',
        name: 'some random name',
      },
      { sets: ['A', 'B'], value: 2 },
      { sets: ['B'], value: 6, color: 'var(--j2-blue-4)' },
    ],
  },
} satisfies Story
