import { StoryObj, Meta } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../button'
import { Drawer } from './Drawer'
import cx from 'classnames'

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  args: {
    placement: 'bottom',
    fillPage: false,
  },
  argTypes: {
    placement: {
      control: 'radio',
      options: ['top', 'bottom', 'left', 'right'],
    },
    fillPage: {
      control: 'boolean',
    },
    footer: {
      control: false,
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open Drawer
        </Button>
        <Drawer
          title="Drawer Title"
          open={open}
          onClose={() => setOpen(false)}
          {...args}
        >
          <div>Contents!</div>
        </Drawer>
      </>
    )
  },
}

export const WithCustomFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    const customFooter = (
      <>
        <Button
          type="default"
          size="large"
          onClick={() => alert('Custom action!')}
        >
          I'm a Button
        </Button>
        <div className={cx('gap-2', 'flex')}>
          <Button size="large" onClick={() => alert('Custom action!')}>
            Hello!
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => alert('Custom action!')}
          >
            Click Me
          </Button>
        </div>
      </>
    )

    return (
      <>
        <Button type="primary" onClick={() => setOpen(true)}>
          Open Drawer with Custom Footer
        </Button>
        <Drawer
          title="Custom Footer Drawer"
          open={open}
          onClose={() => setOpen(false)}
          footer={customFooter}
          fillPage={true}
        >
          <p>This drawer has a completely custom footer layout</p>
          <p>Maximum flexibility for complex use cases</p>
        </Drawer>
      </>
    )
  },
}
