import type { Meta, StoryObj } from '@storybook/react-vite'

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

export const PaginationPlayground = {
  args: {
    paginationTotal: 85,
    paginationPageSize: 10,
    paginationCurrent: 1,
    paginationShowSizeChanger: false,
    paginationShowQuickJumper: false,
    paginationMini: false,
    paginationSimple: false,
    paginationPosition: 'bottomRight',
    paginationShowTotal: false,
    paginationTextLabels: false,
  },
  argTypes: {
    paginationTotal: {
      control: { type: 'number', min: 0, max: 200 },
      table: { category: 'Pagination' },
    },
    paginationPageSize: {
      options: [10, 20, 50, 100],
      control: { type: 'select' },
      table: { category: 'Pagination' },
    },
    paginationCurrent: {
      control: { type: 'number', min: 1, max: 20 },
      table: { category: 'Pagination' },
    },
    paginationShowSizeChanger: {
      control: { type: 'boolean' },
      table: { category: 'Pagination' },
    },
    paginationShowQuickJumper: {
      control: { type: 'boolean' },
      table: { category: 'Pagination' },
    },
    paginationMini: {
      control: { type: 'boolean' },
      table: { category: 'Pagination' },
    },
    paginationSimple: {
      control: { type: 'boolean' },
      table: { category: 'Pagination' },
    },
    paginationPosition: {
      options: [
        'bottomLeft',
        'bottomCenter',
        'bottomRight',
        'topLeft',
        'topCenter',
        'topRight',
      ],
      control: { type: 'select' },
      table: { category: 'Pagination' },
    },
    paginationShowTotal: {
      control: { type: 'boolean' },
      table: { category: 'Pagination' },
    },
    paginationTextLabels: {
      control: { type: 'boolean' },
      table: { category: 'Pagination' },
    },
  },
  render: (args: any) => {
    const {
      paginationTotal,
      paginationPageSize,
      paginationCurrent,
      paginationShowSizeChanger,
      paginationShowQuickJumper,
      paginationMini,
      paginationSimple,
      paginationPosition,
      paginationShowTotal,
      paginationTextLabels,
    } = args

    return (
      <div className={s.table} style={{ width: 'max-content' }}>
        <Table
          dataSource={smallDataSource}
          columns={columns}
          pagination={{
            total: paginationTotal,
            pageSize: paginationPageSize,
            current: paginationCurrent,
            showSizeChanger: paginationShowSizeChanger,
            showQuickJumper: paginationShowQuickJumper,
            size: paginationMini ? 'small' : undefined,
            simple: paginationSimple,
            position: [paginationPosition],
            showTotal: paginationShowTotal
              ? (total, _) => `Total ${total} items`
              : undefined,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          paginationTextLabels={paginationTextLabels}
        />
      </div>
    )
  },
}
