import type { Meta, StoryObj } from '@storybook/react-vite'
import { Menu } from './Menu'
import {
  SmileOutlined,
  HomeOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  StarOutlined,
} from '@ant-design/icons'

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
  args: {
    compact: false,
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: ['vertical', 'horizontal', 'inline'],
    },
    compact: {
      control: 'boolean',
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    mode: 'vertical',
    items: [
      { label: 'J2GPT', key: 'j2gpt', icon: <SmileOutlined /> },
      { label: 'Insights Hub', key: 'insights-hub', icon: <HomeOutlined /> },
      {
        label: 'Network Optimizer',
        key: 'network-optimizer',
        icon: <SettingOutlined />,
      },
      {
        label: 'Quality Metrics',
        key: 'quality-metrics',
        icon: <BellOutlined />,
      },
      {
        label: 'Provider Optimization',
        key: 'provider-optimization',
        icon: <UserOutlined />,
      },
    ],
    defaultSelectedKeys: ['j2gpt'],
  },
}

export const CollapsedInlineWithChildren: Story = {
  args: {
    mode: 'inline',
    items: [
      {
        key: 'network-management',
        label: 'Network Management',
        icon: <StarOutlined />,
        children: [
          {
            key: 'j2gpt',
            label: 'J2GPT',
            icon: <SmileOutlined />,
          },
          {
            key: 'insights-hub',
            label: 'Insights Hub',
            icon: <HomeOutlined />,
          },
          {
            key: 'network-optimizer',
            label: 'Network Optimizer',
            icon: <SettingOutlined />,
          },
          {
            key: 'quality-metrics',
            label: 'Quality Metrics',
            icon: <BellOutlined />,
          },
          {
            key: 'provider-optimization',
            label: 'Provider Optimization',
            icon: <UserOutlined />,
          },
        ],
      },
    ],
    defaultOpenKeys: ['network-management'],
  },
}

export const Compact: Story = {
  args: {
    ...Default.args,
    compact: true,
  },
}
