import type { Meta, StoryObj } from '@storybook/react'
import { LegacyNavMenu } from './LegacyNavMenu'
import type { NavSection } from './LegacyNavMenu'
import {
  ChartPie,
  FileText,
  Network,
  Question,
  ChartBar,
  Gear,
} from '@phosphor-icons/react'

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

// Story with different active item
export const DifferentActiveItem: Story = {
  args: {
    sections: [
      {
        title: 'ANALYZE',
        items: [
          {
            id: 'scorecard',
            label: 'Scorecard',
            isActive: true, // Make Scorecard active instead
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
    ],
  },
  render: (args) => (
    <div style={{ height: '100vh', display: 'flex' }}>
      <LegacyNavMenu {...args} />
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h1>Scorecard Active</h1>
        <p>Now the Scorecard item is active instead of Networks.</p>
      </div>
    </div>
  ),
}

// Story with different user
export const DifferentUser: Story = {
  args: {
    user: {
      name: 'John Smith',
      avatar: 'J',
    },
  },
  render: (args) => (
    <div style={{ height: '100vh', display: 'flex' }}>
      <LegacyNavMenu {...args} />
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h1>Different User</h1>
        <p>The user profile shows John Smith instead of Rachel Foley.</p>
      </div>
    </div>
  ),
}

// Story with clickable logo
export const ClickableLogo: Story = {
  args: {
    logoUrl: 'https://example.com',
  },
  render: (args) => (
    <div style={{ height: '100vh', display: 'flex' }}>
      <LegacyNavMenu {...args} />
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h1>Clickable Logo</h1>
        <p>The J2 logo is now clickable and links to example.com</p>
      </div>
    </div>
  ),
}

// Story with custom sections
export const CustomSections: Story = {
  args: {
    sections: [
      {
        title: 'DASHBOARD',
        items: [
          {
            id: 'overview',
            label: 'Overview',
            isActive: true,
            icon: <ChartBar size={24} />,
          },
        ],
      },
      {
        title: 'SETTINGS',
        items: [
          {
            id: 'preferences',
            label: 'Preferences',
            icon: <Gear size={24} />,
          },
        ],
      },
    ] as NavSection[],
  },
  render: (args) => (
    <div style={{ height: '100vh', display: 'flex' }}>
      <LegacyNavMenu {...args} />
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h1>Custom Sections</h1>
        <p>
          This shows the navigation with completely different sections:
          Dashboard and Settings.
        </p>
      </div>
    </div>
  ),
}

// Story showing just the navigation without extra content
export const NavOnly: Story = {
  render: (args) => <LegacyNavMenu {...args} />,
  parameters: {
    layout: 'centered',
  },
}
