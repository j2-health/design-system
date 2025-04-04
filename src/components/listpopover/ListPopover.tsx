import cx from 'classnames'
import { Popover } from '../popover/Popover'
import { Button } from '../button/Button'
import { CopySimple } from '@phosphor-icons/react'
import { Tooltip } from '../tooltip'
import { OpenMessageFunc } from '../message/useMessage'

type _ContentProps = {
  items: string[]
  openMessage: OpenMessageFunc
}

type PopoverContentProps = Expand<_ContentProps>

const PopoverContent = ({ items, openMessage }: PopoverContentProps) => {
  return (
    <div className={cx('max-w-[400px] max-h-[198px]')}>
      {items.map((item) => (
        <div key={item} className={cx('flex items-center')}>
          <p className={cx('overflow-hidden text-nowrap text-ellipsis')}>
            {item}
          </p>
          <Tooltip title="Copy to Clipboard" arrow={false}>
            <Button
              type="text"
              icon={
                <CopySimple
                  weight="regular"
                  onClick={() => {
                    navigator.clipboard.writeText(item)
                    openMessage('success', 'Copied to Clipboard')
                  }}
                />
              }
            ></Button>
          </Tooltip>
        </div>
      ))}
    </div>
  )
}

type _Props = {
  items: Array<string>
  column: string
  openMessage: OpenMessageFunc
  children: React.ReactNode
}

export type ListPopoverProps = Expand<_Props>

const ListPopover = ({
  children,
  items,
  column,
  openMessage,
}: ListPopoverProps) => {
  return (
    <Popover
      title={`${column} (${items.length})`}
      content={<PopoverContent items={items} openMessage={openMessage} />}
      trigger="click"
      scrollable={true}
      arrow={false}
      contentPadding={false}
    >
      <div>
        <Button
          className={cx('p-0 h-auto')}
          type={items.length > 0 ? 'link' : 'text'}
        >
          {children}
        </Button>
      </div>
    </Popover>
  )
}

export { ListPopover }
