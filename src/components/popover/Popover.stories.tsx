import type { Meta, StoryObj } from '@storybook/react'

import { Checkbox } from '../checkbox/Checkbox'
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
    scrollable: false,
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
    scrollable: {
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

export const Scrollable: Story = {
  args: {
    scrollable: true,
    title: <h5>I'm a scrollable popover of fruits</h5>,
    content: (
      <Checkbox.Group
        className="flex flex-col gap-2"
        options={[
          'Apple',
          'Pear',
          'Orange',
          'Grape',
          'Banana',
          'Mango',
          'Pineapple',
          'Blueberry',
          'Strawberry',
          'Kiwi',
          'Peach',
          'Plum',
        ]}
      />
    ),
    trigger: 'hover',
    children: <span>Trigger to scroll through fruits</span>,
  },
}
