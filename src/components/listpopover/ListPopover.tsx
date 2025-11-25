import type { ReactNode } from 'react'
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
  renderItem?: (label: string) => ReactNode
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
  renderItem,
}: {
  item: string
  openMessage: OpenMessageFunc
  renderItem?: (label: string) => ReactNode
}) => {
  return (
    <div key={item} className={cx('flex items-center')}>
      <div className={cx('overflow-hidden text-nowrap text-ellipsis')}>
        {renderItem ? renderItem(item) : item}
      </div>
      <CopyButton openMessage={openMessage} textToCopy={item} />
    </div>
  )
}

const ObjectListItem = ({
  item,
  openMessage,
  index,
  renderItem,
}: {
  item: PopoverObjectItem
  openMessage: OpenMessageFunc
  index: number
  renderItem?: (label: string) => ReactNode
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
          <div className={cx('overflow-hidden text-nowrap text-ellipsis')}>
            {renderItem ? renderItem(subItem) : subItem}
          </div>
          <CopyButton openMessage={openMessage} textToCopy={subItem} />
        </div>
      ))}
    </div>
  )
}

const PopoverContent = ({
  items,
  openMessage,
  renderItem,
}: PopoverContentProps) => {
  return (
    <div className={cx('max-w-[400px] max-h-[198px]')}>
      {items.map((item, i) =>
        typeof item === 'string' ? (
          <StringListItem
            key={item}
            item={item}
            openMessage={openMessage}
            renderItem={renderItem}
          />
        ) : (
          <ObjectListItem
            index={i}
            key={item.categoryName}
            item={item}
            openMessage={openMessage}
            renderItem={renderItem}
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
  renderItem?: (label: string) => ReactNode
}

export type ListPopoverProps = Expand<Props>

const ListPopover = ({
  children,
  items,
  column,
  openMessage,
  renderItem,
}: ListPopoverProps) => {
  return (
    <Popover
      title={`${column} (${items.length})`}
      content={
        <PopoverContent
          items={items}
          openMessage={openMessage}
          renderItem={renderItem}
        />
      }
      trigger="click"
      scrollable={true}
      arrow={false}
      contentPadding={false}
    >
      <div className="w-full overflow-hidden">
        <Button
          className={cx('p-0 h-auto w-full overflow-hidden text-left')}
          type={items.length > 0 ? 'link' : 'text'}
        >
          {children}
        </Button>
      </div>
    </Popover>
  )
}

export { ListPopover }
