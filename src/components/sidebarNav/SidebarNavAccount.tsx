import { Tooltip } from '../tooltip'
import { useRailTooltip } from './railTooltip'
import styles from './SidebarNav.module.css'

export type SidebarNavAccountInfo = {
  name: string
  email?: string
  /** A line above the user, e.g. the workspace someone is acting in. */
  context?: string
  /** The avatar's letters. Defaults to the first letters of the first and
   *  last words of `name`. */
  initials?: string
}

const initialsOf = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  const first = words[0].charAt(0)
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : ''
  return `${first}${last}`.toUpperCase()
}

/**
 * The bottom of the footer: the user, and above them an optional context
 * line. Collapsed, it's the avatar alone with the name (and context) in its
 * tooltip. The text stays in the DOM, hidden, so the block keeps its height
 * and the footer rows above it don't jump on collapse.
 */
export const SidebarNavAccount = ({
  account,
  collapsed,
}: {
  account: SidebarNavAccountInfo
  collapsed: boolean
}) => {
  const tooltip = useRailTooltip()
  const avatar = (
    <span className={styles.avatar} aria-hidden={!collapsed}>
      {account.initials ?? initialsOf(account.name)}
    </span>
  )

  return (
    <div className={styles.account}>
      {account.context && (
        <span
          className={styles.accountContext}
          title={account.context}
          aria-hidden={collapsed}
        >
          {account.context}
        </span>
      )}
      <div className={styles.accountRow}>
        {collapsed ? (
          <Tooltip
            {...tooltip}
            title={
              <>
                <div>{account.name}</div>
                {account.context && <div>{account.context}</div>}
              </>
            }
          >
            {avatar}
          </Tooltip>
        ) : (
          avatar
        )}
        <div className={styles.accountText} aria-hidden={collapsed}>
          <span className={styles.accountPrimary} title={account.name}>
            {account.name}
          </span>
          {account.email && (
            <span className={styles.accountSecondary} title={account.email}>
              {account.email}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
