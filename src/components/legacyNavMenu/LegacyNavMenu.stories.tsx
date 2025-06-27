import type { Meta, StoryObj } from '@storybook/react'
import { LegacyNavMenu } from './LegacyNavMenu'
import type { NavSection } from './LegacyNavMenu'

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
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="12 12L8 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            ),
          },
          {
            id: 'reports',
            label: 'Reports',
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <polyline
                  points="14,2 14,8 20,8"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            ),
          },
        ],
      },
      {
        title: 'MANAGE',
        items: [
          {
            id: 'networks',
            label: 'Networks',
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="3 3h18v18H3zM9 9h6v6H9z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            ),
          },
        ],
      },
      {
        title: 'ACCOUNT',
        items: [
          {
            id: 'user-guide',
            label: 'User Guide',
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <line
                  x1="12"
                  y1="17"
                  x2="12.01"
                  y2="17"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            ),
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
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  ry="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <line
                  x1="9"
                  y1="9"
                  x2="15"
                  y2="9"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="9"
                  y1="15"
                  x2="15"
                  y2="15"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            ),
          },
        ],
      },
      {
        title: 'SETTINGS',
        items: [
          {
            id: 'preferences',
            label: 'Preferences',
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            ),
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
