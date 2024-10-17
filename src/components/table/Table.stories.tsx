import type { Meta, StoryObj } from '@storybook/react'

import { Table } from './Table'

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  args: {
    bordered: false,
  },
  argTypes: {
    bordered: {
      control: {
        type: 'boolean',
      },
      table: {
        type: { summary: 'boolean' },
      },
    },
  },
} satisfies Meta<
  typeof Table<{
    make: string
    model: string
    price: number
    electric: boolean
  }>
>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    rowData: [
      { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
      { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
      { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
    ],
    columnDefs: [
      { field: 'make', filter: 'agMultiColumnFilter' },
      { field: 'model' },
      { field: 'price' },
      { field: 'electric' },
    ],
  },
}

export const Bordered: Story = {
  args: {
    ...Default.args,
    bordered: true,
  },
}
