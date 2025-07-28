import cx from 'classnames'
import { Popover } from '../popover/Popover'
import { Button } from '../button/Button'
import { CopyIcon } from '@phosphor-icons/react'
import { Tooltip } from '../tooltip'
import { OpenMessageFunc } from '../message/useMessage'
import s from './ListPopover.module.css'

export type PopoverObjectItem = { categoryName: string; items: string[] }
export type PopoverItem = string | PopoverObjectItem

type _ContentProps = {
  items: PopoverItem[]
  openMessage: OpenMessageFunc
}

type PopoverContentProps = Expand<_ContentProps>

const CopyButton = ({
  openMessage,
  textToCopy,
}: {
  openMessage: OpenMessageFunc
  textToCopy: string
}) => (
  <Tooltip title="Copy to Clipboard" className="ml-2" arrow={false}>
    <Button
      type="text"
      icon={
        <CopyIcon
          onClick={() => {
            navigator.clipboard.writeText(textToCopy)
            openMessage('success', 'Copied to Clipboard')
          }}
        />
      }
    ></Button>
  </Tooltip>
)

const StringListItem = ({
  item,
  openMessage,
}: {
  item: string
  openMessage: OpenMessageFunc
}) => {
  return (
    <div key={item} className={cx('flex items-center')}>
      <p className={cx('overflow-hidden text-nowrap text-ellipsis')}>{item}</p>
      <CopyButton openMessage={openMessage} textToCopy={item} />
    </div>
  )
}

const ObjectListItem = ({
  item,
  openMessage,
  index,
}: {
  item: PopoverObjectItem
  openMessage: OpenMessageFunc
  index: number
}) => {
  return (
    <div className={cx({ 'mt-2': index != 0 })}>
      <p
        className={cx(
          'overflow-hidden text-nowrap text-ellipsis',
          s.categoryName
        )}
        title={item.categoryName}
      >
        {item.categoryName}
      </p>
      {item.items.map((subItem, index) => (
        <div key={`${subItem}:${index}`} className={cx('flex items-center')}>
          <p className={cx('overflow-hidden text-nowrap text-ellipsis')}>
            {subItem}
          </p>
          <CopyButton openMessage={openMessage} textToCopy={subItem} />
        </div>
      ))}
    </div>
  )
}

const PopoverContent = ({ items, openMessage }: PopoverContentProps) => {
  return (
    <div className={cx('max-w-[400px] max-h-[198px]')}>
      {items.map((item, i) =>
        typeof item === 'string' ? (
          <StringListItem key={item} item={item} openMessage={openMessage} />
        ) : (
          <ObjectListItem
            index={i}
            key={item.categoryName}
            item={item}
            openMessage={openMessage}
          />
        )
      )}
    </div>
  )
}

type Props = {
  items: PopoverItem[]
  column: string
  openMessage: OpenMessageFunc
  children: React.ReactNode
}

export type ListPopoverProps = Expand<Props>

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
