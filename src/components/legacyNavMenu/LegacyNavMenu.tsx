import React from 'react'
import styles from './LegacyNavMenu.module.css'
import { ChartPie, FileText, Network, Question } from '../icons'
import J2Logo from '../../svgs/j2-logo.svg?react'

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

export interface UserProfile {
  name: string
  avatar: string
}

export interface LegacyNavMenuProps {
  sections?: NavSection[]
  user?: UserProfile
  onItemClick?: (itemId: string) => void
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

const defaultUser: UserProfile = {
  name: 'Rachel Foley',
  avatar: 'R',
}

export const LegacyNavMenu: React.FC<LegacyNavMenuProps> = ({
  sections = defaultSections,
  user = defaultUser,
  onItemClick,
}) => {
  const handleItemClick = (itemId: string) => {
    onItemClick?.(itemId)
  }

  return (
    <div className={styles.navContainer}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <div className={styles.logoContainer}>
          {/* @ts-expect-error - SVG component props */}
          <J2Logo className={styles.logo} />
        </div>
      </div>

      {/* Navigation Sections */}
      <div className={styles.navContent}>
        {sections.map((section, sectionIndex) => (
          <div key={section.title} className={styles.navSection}>
            {/* Section Divider */}
            {sectionIndex > 0 && <div className={styles.sectionDivider} />}

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
      <div className={styles.userSection}>
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>{user.avatar}</div>
          <span className={styles.userName}>{user.name}</span>
        </div>
      </div>
    </div>
  )
}
