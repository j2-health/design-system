import { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '../button'
import { AntdInput } from '../input'
import { useSteps } from '../steps'
import { StepDrawer, useStepDrawerSlots } from './StepDrawer'

const LABELS = ['Details', 'Options', 'Review']

const meta: Meta<typeof StepDrawer> = {
  title: 'Components/StepDrawer',
  component: StepDrawer,
  argTypes: {
    open: { control: false },
    current: { control: false },
    children: { control: false },
    primaryAction: { control: false },
    extraContent: { control: false },
  },
}

export default meta

type Story = StoryObj<typeof meta>

const StepBody = ({ label }: { label: string }) => (
  <div className="mx-auto max-w-2xl">
    <p>Content for the {label} step goes here.</p>
  </div>
)

// The flow owns the step index and drives it from the footer. There is no Go
// back on the first step, and the last step's primary action finishes the flow.
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [current, setCurrent] = useState(0)
    const { next, previous, canGoNext, canGoPrevious } = useSteps({
      current,
      setCurrent,
      totalSteps: LABELS.length,
    })

    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open step drawer
        </Button>
        <StepDrawer
          open={open}
          onClose={() => setOpen(false)}
          afterOpenChange={(isOpen) => !isOpen && setCurrent(0)}
          title="New item"
          labels={LABELS}
          current={current}
          onBack={canGoPrevious ? previous : undefined}
          primaryAction={
            canGoNext ? (
              <Button type="primary" size="large" onClick={next}>
                Next step
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                onClick={() => setOpen(false)}
              >
                Finish
              </Button>
            )
          }
        >
          <StepBody label={LABELS[current]} />
        </StepDrawer>
      </>
    )
  },
}

// A flow whose first step has somewhere to return to passes `onBack` there too.
export const GoBackOnFirstStep: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [current, setCurrent] = useState(0)
    const { next, previous, canGoNext } = useSteps({
      current,
      setCurrent,
      totalSteps: LABELS.length,
    })

    return (
      <>
        <p className="mb-4">
          Go back on the first step closes the drawer and returns here.
        </p>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open step drawer
        </Button>
        <StepDrawer
          open={open}
          onClose={() => setOpen(false)}
          afterOpenChange={(isOpen) => !isOpen && setCurrent(0)}
          title="New item"
          labels={LABELS}
          current={current}
          onBack={current === 0 ? () => setOpen(false) : previous}
          primaryAction={
            canGoNext ? (
              <Button type="primary" size="large" onClick={next}>
                Next step
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                onClick={() => setOpen(false)}
              >
                Finish
              </Button>
            )
          }
        >
          <StepBody label={LABELS[current]} />
        </StepDrawer>
      </>
    )
  },
}

// The drawer has no `canProceed` prop. The flow decides how a step is gated by
// the primary action it passes, here a button disabled until the field is
// filled in.
export const GatedPrimaryAction: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [current, setCurrent] = useState(0)
    const [name, setName] = useState('')
    const { next, previous, canGoNext, canGoPrevious } = useSteps({
      current,
      setCurrent,
      totalSteps: LABELS.length,
    })
    const blocked = current === 0 && name.trim() === ''

    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open step drawer
        </Button>
        <StepDrawer
          open={open}
          onClose={() => setOpen(false)}
          afterOpenChange={(isOpen) => {
            if (!isOpen) {
              setCurrent(0)
              setName('')
            }
          }}
          title="New item"
          labels={LABELS}
          current={current}
          onBack={canGoPrevious ? previous : undefined}
          primaryAction={
            canGoNext ? (
              <Button
                type="primary"
                size="large"
                onClick={next}
                disabled={blocked}
              >
                Next step
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                onClick={() => setOpen(false)}
              >
                Finish
              </Button>
            )
          }
        >
          {current === 0 ? (
            <div className="mx-auto flex max-w-2xl flex-col gap-2">
              <label htmlFor="step-drawer-name">Name</label>
              <AntdInput
                id="step-drawer-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Required to continue"
              />
            </div>
          ) : (
            <StepBody label={LABELS[current]} />
          )}
        </StepDrawer>
      </>
    )
  },
}

const ReviewStep = ({ onFinish }: { onFinish: () => void }) => {
  const { primary, extra } = useStepDrawerSlots()
  const [notes, setNotes] = useState('')

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-2">
      <label htmlFor="step-drawer-notes">Notes</label>
      <AntdInput
        id="step-drawer-notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />
      {primary &&
        createPortal(
          <Button
            type="primary"
            size="large"
            onClick={onFinish}
            disabled={notes.trim() === ''}
          >
            Finish
          </Button>,
          primary
        )}
      {extra && createPortal(<Button size="large">Save draft</Button>, extra)}
    </div>
  )
}

// A step whose buttons depend on its own state portals them into the footer
// and header slots. The header slot only exists while `extraContent` is empty,
// and the footer slot sits beside `primaryAction`, so the last step passes
// neither prop.
export const StepOwnsItsActions: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [current, setCurrent] = useState(0)
    const { next, previous, canGoNext, canGoPrevious } = useSteps({
      current,
      setCurrent,
      totalSteps: LABELS.length,
    })

    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open step drawer
        </Button>
        <StepDrawer
          open={open}
          onClose={() => setOpen(false)}
          afterOpenChange={(isOpen) => !isOpen && setCurrent(0)}
          title="New item"
          labels={LABELS}
          current={current}
          onBack={canGoPrevious ? previous : undefined}
          primaryAction={
            canGoNext ? (
              <Button type="primary" size="large" onClick={next}>
                Next step
              </Button>
            ) : undefined
          }
        >
          {canGoNext ? (
            <StepBody label={LABELS[current]} />
          ) : (
            <ReviewStep onFinish={() => setOpen(false)} />
          )}
        </StepDrawer>
      </>
    )
  },
}
