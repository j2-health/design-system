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
    open: {
      control: 'boolean',
      description: 'Controls whether the modal is visible',
    },
    onCancel: {
      action: 'cancel clicked',
      description:
        'Optional callback for Cancel button click. If provided, Cancel button and close (X) button will be shown.',
    },
    onOk: {
      action: 'ok clicked',
      description:
        'Optional callback for OK button click. If provided, OK button will be shown.',
    },
    title: {
      control: 'text',
      description: 'Modal title',
    },
    cancelText: {
      control: 'text',
      description: 'Cancel button text',
    },
    okText: {
      control: 'text',
      description: 'OK button text',
    },
    type: {
      control: 'select',
      options: ['default', 'success', 'info', 'warning', 'error'],
      description: 'Modal type - determines icon and styling',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Interactive example with state management
const ModalWithState = (args: any) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleCancel = (e: any) => {
    if (args.onCancel) {
      args.onCancel(e)
    }
    setIsOpen(false)
  }

  const handleOk = (e: any) => {
    if (args.onOk) {
      args.onOk(e)
    }
    setIsOpen(false)
  }

  return (
    <>
      <Button type="primary" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <Modal {...args} open={isOpen} onCancel={handleCancel} onOk={handleOk}>
        {args.children || (
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit interdum
            hendrerit ex vitae sodales.
          </p>
        )}
      </Modal>
    </>
  )
}

export const Default: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Modal title',
    type: 'default',
    cancelText: 'Cancel',
    okText: 'OK',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The default modal with no icon, featuring a clean layout with just the title and content.',
      },
    },
  },
}

export const WithLongContent: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Terms and Conditions',
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
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button type="primary" onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>
        <Modal {...args} open={isOpen} onCancel={() => setIsOpen(false)}>
          {args.children}
        </Modal>
      </>
    )
  },
  args: {
    title: 'Custom Footer',
    footer: null,
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

export const WithInfoIcon: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Information',
    type: 'info',
    cancelText: 'Cancel',
    okText: 'OK',
    children: (
      <p>
        Interactively monetize corporate alignments and fully tested niche
        markets.
      </p>
    ),
  },
}

export const WithSuccessIcon: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button type="primary" onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>
        <Modal
          {...args}
          open={isOpen}
          onCancel={() => setIsOpen(false)}
          onOk={() => {
            console.log('OK clicked')
            setIsOpen(false)
          }}
        >
          {args.children}
        </Modal>
      </>
    )
  },
  args: {
    title: 'Success!',
    type: 'success',
    okText: 'Great!',
    children: (
      <p>
        Your changes have been saved successfully. All data has been updated in
        the system.
      </p>
    ),
  },
}

export const WithWarningIcon: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    title: 'Warning',
    type: 'warning',
    cancelText: 'Cancel',
    okText: 'Continue',
    children: (
      <p>
        This action may have unintended consequences. Please review your
        settings before proceeding.
      </p>
    ),
  },
}

export const WithErrorIcon: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button type="primary" onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>
        <Modal
          {...args}
          open={isOpen}
          onCancel={() => setIsOpen(false)}
          onOk={() => {
            console.log('OK clicked')
            setIsOpen(false)
          }}
        >
          {args.children}
        </Modal>
      </>
    )
  },
  args: {
    title: 'Error Occurred',
    type: 'error',
    okText: 'Try Again',
    children: (
      <p>
        Something went wrong while processing your request. Please check your
        connection and try again.
      </p>
    ),
  },
}

export const NotClosable: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button type="primary" onClick={() => setIsOpen(true)}>
          Open Non-Closable Modal
        </Button>
        <Modal
          {...args}
          open={isOpen}
          onCancel={undefined}
          onOk={() => {
            console.log('OK clicked')
            setIsOpen(false)
          }}
        >
          {args.children || (
            <p>
              This modal can only be closed by clicking the OK button. There is
              no close button or outside click functionality.
            </p>
          )}
        </Modal>
      </>
    )
  },
  args: {
    title: 'Non-Closable Modal',
    okText: 'Acknowledge',
    closable: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When closable is false is not provided, the modal becomes non-closable. No close button is shown and clicking outside has no effect.',
      },
    },
  },
}
