import type { StoryObj, Decorator } from '@storybook/react-vite'

import { Steps } from './Steps'
import { BagIcon, CarIcon, DogIcon } from '@phosphor-icons/react'
import { Drawer } from '../drawer'
import { useState } from 'react'
import { Button } from '../button'
import { useSteps } from './useSteps'

const meta = {
  title: 'Components/Steps',
  component: Steps,
  decorators: [
    ((Story) => (
      <div
        style={{
          width: '100vw',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <Story />
      </div>
    )) as Decorator,
  ],
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'small'],
    },
    current: {
      control: false,
    },
    dot: {
      control: 'boolean',
    },
    type: {
      control: 'radio',
      options: ['default', 'navigation', 'inline'],
    },
    setCurrent: {
      control: 'function',
    },
  },
  args: {
    direction: 'horizontal',
    size: 'default',
    dot: false,
    type: 'default',
    items: [
      {
        title: 'Finished',
      },
      {
        title: 'In Progress',
      },
      {
        title: 'Waiting',
      },
    ],
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    direction: 'horizontal',
    size: 'default',
    dot: false,
    type: 'default',
  },
}

export const Vertical: Story = {
  args: {
    direction: 'vertical',
    size: 'default',
    dot: false,
    type: 'default',
    items: [
      {
        title: 'Finished',
        description: 'This is a description',
      },
      {
        title: 'In Progress',
        description: 'This is a description',
      },
      {
        title: 'Waiting',
        description: 'This is a description',
      },
    ],
  },
}

export const Small: Story = {
  args: {
    direction: 'horizontal',
    size: 'small',
    dot: false,
    type: 'default',
  },
}

export const WithDots: Story = {
  args: {
    direction: 'horizontal',
    size: 'default',
    dot: true,
    type: 'default',
    items: [
      {
        title: 'Step 1',
        description: 'This is a description',
      },
      {
        title: 'Step 2',
        description: 'This is a description',
      },
      {
        title: 'Step 3',
        description: 'This is a description',
      },
    ],
  },
}

export const Navigation: Story = {
  args: {
    type: 'navigation',
    items: [
      {
        title: 'Step 1',
      },
      {
        title: 'Step 2',
      },
      {
        title: 'Step 3',
      },
    ],
  },
}

export const Inline: Story = {
  args: {
    direction: 'horizontal',
    size: 'default',
    dot: false,
    type: 'inline',
  },
}

export const WithCustomItems: Story = {
  args: {
    direction: 'horizontal',
    size: 'default',
    dot: false,
    type: 'default',
    items: [
      {
        title: 'Finished',
        icon: <BagIcon size={24} />,
      },
      {
        title: 'In Progress',
        icon: <DogIcon size={24} />,
      },
      {
        title: 'Waiting',
        icon: <CarIcon size={24} />,
      },
    ],
  },
}

export const StepsDrawer: Story = {
  args: {
    direction: 'horizontal',
    size: 'default',
    dot: false,
    type: 'default',
  },

  render: (args) => {
    const [open, setOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const totalSteps = args.items?.length || 3

    const { next, previous, cancel, canGoNext, canGoPrevious } = useSteps({
      current: currentStep,
      setCurrent: setCurrentStep,
      totalSteps,
    })

    const handleCancel = () => {
      cancel()
      setOpen(false)
    }

    const customFooter = (
      <div
        style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}
      >
        <Button onClick={handleCancel}>Cancel</Button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={() => previous()} hidden={!canGoPrevious}>
            Previous
          </Button>
          <Button type="primary" onClick={() => next()} disabled={!canGoNext}>
            Next
          </Button>
        </div>
      </div>
    )

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer with Steps</Button>
        <Drawer
          title="Steps in Drawer"
          open={open}
          onClose={() => setOpen(false)}
          footer={customFooter}
        >
          <Steps {...args} current={currentStep} setCurrent={setCurrentStep} />
          <div style={{ marginTop: '20px' }}>
            <p>
              Current step: {currentStep + 1} of {totalSteps}
            </p>
            <p>Step content for step {currentStep + 1} would go here...</p>
          </div>
        </Drawer>
      </>
    )
  },
}
