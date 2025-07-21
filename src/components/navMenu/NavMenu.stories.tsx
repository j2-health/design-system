import type { Meta, StoryObj } from '@storybook/react'
import { NavMenu } from './NavMenu'
import {
  BrainIcon,
  ChartLineIcon,
  ChartPolarIcon,
  ChefHatIcon,
  DatabaseIcon,
  DetectiveIcon,
  FastForwardIcon,
  GearIcon,
  HouseSimpleIcon,
  SignOutIcon,
  WallIcon,
} from '@phosphor-icons/react'
import cx from 'classnames'
import { ItemType } from 'antd/es/menu/interface'
import { Button } from '../button'

const items = [
  {
    key: 'network-management',
    label: 'Network Management',
    icon: <ChefHatIcon size={20} />,
    children: [
      {
        key: 'insights-hub',
        label: 'Insights Hub',
        icon: <HouseSimpleIcon size={20} />,
      },
      {
        key: 'network-optimizer',
        label: 'Network Optimizer',
        icon: <BrainIcon size={20} />,
      },
      {
        key: 'quality-metrics',
        label: 'Quality Metrics',
        icon: <ChartPolarIcon size={20} />,
      },
      {
        key: 'provider-optimization',
        label: 'Provider Optimization',
        icon: <FastForwardIcon size={20} />,
      },
    ],
  },
  {
    key: 'data-management',
    label: 'Data Management',
    icon: <DatabaseIcon size={20} />,
    children: [
      {
        key: 'admin-portal',
        label: 'Admin Portal',
        icon: <DetectiveIcon size={20} />,
      },
      {
        key: 'dashboards',
        label: 'Dashboards',
        icon: <ChartLineIcon size={20} />,
      },
    ],
  },
]

const footerItems: ItemType[] = [
  {
    key: 'settings',
    label: 'Settings',
    icon: <GearIcon size={20} />,
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
    icon: <SignOutIcon size={20} />,
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
        <WallIcon />
      </Button>
    ),
  },
}
