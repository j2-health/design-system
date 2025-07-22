import { Steps as AntdSteps, StepsProps, StepProps } from 'antd'
import './Steps.css'
import { CheckIcon } from '@phosphor-icons/react'
import cx from 'classnames'
import { useSteps } from './useSteps'

type AllProps = StepsProps & {
  items?: StepProps[]
  dot?: boolean
  size?: 'default' | 'small'
  direction?: 'horizontal' | 'vertical'
  current?: number
  setCurrent?: (current: number) => void
}

type Props = Expand<AllProps>

export const Steps = ({
  items,
  current,
  setCurrent,
  dot = false,
  size = 'default',
  direction = 'horizontal',
  ...props
}: Props) => {
  const isVertical = direction === 'vertical'
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
      current={currentStep}
      direction={direction}
      size={size}
      onChange={(curr) => setCurrentStep(curr)}
      {...(dot && { progressDot: true })}
      items={items?.map((item, index) => {
        return {
          ...item,
          icon:
            !dot && currentStep > index ? (
              <div
                className={cx(
                  `check-${size}`,
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
