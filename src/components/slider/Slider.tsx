import { Slider as AntSlider } from 'antd'
import type { SliderRangeProps, SliderSingleProps } from 'antd/es/slider'
import cx from 'classnames'

export type Props = SliderSingleProps | SliderRangeProps

/**
 * antd's Slider with the J2 track and handle (theme tokens in `appTheme`) and
 * the DS tooltip convention: no arrow, unless the consumer asks for one.
 */
export const Slider = ({ className, tooltip, ...props }: Props) => (
  <AntSlider
    {...(props as SliderSingleProps)}
    className={cx('j2-slider', className)}
    tooltip={{ arrow: false, ...tooltip }}
  />
)
