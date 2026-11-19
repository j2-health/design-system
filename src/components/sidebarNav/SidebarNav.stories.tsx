import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ChartBarIcon,
  ChartLineIcon,
  CompassIcon,
  FolderIcon,
  GearIcon,
  LockKeyOpenIcon,
  MagnifyingGlassIcon,
  MapTrifoldIcon,
  NotePencilIcon,
  PrinterIcon,
  QuestionIcon,
  RulerIcon,
  SquaresFourIcon,
  StackIcon,
  TableIcon,
} from '@phosphor-icons/react'

import { SummarizedSelect } from '../select'
import { SidebarNav, type SidebarNavProps } from './SidebarNav'
import { SidebarNavCompactControl } from './SidebarNavCompactControl'
import type { SidebarNavApp, SidebarNavSection } from './SidebarNav'

const apps: SidebarNavApp[] = [
  {
    key: 'planner',
    label: 'Planner',
    icon: <CompassIcon size={20} weight="duotone" />,
  },
  {
    key: 'insights',
    label: 'Insights',
    icon: <ChartLineIcon size={20} weight="duotone" />,
  },
  {
    key: 'studio',
    label: 'Studio',
    icon: <StackIcon size={20} weight="duotone" />,
  },
]

const plainSections: SidebarNavSection[] = [
  {
    key: 'analyze',
    label: 'Analyze',
    groups: [
      {
        items: [
          {
            key: 'overview',
            label: 'Overview',
            icon: <SquaresFourIcon size={16} />,
          },
          { key: 'reports', label: 'Reports', icon: <PrinterIcon size={16} /> },
          {
            key: 'explore',
            label: 'Explore',
            icon: <ChartBarIcon size={16} />,
          },
        ],
      },
    ],
  },
  {
    key: 'manage',
    label: 'Manage',
    groups: [
      {
        items: [
          {
            key: 'projects',
            label: 'Projects',
            icon: <FolderIcon size={16} />,
          },
          { key: 'rules', label: 'Rules', icon: <RulerIcon size={16} /> },
        ],
      },
    ],
  },
]

const footerItems = [
  { key: 'help', label: 'Help', icon: <QuestionIcon size={16} /> },
  { key: 'settings', label: 'Settings', icon: <GearIcon size={16} /> },
  { key: 'admin', label: 'Admin', icon: <LockKeyOpenIcon size={16} /> },
]

const account = { name: 'Alex Rivera', email: 'alex@example.com' }

const workspaces = [
  { value: 'north', label: 'North Region Workspace' },
  { value: 'south', label: 'South Region Workspace' },
  { value: 'east', label: 'East Region Workspace' },
  { value: 'west', label: 'West Region Workspace' },
]

/**
 * A scope control: expanded, the DS select as a field; collapsed, the same
 * select laid invisibly over a `SidebarNavCompactControl`, so one click opens
 * its list beside the rail.
 */
const WorkspaceControl = ({ collapsed }: { collapsed: boolean }) => {
  const [value, setValue] = useState('north')
  const name = workspaces.find((w) => w.value === value)?.label ?? ''
  const select = (overlay: boolean) => (
    <SummarizedSelect
      variant="field"
      trigger="select"
      aria-label={overlay ? `Workspace: ${name}` : 'Workspace'}
      searchPlaceholder="Search workspaces..."
      popupMatchSelectWidth={overlay ? 320 : undefined}
      popupAlign={
        overlay
          ? {
              points: ['tl', 'tr'],
              offset: [8, 0],
              overflow: { adjustY: true },
            }
          : undefined
      }
      options={workspaces}
      value={value}
      onChange={setValue}
    />
  )
  if (!collapsed) return select(false)
  return (
    <SidebarNavCompactControl
      icon={<MapTrifoldIcon size={16} />}
      title={name}
      overlay={select(true)}
    />
  )
}

const scopedSections: SidebarNavSection[] = [
  {
    kind: 'scope',
    key: 'workspace',
    controls: ({ collapsed }) => <WorkspaceControl collapsed={collapsed} />,
    groups: [
      {
        label: 'Monitor',
        items: [
          {
            key: 'overview',
            label: 'Overview',
            icon: <SquaresFourIcon size={16} />,
          },
          { key: 'records', label: 'Records', icon: <TableIcon size={16} /> },
          {
            key: 'changes',
            label: 'Changes',
            icon: <NotePencilIcon size={16} />,
          },
        ],
      },
      {
        label: 'Plan',
        items: [
          { key: 'map', label: 'Map', icon: <MapTrifoldIcon size={16} /> },
          {
            key: 'search',
            label: 'Search',
            icon: <MagnifyingGlassIcon size={16} />,
          },
        ],
      },
    ],
  },
  {
    key: 'analyze',
    label: 'Analyze',
    groups: [
      {
        items: [
          { key: 'reports', label: 'Reports', icon: <PrinterIcon size={16} /> },
        ],
      },
    ],
  },
  {
    key: 'manage',
    label: 'Manage',
    groups: [
      {
        items: [
          {
            key: 'projects',
            label: 'Projects',
            icon: <FolderIcon size={16} />,
          },
          { key: 'rules', label: 'Rules', icon: <RulerIcon size={16} /> },
        ],
      },
    ],
  },
]

/** The sidebar beside a page, with its state held here as an app would. */
const Shell = (props: SidebarNavProps) => {
  const [appKey, setAppKey] = useState(props.appKey)
  const [selectedKey, setSelectedKey] = useState(props.selectedKey)
  const [collapsed, setCollapsed] = useState(props.collapsed ?? false)
  const [width, setWidth] = useState(props.width ?? 240)
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f7f7f5' }}>
      <SidebarNav
        {...props}
        appKey={appKey}
        onAppChange={setAppKey}
        selectedKey={selectedKey}
        onNavigate={setSelectedKey}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        width={width}
        onWidthChange={setWidth}
      />
      <main style={{ padding: 24, fontSize: 13, color: '#666' }}>
        {collapsed ? 'Collapsed' : `Expanded, ${width}px`} · {selectedKey}
      </main>
    </div>
  )
}

const meta = {
  title: 'Components/SidebarNav',
  component: SidebarNav,
  parameters: { layout: 'fullscreen' },
  args: {
    apps,
    appKey: 'planner',
    sections: plainSections,
    footerItems,
    account,
    selectedKey: 'overview',
    logoHref: '#',
  },
  render: (args) => <Shell {...args} />,
} satisfies Meta<typeof SidebarNav>

// eslint-disable-next-line no-restricted-exports
export default meta
type Story = StoryObj<typeof meta>

/** 240px, drag the right edge between 200 and 360; under 140 it collapses. */
export const Expanded: Story = {}

/** The 56px rail: icons with names in tooltips, labels as hairlines. */
export const Collapsed: Story = {
  args: { collapsed: true },
}

/** One app: the switcher is a static name, and nothing on the rail. */
export const SingleApp: Story = {
  args: { apps: [apps[0]] },
}

/** A scope block: a select that sets context for the pages under it. */
export const ScopeBlock: Story = {
  args: { sections: scopedSections },
}

export const ScopeBlockCollapsed: Story = {
  args: { sections: scopedSections, collapsed: true },
}

/** A context line above the user, e.g. the workspace someone is acting in. */
export const AccountContext: Story = {
  args: { account: { ...account, context: 'Example Organization' } },
}
