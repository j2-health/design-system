import { Flex } from 'antd'
import cx from 'classnames'
import styles from './PageHeader.module.css'

export type PageHeaderProps = {
  /** Page title — a string renders as <h1>, or pass a custom ReactNode (e.g. a selector) */
  pageTitle: string | React.ReactNode
  /** Action buttons displayed on the right side */
  actions?: React.ReactNode
  /** Show a bottom border below the header. Default: true */
  bordered?: boolean
}

export const PageHeader = ({
  pageTitle,
  actions,
  bordered = true,
}: PageHeaderProps) => {
  return (
    <Flex
      className={cx(styles.pageHeader, bordered && styles.bordered)}
      justify="space-between"
      align="center"
    >
      {typeof pageTitle === 'string' ? (
        <h1 className={styles.title}>{pageTitle}</h1>
      ) : (
        pageTitle
      )}
      {actions && <Flex className={styles.actions}>{actions}</Flex>}
    </Flex>
  )
}
