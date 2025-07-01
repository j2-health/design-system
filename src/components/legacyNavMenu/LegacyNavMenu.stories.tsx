import type { Meta, StoryObj } from '@storybook/react'
import { LegacyNavMenu } from './LegacyNavMenu'
import type { NavSection, LegacyNavMenuUser } from './LegacyNavMenu'
import { ChartPie, FileText, Network, Question } from '@phosphor-icons/react'

// Default data moved from component
const defaultSections: NavSection[] = [
  {
    title: 'ANALYZE',
    items: [
      {
        id: 'scorecard',
        label: 'Scorecard',
        icon: <ChartPie size={24} />,
      },
      {
        id: 'reports',
        label: 'Reports',
        icon: <FileText size={24} />,
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
        icon: <Network size={24} />,
      },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      {
        id: 'user-guide',
        label: 'User Guide',
        icon: <Question size={24} />,
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
      <LegacyNavMenu {...args} />
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
