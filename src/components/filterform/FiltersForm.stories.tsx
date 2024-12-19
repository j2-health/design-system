import type { Meta, StoryObj } from '@storybook/react'
import { FiltersForm } from '.'

const meta: Meta<typeof FiltersForm> = {
  title: 'Components/FiltersForm',
  component: FiltersForm,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {},
  decorators: [
    (Story) => (
      <div
        style={{ backgroundColor: 'var(--j2-color-bg-layout)', padding: 20 }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    filterConfigs: [
      {
        label: 'Fruit',
        field: 'fruit',
        type: 'select',
        options: [
          { label: 'Apple', value: 'apple' },
          { label: 'Banana', value: 'banana' },
          { label: 'Orange', value: 'orange' },
        ],
      },
      {
        label: 'Vegetables',
        field: 'vegetables',
        type: 'select',
        options: [
          { label: 'Carrot', value: 'carrot' },
          { label: 'Onion', value: 'onion' },
          { label: 'Celery', value: 'celery' },
        ],
      },
    ],
  },
}
