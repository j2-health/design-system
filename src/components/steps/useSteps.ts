import { useState, useCallback } from 'react'

interface UseStepsOptions {
  current?: number
  setCurrent?: (current: number) => void
  totalSteps: number
  initialStep?: number
}

export const useSteps = ({
  current,
  setCurrent,
  totalSteps,
  initialStep = 0,
}: UseStepsOptions) => {
  const [internalCurrent, setInternalCurrent] = useState(initialStep)

  const isControlled = current !== undefined && setCurrent !== undefined
  const currentStep = isControlled ? current : internalCurrent

  const handleSetCurrent = useCallback(
    (newCurrent: number) => {
      if (isControlled) {
        setCurrent!(newCurrent)
      } else {
        setInternalCurrent(newCurrent)
      }
    },
    [isControlled, setCurrent]
  )

  const next = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      handleSetCurrent(currentStep + 1)
    }
  }, [currentStep, totalSteps, handleSetCurrent])

  const previous = useCallback(() => {
    if (currentStep > 0) {
      handleSetCurrent(currentStep - 1)
    }
  }, [currentStep, handleSetCurrent])

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        handleSetCurrent(step)
      }
    },
    [totalSteps, handleSetCurrent]
  )

  const cancel = useCallback(() => {
    handleSetCurrent(initialStep)
  }, [handleSetCurrent, initialStep])

  return {
    next,
    previous,
    goToStep,
    cancel,
    current: currentStep,
    setCurrent: handleSetCurrent,
    canGoNext: currentStep < totalSteps - 1,
    canGoPrevious: currentStep > 0,
  }
}
