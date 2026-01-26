import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../button'
import { NotificationModal } from './NotificationModal'

const meta: Meta<typeof NotificationModal> = {
  title: 'Components/NotificationModal',
  component: NotificationModal,
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
      description: 'Callback for Cancel button click and close (X) button.',
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
    type: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
      description: 'Notification type - determines the icon displayed',
    },
    withContentPadding: {
      control: 'boolean',
      description: 'Whether to add padding to the modal content',
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
const NotificationModalWithState = (args: any) => {
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
        Show {args.type} notification
      </Button>
      <NotificationModal
        {...args}
        open={isOpen}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        {args.children}
      </NotificationModal>
    </>
  )
}

export const Success: Story = {
  render: (args) => <NotificationModalWithState {...args} />,
  args: {
    type: 'success',
    title: 'Success!',
    okText: 'Great!',
    children: (
      <p>
        Your changes have been saved successfully. All data has been updated in
        the system.
      </p>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Success notification modal with green checkmark icon for positive feedback.',
      },
    },
  },
}

export const Info: Story = {
  render: (args) => <NotificationModalWithState {...args} />,
  args: {
    type: 'info',
    title: 'Information',
    cancelText: 'Cancel',
    okText: 'OK',
    children: (
      <p>
        Here's some important information you should know about this feature and
        how it works.
      </p>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Info notification modal with blue info icon for general information.',
      },
    },
  },
}

export const Warning: Story = {
  render: (args) => <NotificationModalWithState {...args} />,
  args: {
    type: 'warning',
    title: 'Warning',
    cancelText: 'Cancel',
    okText: 'Continue Anyway',
    children: (
      <p>
        This action may have unintended consequences. Please review your
        settings before proceeding.
      </p>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Warning notification modal with orange warning icon for cautionary messages.',
      },
    },
  },
}

export const Error: Story = {
  render: (args) => <NotificationModalWithState {...args} />,
  args: {
    type: 'error',
    title: 'Error Occurred',
    okText: 'Try Again',
    children: (
      <p>
        Something went wrong while processing your request. Please check your
        connection and try again.
      </p>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Error notification modal with red X icon for error messages.',
      },
    },
  },
}

export const WithLongContent: Story = {
  render: (args) => <NotificationModalWithState {...args} />,
  args: {
    type: 'warning',
    title: 'Important Notice',
    cancelText: 'Cancel',
    okText: 'I Understand',
    children: (
      <div>
        <p>
          Before proceeding with this action, please carefully read and
          understand the following terms and conditions:
        </p>
        <p>
          This operation will permanently modify your data and cannot be undone.
          Make sure you have created a backup of any important information
          before continuing.
        </p>
        <p>
          By clicking "I Understand", you acknowledge that you have read this
          warning and accept full responsibility for any consequences.
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Example of a notification modal with longer content that may require scrolling.',
      },
    },
  },
}
