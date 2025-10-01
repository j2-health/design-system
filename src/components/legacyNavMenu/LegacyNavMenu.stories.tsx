import type { Meta, StoryObj } from '@storybook/react'
import { LegacyNavMenu } from './LegacyNavMenu'
import type { NavSection, LegacyNavMenuUser } from './LegacyNavMenu'
import {
  ChartPieIcon,
  FileTextIcon,
  NetworkIcon,
  QuestionIcon,
} from '@phosphor-icons/react'

// Default data moved from component
const defaultSections: NavSection[] = [
  {
    title: 'ANALYZE',
    items: [
      {
        id: 'scorecard',
        label: 'Scorecard',
        icon: <ChartPieIcon size={24} />,
      },
      {
        id: 'reports',
        label: 'Reports',
        icon: <FileTextIcon size={24} />,
      },
    ],
  },
  {
    title: 'MANAGE',
    items: [
      {
        id: 'networks',
        label: 'Networks',
        isActive: true,
        icon: <NetworkIcon size={24} />,
      },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      {
        id: 'user-guide',
        label: 'User Guide',
        icon: <QuestionIcon size={24} />,
      },
    ],
  },
]

const defaultUser: LegacyNavMenuUser = {
  firstName: 'Rachel',
  lastName: 'Foley',
}

const meta: Meta<typeof LegacyNavMenu> = {
  title: 'Components/LegacyNavMenu',
  component: LegacyNavMenu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A sidebar navigation component with sections for ANALYZE, MANAGE, and ACCOUNT. Features the J2 logo, navigation items with icons, and a user profile section.',
      },
    },
  },
  argTypes: {
    onItemClick: {
      action: 'clicked',
      description: 'Callback fired when a navigation item is clicked',
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

// Default story with the standard navigation
export const Default: Story = {
  args: {
    sections: defaultSections,
    user: defaultUser,
  },
  render: (args) => (
    <div style={{ height: '100vh', display: 'flex' }}>
      <LegacyNavMenu sections={args.sections} user={args.user} {...args} />
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h1>Main Content Area</h1>
        <p>
          The navigation is on the left. Click on navigation items to see the
          action logged.
        </p>
      </div>
    </div>
  ),
}

export const WithHeaderAndFooter: Story = {
  args: {
    sections: defaultSections,
    user: defaultUser,
    headerSlot: <div>Header content goes here</div>,
    footerSlot: <div>Footer content goes here</div>,
  },
}
