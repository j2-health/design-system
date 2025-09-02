import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { SummarizedSelect } from './SummarizedSelect'

const defaultOptions = [
  { label: 'Family Medicine', value: 'Family Medicine' },
  { label: 'Nurse Practitioner', value: 'Nurse Practitioner' },
  { label: 'Internal Medicine', value: 'Internal Medicine' },
  { label: 'Pediatrics', value: 'Pediatrics' },
  { label: 'Emergency Medicine', value: 'Emergency Medicine' },
  { label: 'Cardiology', value: 'Cardiology' },
  { label: 'Dermatology', value: 'Dermatology' },
  { label: 'Orthopedic Surgery', value: 'Orthopedic Surgery' },
]

const meta = {
  title: 'Components/SummarizedSelect',
  component: SummarizedSelect,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    searchPlaceholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
    },
    formControlPlaceholder: {
      control: 'text',
      description: 'Placeholder text for the form control',
    },
    value: {
      control: 'object',
      description: 'Array of selected values',
    },
    options: {
      control: 'object',
      description: 'Array of option objects with label and value properties',
    },
    onChange: {
      action: 'changed',
      description: 'Callback function when selection changes',
    },
  },
  args: {
    searchPlaceholder: 'Search specialties...',
    formControlPlaceholder: 'Select J2 Specialties',
    value: [],
    multiple: true,
    options: defaultOptions,
    onChange: () => {},
    renderLabel: (count: number) => `${count} selected`,
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-gray-50 min-h-[400px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof SummarizedSelect>

// eslint-disable-next-line import/no-default-export
export default meta
type Story = StoryObj<typeof meta>

// Wrapper component to handle state management in Storybook
const SummarizedSelectWrapper = (
  args: Partial<React.ComponentProps<typeof SummarizedSelect>>
) => {
  const isMultiple = args.multiple ?? true
  const [value, setValue] = useState<string[] | string>(
    args.value ?? (isMultiple ? [] : '')
  )

  const handleChange = (newValue: string | string[]) => {
    setValue(newValue)
  }

  return (
    <SummarizedSelect
      {...args}
      options={args.options ?? defaultOptions}
      formControlPlaceholder={args.formControlPlaceholder ?? 'Select...'}
      multiple={isMultiple}
      renderLabel={args.renderLabel ?? ((count: number) => `${count} selected`)}
      value={value}
      onChange={handleChange}
    />
  )
}

export const Default: Story = {
  args: {
    searchPlaceholder: 'Search specialties...',
    formControlPlaceholder: 'Select J2 Specialties',
    value: [],
  },
  render: (args) => <SummarizedSelectWrapper {...args} />,
}

export const WithSelectedValues: Story = {
  args: {
    searchPlaceholder: 'Search specialties...',
    formControlPlaceholder: 'Select J2 Specialties',
    value: ['Family Medicine', 'Nurse Practitioner'],
  },
  render: (args) => <SummarizedSelectWrapper {...args} />,
}

export const CustomPlaceholders: Story = {
  args: {
    searchPlaceholder: 'Type to search medical specialties...',
    formControlPlaceholder: 'Choose your specialties',
  },
  render: (args) => <SummarizedSelectWrapper {...args} />,
}

export const FewOptions: Story = {
  args: {
    searchPlaceholder: 'Search skills...',
    formControlPlaceholder: 'Select Skills',
    value: [],
    options: [
      { label: 'JavaScript', value: 'JavaScript' },
      { label: 'TypeScript', value: 'TypeScript' },
      { label: 'React', value: 'React' },
    ],
  },
  render: (args) => <SummarizedSelectWrapper {...args} />,
}

export const EmptyOptions: Story = {
  args: {
    searchPlaceholder: 'Search...',
    formControlPlaceholder: 'No options available',
    value: [],
    options: [],
  },
  render: (args) => <SummarizedSelectWrapper {...args} />,
}

export const Underlined: Story = {
  args: {
    searchPlaceholder: 'Search specialties...',
    formControlPlaceholder: 'Select J2 Specialties',
    value: ['Family Medicine'],
    variant: 'underlined',
  },
  render: (args) => <SummarizedSelectWrapper {...args} />,
}

export const SingleSelection: Story = {
  args: {
    multiple: false,
  },
  render: (args) => <SummarizedSelectWrapper {...args} />,
}
