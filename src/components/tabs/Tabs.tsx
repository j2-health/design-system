import { Tabs as AntdTabs, TabsProps } from 'antd'
import cx from 'classnames'
import styles from './Tabs.module.css'

export type Props = Expand<
  TabsProps & {
    /**
     * No gap under the tab bar and no padding around the panes, so the
     * content sits flush against the tabs and fills the remaining height.
     */
    flush?: boolean
    /** The tabs share the bar's full width equally. */
    justified?: boolean
  }
>

export const Tabs = ({ flush, justified, className, ...props }: Props) => {
  const destroyOnHidden = props.destroyOnHidden ?? true
  return (
    <AntdTabs
      {...props}
      className={cx(
        flush && styles.flush,
        justified && styles.justified,
        className
      )}
      destroyOnHidden={destroyOnHidden}
    />
  )
}
