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
    verticalBorders: {
      control: {
        type: 'boolean',
      },
      table: {
        type: { summary: 'boolean' },
      },
    },
    alternatingRows: {
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

export const AlternatingRows: Story = {
  args: {
    alternatingRows: true,
    dataSource: [
      {
        make: 'Tesla',
        model: 'Model Y',
        price: 64950,
        electric: true,
        rating: 4.8,
      },
      {
        make: 'Ford',
        model: 'F-Series',
        price: 33850,
        electric: false,
        rating: 4.2,
      },
      {
        make: 'Toyota',
        model: 'Corolla',
        price: 29600,
        electric: false,
        rating: 4.8,
      },
      {
        make: 'Honda',
        model: 'Civic',
        price: 27300,
        electric: false,
        rating: 4.6,
      },
      {
        make: 'BMW',
        model: 'X3',
        price: 48550,
        electric: false,
        rating: 4.4,
      },
      {
        make: 'Audi',
        model: 'Q5',
        price: 52400,
        electric: false,
        rating: 4.3,
      },
      {
        make: 'Mercedes',
        model: 'C-Class',
        price: 55400,
        electric: false,
        rating: 4.1,
      },
      {
        make: 'Volkswagen',
        model: 'Golf',
        price: 31895,
        electric: false,
        rating: 4.0,
      },
    ],
    columns: [
      { dataIndex: 'make', title: 'Make' },
      { dataIndex: 'model', title: 'Model' },
      {
        dataIndex: 'price',
        title: 'Price',
        render: (value) => `$${value.toLocaleString()}`,
      },
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
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}
