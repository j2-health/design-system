import React from 'react'
import styles from './LegacyNavMenu.module.css'
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
  sections: NavSection[]
  user: LegacyNavMenuUser
  onItemClick?: (itemId: string) => void
  logoUrl?: string
  onLogOut?: () => void
  onChangeClient?: () => void
  headerSlot?: React.ReactNode
  footerSlot?: React.ReactNode
}

export const LegacyNavMenu: React.FC<LegacyNavMenuProps> = ({
  sections,
  user,
  onItemClick,
  logoUrl = '/',
  onLogOut,
  onChangeClient,
  headerSlot,
  footerSlot,
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

      {headerSlot && <div className="px-4">{headerSlot}</div>}

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

      {footerSlot && <div className="px-4">{footerSlot}</div>}

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
