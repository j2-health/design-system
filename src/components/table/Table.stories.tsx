import type { Meta, StoryObj } from '@storybook/react'

import { Table } from './Table'
import s from './TableStories.module.css'
import { Check, X } from '@phosphor-icons/react'
import { Rate } from 'antd'

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
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
  args: {
    dataSource: [
      {
        make: 'Tesla',
        model: 'Model Y',
        price: 64950,
        electric: true,
        rating: 0.01,
      },
      {
        make: 'Ford',
        model: 'F-Series',
        price: 33850,
        electric: false,
        rating: 2,
      },
      {
        make: 'Toyota',
        model: 'Corolla',
        price: 29600,
        electric: false,
        rating: 4.8,
      },
    ],
    columns: [
      { dataIndex: 'make', title: 'Make' },
      { dataIndex: 'model', title: 'Model' },
      { dataIndex: 'price', title: 'Price' },
      {
        dataIndex: 'electric',
        title: 'Electric',
        render: (value) => (value ? <Check /> : <X />),
      },
      {
        dataIndex: 'rating',
        title: 'Rating',
        render: (value) => <Rate disabled value={value} />,
      },
    ],
  },
}

export const Bordered: Story = {
  args: {
    ...Default.args,
    bordered: true,
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const BorderedWithVertical: Story = {
  args: {
    ...Default.args,
    bordered: true,
    verticalBorders: true,
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}
