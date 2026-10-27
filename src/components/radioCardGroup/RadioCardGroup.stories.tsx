import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { RadioCardGroup, type RadioCardOption } from './RadioCardGroup'

type Size = 'small' | 'medium' | 'large'

const options: RadioCardOption<Size>[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
]

const meta = {
  title: 'Components/RadioCardGroup',
  component: RadioCardGroup,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof RadioCardGroup>

// eslint-disable-next-line no-restricted-exports
export default meta
type Story = StoryObj<typeof meta>

const Controlled = ({
  withDescriptions = false,
}: {
  withDescriptions?: boolean
}) => {
  const [value, setValue] = useState<Size>('medium')
  return (
    <RadioCardGroup<Size>
      aria-label="Size"
      value={value}
      onChange={setValue}
      options={
        withDescriptions
          ? options.map((option) => ({
              ...option,
              description: `A ${option.value} option.`,
            }))
          : options
      }
    />
  )
}

// Labels only: the default. Use the arrow keys to move between cards.
export const Default: Story = {
  args: { options: [], onChange: () => {} },
  render: () => <Controlled />,
}

export const WithDescriptions: Story = {
  name: 'With descriptions',
  args: { options: [], onChange: () => {} },
  render: () => <Controlled withDescriptions />,
}
