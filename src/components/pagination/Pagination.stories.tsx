import type { Meta, StoryObj } from '@storybook/react-vite'

import { Pagination } from './Pagination'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  args: {
    current: 1,
    pageSize: 10,
    total: 100,
  },
  argTypes: {
    paginationTextLabels: {
      control: { type: 'boolean' },
      table: { type: { summary: 'boolean' } },
    },
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const WithSizeChanger: Story = {
  args: {
    total: 200,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
  },
}

export const FullFeatures: Story = {
  args: {
    current: 9,
    total: 850,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total) => `Total ${total} items`,
  },
}

export const TextLabels: Story = {
  args: {
    total: 200,
    paginationTextLabels: true,
  },
}

export const Small: Story = {
  args: {
    total: 200,
    size: 'small',
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `Total ${total} items`,
  },
}
