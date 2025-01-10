import type { Meta, StoryObj } from '@storybook/react'

import { Popover, PopoverHeader } from './Popover'

const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  args: {
    placement: 'top',
    trigger: 'hover',
    arrow: true,
  },
  argTypes: {
    placement: {
      control: 'radio',
      options: ['top', 'right', 'bottom', 'left'],
    },
    trigger: {
      control: 'radio',
      options: ['hover', 'click'],
    },
    arrow: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    content: (
      <div>
        <p>
          <strong>CMS (Centers for Medicare & Medicaid Services)</strong>{' '}
          oversees the nation’s major healthcare programs.
        </p>
        <p> Pretty important, right?'</p>
      </div>
    ),
    trigger: 'hover',
    children: <span>Trigger to learn about CMS</span>,
  },
}

export const WithHeader: Story = {
  args: {
    content: (
      <div className="-m-6">
        <PopoverHeader title="Did you know?" />
        <p>
          <strong>CMS (Centers for Medicare & Medicaid Services)</strong>{' '}
          oversees the nation’s major healthcare programs.
        </p>
        <p> Pretty important, right?'</p>
      </div>
    ),
    trigger: 'hover',
    children: <span>Trigger to learn about CMS</span>,
  },
}

export const Closeable: Story = {
  args: {
    content: (
      <div className="-m-6">
        <PopoverHeader title="Did you know?" onClose={() => {}} />
        <p>
          <strong>CMS (Centers for Medicare & Medicaid Services)</strong>{' '}
          oversees the nation’s major healthcare programs.
        </p>
        <p> Pretty important, right?'</p>
      </div>
    ),
    trigger: 'hover',
    children: <span>Trigger to learn about CMS</span>,
  },
}
