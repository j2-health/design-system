import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createPortal } from 'react-dom'
import { Button } from '../../button'
import { StepDrawer, useStepDrawerSlots, type StepDrawerProps } from '..'

const LABELS = ['Details', 'Options', 'Review']

const renderDrawer = (props: Partial<StepDrawerProps> = {}) =>
  render(
    <StepDrawer
      open
      onClose={() => {}}
      title="New item"
      labels={LABELS}
      current={0}
      {...props}
    >
      <div>step body</div>
    </StepDrawer>
  )

describe('StepDrawer', () => {
  it('renders every step as a numbered marker with its label', () => {
    renderDrawer()

    LABELS.forEach((label, index) => {
      expect(screen.getByText(label)).toBeInTheDocument()
      expect(screen.getByText(String(index + 1))).toBeInTheDocument()
    })
    expect(screen.getByText('step body')).toBeInTheDocument()
  })

  it('highlights the step it is given', () => {
    renderDrawer({ current: 1 })

    expect(document.querySelector('.ant-steps-item-active')).toHaveTextContent(
      'Options'
    )
  })

  it('has no Go back when the flow gives it nowhere to go', () => {
    renderDrawer({ current: 1 })

    expect(screen.queryByRole('button', { name: 'Go back' })).toBeNull()
  })

  it('goes back when the flow supplies a handler', async () => {
    const onBack = vi.fn()
    renderDrawer({ current: 1, onBack })

    await userEvent.click(screen.getByRole('button', { name: 'Go back' }))

    expect(onBack).toHaveBeenCalledOnce()
  })

  it('shows Go back on the first step when that step has a destination', () => {
    renderDrawer({ current: 0, onBack: () => {} })

    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument()
  })

  it('renders the primary action the flow supplies', () => {
    renderDrawer({ primaryAction: <Button>Next step</Button> })

    expect(
      screen.getByRole('button', { name: 'Next step' })
    ).toBeInTheDocument()
  })

  it('renders header content the flow supplies', () => {
    renderDrawer({ extraContent: <Button>Save draft</Button> })

    expect(
      screen.getByRole('button', { name: 'Save draft' })
    ).toBeInTheDocument()
  })

  it('lets step content fill the footer through the primary slot', async () => {
    const StepWithOwnAction = () => {
      const { primary } = useStepDrawerSlots()
      return primary ? createPortal(<Button>Finish</Button>, primary) : null
    }

    render(
      <StepDrawer
        open
        onClose={() => {}}
        title="New item"
        labels={LABELS}
        current={2}
        onBack={() => {}}
      >
        <StepWithOwnAction />
      </StepDrawer>
    )

    expect(
      await screen.findByRole('button', { name: 'Finish' })
    ).toBeInTheDocument()
  })

  it('lets step content fill the header through the extra slot', async () => {
    const StepWithHeaderAction = () => {
      const { extra } = useStepDrawerSlots()
      return extra ? createPortal(<Button>Save draft</Button>, extra) : null
    }

    render(
      <StepDrawer
        open
        onClose={() => {}}
        title="New item"
        labels={LABELS}
        current={0}
      >
        <StepWithHeaderAction />
      </StepDrawer>
    )

    expect(
      await screen.findByRole('button', { name: 'Save draft' })
    ).toBeInTheDocument()
  })

  it('offers no Cancel button', () => {
    renderDrawer({ current: 1, primaryAction: <Button>Next step</Button> })

    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('closes on the close control', async () => {
    const onClose = vi.fn()
    renderDrawer({ onClose })

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalled()
  })

  it('closes on Esc', async () => {
    const onClose = vi.fn()
    renderDrawer({ onClose })

    await userEvent.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalled()
  })

  // `cond && <X />` passes a falsy value on the steps where the condition
  // fails, and a step there may still portal into the extra slot.
  it.each([false, 0, ''])(
    'keeps the extra slot when the flow passes %j for header content',
    async (empty) => {
      const StepWithHeaderAction = () => {
        const { extra } = useStepDrawerSlots()
        return extra ? createPortal(<Button>Save draft</Button>, extra) : null
      }

      render(
        <StepDrawer
          open
          onClose={() => {}}
          title="New item"
          labels={LABELS}
          current={1}
          extraContent={empty}
        >
          <StepWithHeaderAction />
        </StepDrawer>
      )

      expect(
        await screen.findByRole('button', { name: 'Save draft' })
      ).toBeInTheDocument()
    }
  )

  // Navigation is footer-only: the bar shows progress but no step in it is a
  // button, so a click cannot move the flow.
  it('does not let a step be jumped to from the bar', async () => {
    renderDrawer({ current: 0, primaryAction: <Button>Next step</Button> })

    const bar = document.querySelector('.ant-steps') as HTMLElement
    expect(bar.querySelectorAll('[role="button"]')).toHaveLength(0)

    await userEvent.click(screen.getByText('Review'))

    expect(document.querySelector('.ant-steps-item-active')).toHaveTextContent(
      'Details'
    )
  })

  it('keeps the design-system step styling on its bar', () => {
    renderDrawer()

    expect(document.querySelector('.ant-steps')).toHaveClass('j2Steps')
  })
})
