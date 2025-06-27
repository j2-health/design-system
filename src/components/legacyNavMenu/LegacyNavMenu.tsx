import React from 'react'
import styles from './LegacyNavMenu.module.css'

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
        isActive: true,
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
          <svg
            width="26"
            height="36"
            viewBox="0 0 26 36"
            fill="none"
            className={styles.logo}
          >
            <g>
              <path
                d="M15.6055 12.0313C15.6055 12.4137 15.6055 12.6278 15.6055 12.8418C15.6055 18.3576 15.5992 23.8733 15.6159 29.389C15.6179 29.8774 15.4912 30.1622 15.0485 30.4157C12.0246 32.1386 9.01942 33.8927 6.008 35.6363C5.7877 35.7652 5.56325 35.8857 5.35958 36C5.14552 35.8712 5.21618 35.7028 5.21618 35.5678C5.20994 33.9031 5.22449 32.2363 5.20371 30.5716C5.19955 30.1913 5.33256 29.9834 5.65054 29.8047C7.08039 28.9942 8.49154 28.1525 9.92555 27.3544C10.3017 27.1445 10.4139 26.9014 10.4139 26.4815C10.3973 22.8695 10.4035 19.2575 10.4077 15.6454C10.4077 15.4002 10.31 15.1092 10.601 14.9409C12.22 13.9953 13.841 13.0559 15.6055 12.0313Z"
                fill="#253761"
              />
              <path
                d="M20.8784 3.05086C22.5327 4.01102 24.1351 4.94625 25.7478 5.86692C25.9827 6.00201 26.0034 6.17866 26.0034 6.40519C26.0014 12.1558 26.0014 17.9084 26.0055 23.659C26.0055 23.9188 25.9536 24.1017 25.7083 24.243C24.2265 25.0889 22.7509 25.9472 21.2774 26.8076C20.9428 27.003 20.7974 26.9926 20.7974 26.5395C20.8078 18.7772 20.8057 11.0148 20.8098 3.25245C20.8078 3.21296 20.8327 3.17555 20.8784 3.05086Z"
                fill="#253761"
              />
              <path
                d="M0.00834717 17.9543C0.00834717 15.1631 0.0166585 12.3741 3.22958e-05 9.58297C-0.00204598 9.19433 0.0956357 8.96156 0.451021 8.76205C1.88503 7.96191 3.30241 7.1306 4.71979 6.30137C5.07102 6.09562 5.22689 6.06861 5.22689 6.57571C5.21442 12.2639 5.2165 17.9522 5.22482 23.6425C5.22482 23.9355 5.1396 24.1143 4.87774 24.2639C3.39385 25.1077 1.91413 25.9598 0.444786 26.8326C-0.0145126 27.1049 0.00834717 26.8493 0.00834717 26.523C0.00834717 23.6654 0.00834717 20.8098 0.00834717 17.9543Z"
                fill="#253761"
              />
              <path
                d="M15.6078 -6.77109e-05C15.6078 0.960095 15.6078 1.79556 15.6078 2.63311C15.6078 3.60574 15.5932 4.57837 15.6161 5.54892C15.6244 5.89807 15.4997 6.09967 15.2004 6.27009C13.7727 7.07853 12.3511 7.89945 10.94 8.73492C10.5368 8.97184 10.3892 8.95522 10.3975 8.43357C10.4183 6.77095 10.4059 5.10625 10.4059 3.44363C10.4059 3.22957 10.3913 3.02798 10.6324 2.88873C12.2555 1.95559 13.8724 1.00997 15.6078 -6.77109e-05Z"
                fill="#253761"
              />
            </g>
          </svg>
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
