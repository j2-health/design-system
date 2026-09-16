import { Steps as AntdSteps, StepsProps } from 'antd'
import './Steps.css'
import { CheckIcon } from '@phosphor-icons/react'
import cx from 'classnames'
import { useSteps } from './useSteps'

type AllProps = StepsProps & {
  items: NonNullable<StepsProps['items']>
  dot?: boolean
  current?: number
  setCurrent?: (current: number) => void
}

type Props = Expand<AllProps>

export const Steps = ({
  items,
  current,
  setCurrent,
  dot = false,
  direction,
  orientation,
  size,
  labelPlacement,
  titlePlacement,
  ...props
}: Props) => {
  const isVertical = (orientation ?? direction) === 'vertical'
  const totalSteps = items?.length || 0

  const { current: currentStep, setCurrent: setCurrentStep } = useSteps({
    current,
    setCurrent,
    totalSteps,
  })

  return (
    <AntdSteps
      className="j2Steps"
      {...props}
      orientation={orientation ?? direction}
      titlePlacement={titlePlacement ?? labelPlacement}
      size={size === 'default' ? 'medium' : size}
      current={currentStep}
      onChange={(curr) => setCurrentStep(curr)}
      {...(dot && { type: 'dot' })}
      items={items?.map((item, index) => {
        const { description, ...restItem } = item
        return {
          ...restItem,
          content: item.content ?? description,
          icon:
            !dot && currentStep > index ? (
              <div
                className={cx(
                  `check-${size === 'small' ? 'small' : 'medium'}`,
                  isVertical ? `vertical-check-icon` : `check-icon`
                )}
              >
                <CheckIcon size={16} />
              </div>
            ) : (
              item.icon
            ),
        }
      })}
    />
  )
}
