import React from 'react'
import styles from './LegacyNavMenu.module.css'
import { ChartPie, FileText, Network, Question } from '../icons'
import J2Logo from '../../svgs/j2-logo.svg?react'
import { UserProfile } from './UserProfile'

export interface NavItem {
  id: string
  label: string
  icon?: React.ReactNode
  isActive?: boolean
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export interface LegacyNavMenuUser {
  firstName: string
  lastName?: string
  avatarUrl?: string
}

export interface LegacyNavMenuProps {
  sections?: NavSection[]
  user?: LegacyNavMenuUser
  onItemClick?: (itemId: string) => void
  logoUrl?: string
  onLogOut?: () => void
  onChangeClient?: () => void
}

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

export const LegacyNavMenu: React.FC<LegacyNavMenuProps> = ({
  sections = defaultSections,
  user = defaultUser,
  onItemClick,
  logoUrl = '/',
  onLogOut,
  onChangeClient,
}) => {
  const handleItemClick = (itemId: string) => {
    onItemClick?.(itemId)
  }

  return (
    <div className={styles.navContainer}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <div className={styles.logoContainer}>
          <a href={logoUrl} className={styles.logoLink}>
            {/* @ts-expect-error - SVG component props */}
            <J2Logo className={styles.logo} />
          </a>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className={styles.navContent}>
        {sections.map((section) => (
          <div key={section.title} className={styles.navSection}>

            {/* Section Header */}
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>{section.title}</span>
            </div>

            {/* Section Items */}
            <div className={styles.sectionItems}>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.navItem} ${item.isActive ? styles.active : ''}`}
                  onClick={() => handleItemClick(item.id)}
                >
                  {item.icon && (
                    <div className={styles.navItemIcon}>{item.icon}</div>
                  )}
                  <span className={styles.navItemLabel}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Section */}
      <UserProfile
        firstName={user.firstName}
        lastName={user.lastName}
        avatarUrl={user.avatarUrl}
        onLogOut={onLogOut}
        onChangeClient={onChangeClient}
      />
    </div>
  )
}
