import type { ReactNode } from 'react'
import cx from 'classnames'

export type CalloutProps = {
  /** The main line. */
  children: ReactNode
  /** A short bold label before the main line. */
  title?: ReactNode
  /** Right-aligned: a button, a link or a count. */
  extra?: ReactNode
  /** Under the main line: tags, a list, a second line. */
  footer?: ReactNode
  className?: string
}

/**
 * A neutral, bordered box for context that is not a status: an invitation
 * ("Want to …? [Add]") or a short summary beside a form. Use `Alert` when the
 * content is information, success, a warning or an error.
 */
export const Callout = ({
  children,
  title,
  extra,
  footer,
  className,
}: CalloutProps) => (
  <div
    className={cx(
      'rounded-j2 border border-solid border-j2-gray-4 bg-j2-gray-1 px-3 py-2.5 text-sm text-j2-text',
      className
    )}
  >
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0 leading-snug">
        {title && (
          <span className="mr-1.5 font-semibold text-j2-text">{title}</span>
        )}
        <span className={title ? 'text-j2-text-secondary' : undefined}>
          {children}
        </span>
      </div>
      {extra && <div className="flex-shrink-0">{extra}</div>}
    </div>
    {footer && <div className="mt-2">{footer}</div>}
  </div>
)
