import React, { useState, useRef, useEffect } from 'react'
import styles from './UserProfile.module.css'

export interface UserProfileProps {
  name: string
  avatar: string
  onLogOut?: () => void
  onChangeClient?: () => void
}

export const UserProfile: React.FC<UserProfileProps> = ({
  name,
  avatar,
  onLogOut,
  onChangeClient,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen)
  }

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.userSection}>
      <button
        ref={buttonRef}
        className={styles.userProfile}
        onClick={togglePopover}
      >
        <div className={styles.userAvatar}>{avatar}</div>
        <span className={styles.userName}>{name}</span>
      </button>

      {isPopoverOpen && (
        <div ref={popoverRef} className={styles.popover}>
          <div className={styles.popoverUserInfo}>
            <div className={styles.popoverAvatar}>{avatar}</div>
            <span className={styles.popoverUserName}>{name}</span>
          </div>

          <div className={styles.popoverActions}>
            <button
              className={styles.logOutButton}
              onClick={() => {
                onLogOut?.()
                setIsPopoverOpen(false)
              }}
            >
              LOG OUT
            </button>
            <button
              className={styles.changeClientButton}
              onClick={() => {
                onChangeClient?.()
                setIsPopoverOpen(false)
              }}
            >
              CHANGE CLIENT
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
