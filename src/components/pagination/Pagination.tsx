import {
  Pagination as AntdPagination,
  PaginationProps,
  Select,
  SelectProps,
  Button,
} from 'antd'
import cx from 'classnames'
import {
  CaretLeftIcon,
  CaretRightIcon,
  CaretDownIcon,
  DotsThreeIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
} from '@phosphor-icons/react'

import s from './Pagination.module.css'

type Overrides = {
  paginationTextLabels?: boolean
  /** Forces small-size rendering independent of the config's own `size`. */
  isSmall?: boolean
}

type Props = Expand<PaginationProps & { paginationTextLabels?: boolean }>

const renderIconButton = (
  icon: React.ReactNode,
  isSmall: boolean,
  customClassName?: string
) => (
  <Button
    type="link"
    size={isSmall ? 'small' : 'middle'}
    className={cx(customClassName, isSmall ? '!w-6' : '!w-8')}
  >
    {icon}
  </Button>
)

const renderJumpItem = (
  icon: React.ReactNode,
  doubleIcon: React.ReactNode,
  isSmall: boolean
) => (
  <a className="ant-pagination-item-link">
    <div className="ant-pagination-item-container">
      <span className="ant-pagination-item-ellipsis">
        {renderIconButton(icon, isSmall, s['jump-button'])}
      </span>
      <span className="ant-pagination-item-link-icon">
        {renderIconButton(doubleIcon, isSmall, s['jump-button'])}
      </span>
    </div>
  </a>
)

const buildItemRender =
  ({ paginationTextLabels, isSmall }: Required<Overrides>) =>
  (
    _page: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    element: React.ReactNode
  ) => {
    if (type === 'prev') {
      return (
        <a>
          {paginationTextLabels
            ? 'Previous'
            : renderIconButton(<CaretLeftIcon />, isSmall)}
        </a>
      )
    }
    if (type === 'next') {
      return (
        <a>
          {paginationTextLabels
            ? 'Next'
            : renderIconButton(<CaretRightIcon />, isSmall)}
        </a>
      )
    }
    if (type === 'jump-prev') {
      return renderJumpItem(<DotsThreeIcon />, <CaretDoubleLeftIcon />, isSmall)
    }
    if (type === 'jump-next') {
      return renderJumpItem(
        <DotsThreeIcon />,
        <CaretDoubleRightIcon />,
        isSmall
      )
    }
    return element
  }

const paginationSelectComponentClass = (selectProps: SelectProps) => (
  <Select {...selectProps} suffixIcon={<CaretDownIcon />} />
)

const getPaginationLocale = (isSmall: boolean) => ({
  jump_to: `Go to\u00A0${isSmall ? ':\u00A0\u00A0\u00A0' : ''}`,
  page: isSmall ? '' : 'page',
})

/**
 * Applies design-system overrides (Phosphor icons, locale, custom select
 * chrome) to an antd Pagination config. Used by the standalone
 * {@link Pagination} component, and by `<Table>`'s `pagination` prop so
 * both share identical visuals.
 */
export const withDesignSystemPaginationOverrides = (
  pagination: PaginationProps,
  { paginationTextLabels = false, isSmall }: Overrides = {}
): PaginationProps => {
  const small = isSmall ?? pagination.size === 'small'
  return {
    ...pagination,
    locale: { ...getPaginationLocale(small), ...pagination.locale },
    selectComponentClass: paginationSelectComponentClass,
    itemRender: buildItemRender({
      paginationTextLabels,
      isSmall: small,
    }),
  }
}

const Pagination = ({ paginationTextLabels = false, ...props }: Props) => {
  const enriched = withDesignSystemPaginationOverrides(props, {
    paginationTextLabels,
  })
  return <AntdPagination {...enriched} />
}

export { Pagination }
