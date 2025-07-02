import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../button'
import { Modal } from './Modal'

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the modal is visible',
    },
    onClose: {
      action: 'closed',
      description: 'Callback function called when the modal needs to be closed',
    },
    onOk: {
      action: 'ok clicked',
      description: 'Callback for OK button click',
    },
    title: {
      control: 'text',
      description: 'Modal title',
    },
    showCancel: {
      control: 'boolean',
      description: 'Show cancel button in footer',
    },
    showOk: {
      control: 'boolean',
      description: 'Show OK button in footer',
    },
    cancelText: {
      control: 'text',
      description: 'Cancel button text',
    },
    okText: {
      control: 'text',
      description: 'OK button text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Interactive example with state management
const ModalWithState = (args: any) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button type="primary" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onOk={() => {
          console.log('OK clicked')
          setIsOpen(false)
        }}
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit interdum
          hendrerit ex vitae sodales.
        </p>
      </Modal>
    </>
  )
}

export const Default: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Modal title',
    showCancel: true,
    showOk: true,
    cancelText: 'Cancel',
    okText: 'Ok',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The default modal with Phosphor close icon (X) in the top right corner.',
      },
    },
  },
}

export const WithLongContent: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Terms and Conditions',
    showCancel: true,
    showOk: true,
    cancelText: 'Decline',
    okText: 'Accept',
    children: (
      <div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </p>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt.
        </p>
      </div>
    ),
  },
}

export const NoFooter: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Custom Footer',
    showCancel: false,
    showOk: false,
    children: (
      <div>
        <p>
          This modal has no default footer buttons. You can add your own custom
          buttons in the content area.
        </p>
        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <Button type="default" style={{ marginRight: '8px' }}>
            Custom Action
          </Button>
          <Button type="primary">Another Action</Button>
        </div>
      </div>
    ),
  },
}
