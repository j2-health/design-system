import { ReactNode } from 'react'
import cx from 'classnames'
import { Button } from '../button'

type BulkActionBarProps = {
  /**
   * Number of rows currently selected. The bar slides in when count > 0
   * and slides out when count returns to 0.
   */
  count: number
  /** Primary action (Archive, Restore, Delete, etc.). */
  action: {
    label: string
    icon?: ReactNode
    loading?: boolean
    onClick: () => void
  }
  /** Optional secondary actions rendered between the primary action and Cancel. */
  secondaryActions?: Array<{
    label: string
    icon?: ReactNode
    loading?: boolean
    onClick: () => void
  }>
  /** Clears the selection. Renders as the trailing "Cancel" button. */
  onCancel: () => void
  /** Custom Cancel label. Defaults to `"Cancel"`. */
  cancelLabel?: string
}

/**
 * Floating bulk-action toolbar. Renders fixed to the bottom-center of the
 * viewport and slides in whenever `count > 0`. Use it above any list/table
 * surface that supports row selection — pair with Ant Design's
 * `rowSelection` prop on `<Table>` (or any controlled selection state).
 *
 * Destructive intent is enforced by whatever confirmation modal the host
 * surface shows after `action.onClick` — the bar itself is always neutral
 * (text-on-navy) so it never reads as a one-click destructive control.
 */
export const BulkActionBar = ({
  count,
  action,
  secondaryActions,
  onCancel,
  cancelLabel = 'Cancel',
}: BulkActionBarProps) => {
  const visible = count > 0
  const label = `${count} selected`

  return (
    <div
      role="region"
      aria-label="Bulk actions"
      aria-hidden={!visible}
      className={cx(
        'pointer-events-none fixed bottom-6 left-1/2 z-50',
        '-translate-x-1/2 transition duration-200 ease-out',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      )}
    >
      <div
        className={cx(
          'pointer-events-auto flex items-center gap-3 rounded-full',
          'bg-j2-primary-active py-2 pl-4 pr-2 text-white shadow-lg'
        )}
      >
        <span className="text-sm font-medium">{label}</span>
        <div className="h-5 w-px bg-white/20" />
        <Button
          type="text"
          shape="round"
          size="small"
          icon={action.icon}
          loading={action.loading}
          onClick={action.onClick}
          className="!text-white hover:!bg-white/10 hover:!text-white"
        >
          {action.label}
        </Button>
        {secondaryActions?.map((sec) => (
          <Button
            key={sec.label}
            type="text"
            shape="round"
            size="small"
            icon={sec.icon}
            loading={sec.loading}
            onClick={sec.onClick}
            className="!text-white hover:!bg-white/10 hover:!text-white"
          >
            {sec.label}
          </Button>
        ))}
        <Button
          type="text"
          shape="round"
          size="small"
          onClick={onCancel}
          className="!text-white hover:!bg-white/10 hover:!text-white"
        >
          {cancelLabel}
        </Button>
      </div>
    </div>
  )
}
