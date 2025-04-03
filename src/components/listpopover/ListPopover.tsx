import cx from 'classnames'
import { Popover } from '../popover/Popover'
import { Button } from '../button/Button'
import { CopySimple } from '@phosphor-icons/react'
import { Tooltip } from '../tooltip'
import { OpenMessageFunc } from '../message/useMessage'

type Props = {
  items: string[]
  openMessage: OpenMessageFunc
}

const PopoverContent = ({
  items,
  openMessage,
}: Pick<Props, 'items' | 'openMessage'>) => {
  return (
    <div className={cx('max-w-[400px] max-h-[198px]')}>
      {items.map((item) => (
        <div className={cx('flex items-center')}>
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

const ListPopover = ({
  children,
  items,
  column,
  openMessage,
}: {
  items: Array<string>
  column: string
  openMessage: OpenMessageFunc
  children: React.ReactNode
}) => {
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
