import { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Slider } from './Slider'

// Props are a single-or-range union, so each story renders its own props
// rather than sharing `args`.
const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Slider min={0} max={100} defaultValue={40} />,
}

export const Steps: Story = {
  render: () => (
    <Slider
      min={0.5}
      max={2}
      step={0.25}
      defaultValue={1}
      tooltip={{ formatter: (value) => `${value}×` }}
    />
  ),
}

export const Marks: Story = {
  render: () => (
    <Slider
      min={0}
      max={100}
      defaultValue={50}
      marks={{ 0: '0', 50: '50', 100: '100' }}
    />
  ),
}

export const Range: Story = {
  render: () => {
    const [value, setValue] = useState<number[]>([20, 60])
    return <Slider range value={value} onChange={setValue} />
  },
}

export const Disabled: Story = {
  render: () => <Slider disabled defaultValue={40} />,
}
