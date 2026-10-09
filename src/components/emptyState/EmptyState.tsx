import cx from 'classnames'

export type EmptyStateProps = {
  /**
   * What is empty, in a few words: "No results", "No changes yet". Leave it
   * out for a message-only state, where `description` carries the whole message.
   */
  title?: React.ReactNode
  /** Why it is empty, or what to do next. */
  description?: React.ReactNode
  /** An illustration or icon above the title. */
  icon?: React.ReactNode
  /** A next step: usually a text or link `Button`. */
  action?: React.ReactNode
  /**
   * - `'default'`: a page or table body, with a heading-sized title.
   * - `'compact'`: a panel, popover or narrow column, with body-sized text.
   */
  size?: 'default' | 'compact'
  className?: string
}

/**
 * What a list, table or panel shows when it has nothing to show.
 */
export const EmptyState = ({
  title,
  description,
  icon,
  action,
  size = 'default',
  className,
}: EmptyStateProps) => {
  const compact = size === 'compact'

  return (
    <div
      className={cx(
        'flex flex-col items-center justify-center text-center',
        compact ? 'gap-3 px-6 py-8' : 'gap-6 py-12',
        className
      )}
    >
      {icon && (
        <div aria-hidden className="flex text-j2-gray-6">
          {icon}
        </div>
      )}
      {(title || description) && (
        <div className="flex flex-col items-center gap-1">
          {title &&
            (compact ? (
              <p className="m-0 text-sm font-semibold text-j2-text">{title}</p>
            ) : (
              <h4 className="m-0">{title}</h4>
            ))}
          {description && (
            <p
              className={cx(
                'm-0',
                compact
                  ? 'max-w-[34ch] text-sm text-j2-text-secondary'
                  : 'max-w-md text-j2-primary'
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}
      {action}
    </div>
  )
}
