import type { Meta, StoryObj } from '@storybook/react'
import { NavMenu } from './NavMenu'
import {
  Brain,
  ChartLine,
  ChartPolar,
  ChefHat,
  Database,
  Detective,
  FastForward,
  Gear,
  HouseSimple,
  SignOut,
  Wall,
} from '@phosphor-icons/react'
import cx from 'classnames'
import { ItemType } from 'antd/es/menu/interface'
import { Button } from '../button'

const items = [
  {
    key: 'network-management',
    label: 'Network Management',
    icon: <ChefHat />,
    children: [
      {
        key: 'insights-hub',
        label: 'Insights Hub',
        icon: <HouseSimple />,
      },
      {
        key: 'network-optimizer',
        label: 'Network Optimizer',
        icon: <Brain />,
      },
      {
        key: 'quality-metrics',
        label: 'Quality Metrics',
        icon: <ChartPolar />,
      },
      {
        key: 'provider-optimization',
        label: 'Provider Optimization',
        icon: <FastForward />,
      },
    ],
  },
  {
    key: 'data-management',
    label: 'Data Management',
    icon: <Database />,
    children: [
      {
        key: 'admin-portal',
        label: 'Admin Portal',
        icon: <Detective />,
      },
      {
        key: 'dashboards',
        label: 'Dashboards',
        icon: <ChartLine />,
      },
    ],
  },
]

const footerItems: ItemType[] = [
  {
    key: 'settings',
    label: 'Settings',
    icon: <Gear />,
    onClick: () => {
      alert('Settings')
    },
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    label: <a>Logout</a>,
    icon: <SignOut />,
  },
]

const meta: Meta<typeof NavMenu> = {
  title: 'Components/NavMenu',
  component: NavMenu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        iframeHeight: '750px',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundColor: 'var(--j2-color-bg-layout)',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    items: items,
    defaultSelectedKeys: ['insights-hub'],
    defaultOpenKeys: ['network-management', 'data-management'],
    footerItems: footerItems,
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHeaderSlot: Story = {
  args: {
    headerSlot: (
      <Button className={cx('w-full', 'flex', 'justify-between')} type="dashed">
        <span>Network Intelligence</span>
        <Wall />
      </Button>
    ),
  },
}