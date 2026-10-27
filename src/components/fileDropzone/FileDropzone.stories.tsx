import type { Meta, StoryObj } from '@storybook/react-vite'

import { FileDropzone } from './FileDropzone'

const meta = {
  title: 'Components/FileDropzone',
  component: FileDropzone,
  parameters: {
    layout: 'padded',
  },
  args: {
    status: 'idle',
    label: 'Upload items',
    onDownloadTemplate: () => {},
    onFileSelected: () => {},
    onViewIssues: () => {},
  },
} satisfies Meta<typeof FileDropzone>

// eslint-disable-next-line no-restricted-exports
export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = {}

export const Checking: Story = {
  args: { status: 'validating' },
}

// Uploaded, with a read-only summary and a confirm before Replace.
export const Uploaded: Story = {
  args: {
    status: 'success',
    fileName: 'items.csv',
    successExtra: (
      <span className="text-xs text-j2-text-secondary">1,240 rows in file</span>
    ),
    replaceConfirm: 'This overwrites your current file.',
  },
}

export const RowErrors: Story = {
  name: 'Uploaded with row errors',
  args: {
    status: 'success-with-errors',
    fileName: 'items.csv',
    errorRowCount: 4,
  },
}

export const RowWarnings: Story = {
  name: 'Uploaded with warnings',
  args: {
    status: 'success-with-warnings',
    fileName: 'items.csv',
    warningRowCount: 18,
  },
}

export const MissingColumns: Story = {
  name: 'Missing columns',
  args: { status: 'header-error', missingHeaders: ['Name', 'Count'] },
}

export const Disabled: Story = {
  args: { uploadDisabled: true },
}
