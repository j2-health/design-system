import type { Meta, StoryObj } from '@storybook/react'

import { Table } from './Table'
import s from './TableStories.module.css'
import { CheckIcon, XIcon } from '@phosphor-icons/react'
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
    paginationTextLabels: {
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

const smallDataSource = [
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
]

const columns = [
  { dataIndex: 'make', title: 'Make' },
  { dataIndex: 'model', title: 'Model' },
  {
    dataIndex: 'price',
    title: 'Price',
    render: (value: number) => `$${value.toLocaleString()}`,
  },
  {
    dataIndex: 'electric',
    title: 'Electric',
    render: (value: boolean) => (value ? <CheckIcon /> : <XIcon />),
  },
  {
    dataIndex: 'rating',
    title: 'Rating',
    render: (value: number) => <Rate disabled value={value} />,
  },
]

export const Default: Story = {
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
  args: {
    dataSource: smallDataSource,
    columns,
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
    columns,
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

// Pagination Stories

export const PaginationAlignLeft: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 50,
      pageSize: 10,
      current: 1,
      position: ['bottomLeft'],
    },
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationAlignCenter: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 50,
      pageSize: 10,
      current: 1,
      position: ['bottomCenter'],
    },
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationBasic: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 50,
      pageSize: 10,
      current: 1,
    },
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationWithSizeChanger: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 50,
      pageSize: 10,
      current: 1,
      showSizeChanger: true, // automatically shown if there are more than 50 items
      pageSizeOptions: ['10', '20', '50', '100'],
    },
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationWithQuickJumper: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 85,
      pageSize: 10,
      current: 1,
      showQuickJumper: true,
    },
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationOnePage: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 3,
      pageSize: 10,
      current: 1,
    },
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationWithTotal: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 85,
      pageSize: 10,
      current: 1,
      showTotal: (total, _) => `Total ${total} items`,
    },
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

// TODO: Center that div
export const PaginationSimple: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 85,
      pageSize: 10,
      current: 1,
      simple: true,
    },
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationWithTextLabels: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 85,
      pageSize: 10,
      current: 1,
    },
    paginationTextLabels: true,
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationFullFeatures: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 85,
      pageSize: 10,
      current: 9,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, _) => `Total ${total} items`,
      pageSizeOptions: ['10', '20', '50', '100'],
    },
  },
  render: (args) => (
    <div className={s.table} style={{ width: 'max-content' }}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationMiniAlignLeft: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 50,
      pageSize: 10,
      current: 1,
      size: 'small',
      position: ['bottomLeft'],
    },
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationMiniAlignCenter: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 50,
      pageSize: 10,
      current: 1,
      size: 'small',
      position: ['bottomCenter'],
    },
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationMiniBasic: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 50,
      pageSize: 10,
      current: 1,
      size: 'small',
    },
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationMiniWithSizeChanger: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 50,
      pageSize: 10,
      current: 1,
      size: 'small',
      showSizeChanger: true, // automatically shown if there are more than 50 items
      pageSizeOptions: ['10', '20', '50', '100'],
    },
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationMiniWithQuickJumper: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 85,
      pageSize: 10,
      current: 1,
      size: 'small',
      showQuickJumper: true,
    },
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationMiniOnePage: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 3,
      pageSize: 10,
      current: 1,
      size: 'small',
    },
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationMiniWithTotal: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 85,
      pageSize: 10,
      current: 1,
      size: 'small',
      showTotal: (total, _) => `Total ${total} items`,
    },
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationMiniSimple: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 85,
      pageSize: 10,
      current: 1,
      size: 'small',
      simple: true,
    },
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationMiniWithTextLabels: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 85,
      pageSize: 10,
      current: 1,
      size: 'small',
    },
    paginationTextLabels: true,
  },
  render: (args) => (
    <div className={s.table}>
      <Table {...args} />
    </div>
  ),
}

export const PaginationMiniFullFeatures: Story = {
  args: {
    dataSource: smallDataSource,
    columns,
    pagination: {
      total: 85,
      pageSize: 10,
      current: 9,
      size: 'small',
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, _) => `Total ${total} items`,
      pageSizeOptions: ['10', '20', '50', '100'],
    },
  },
  render: (args) => (
    <div className={s.table} style={{ width: 'max-content' }}>
      <Table {...args} />
    </div>
  ),
}
