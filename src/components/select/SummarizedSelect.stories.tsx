import type { StoryObj } from '@storybook/react-vite'
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
    options: defaultOptions,
    onChange: () => {},
    renderLabel: (count: number) => `${count} selected`,
  },
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => (
      <div className="p-8 bg-j2-bg-layout min-h-[400px]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
}

// eslint-disable-next-line import/no-default-export
export default meta
type Story = StoryObj<typeof meta>

type Option = {
  label: React.ReactNode
  value: string
}

type GroupOption = {
  label: string
  options: Option[]
}

type SelectOption = Option | GroupOption

type MultiSelectArgs = {
  searchPlaceholder?: string
  formControlPlaceholder?: string
  options?: SelectOption[]
  renderLabel?: (count: number) => string
  value?: string[]
  variant?: 'outlined' | 'filled' | 'borderless' | 'underlined' | 'headlined'
  loading?: boolean
  disabled?: boolean
}

type SingleSelectArgs = {
  searchPlaceholder?: string
  formControlPlaceholder?: string
  options?: SelectOption[]
  value?: string
  variant?: 'outlined' | 'filled' | 'borderless' | 'underlined' | 'headlined'
  loading?: boolean
  disabled?: boolean
  popupMatchSelectWidth?: boolean
}

// Multi-select wrapper component
const MultiSelectWrapper = (args: MultiSelectArgs) => {
  const [value, setValue] = useState<string[]>(args.value ?? [])

  const handleChange = (newValue: string[]) => {
    setValue(newValue)
  }

  return (
    <SummarizedSelect
      searchPlaceholder={args.searchPlaceholder ?? 'Search...'}
      formControlPlaceholder={args.formControlPlaceholder ?? 'Select...'}
      options={args.options ?? defaultOptions}
      multiple={true}
      renderLabel={args.renderLabel ?? ((count: number) => `${count} selected`)}
      value={value}
      onChange={handleChange}
      variant={args.variant}
      loading={args.loading}
      disabled={args.disabled}
    />
  )
}

// Single-select wrapper component
const SingleSelectWrapper = (args: SingleSelectArgs) => {
  const [value, setValue] = useState<string>(args.value ?? '')

  const handleChange = (newValue: string) => {
    setValue(newValue)
  }

  return (
    <SummarizedSelect
      searchPlaceholder={args.searchPlaceholder ?? 'Search...'}
      formControlPlaceholder={args.formControlPlaceholder ?? 'Select...'}
      options={args.options ?? defaultOptions}
      multiple={false}
      value={value}
      onChange={handleChange}
      variant={args.variant}
      loading={args.loading}
      disabled={args.disabled}
      popupMatchSelectWidth={args.popupMatchSelectWidth}
    />
  )
}

export const Default: Story = {
  args: {
    searchPlaceholder: 'Search specialties...',
    formControlPlaceholder: 'Select J2 Specialties',
    value: [],
  },
  render: (args) => <MultiSelectWrapper {...(args as MultiSelectArgs)} />,
}

export const WithSelectedValues: Story = {
  args: {
    searchPlaceholder: 'Search specialties...',
    formControlPlaceholder: 'Select J2 Specialties',
    value: ['Family Medicine', 'Nurse Practitioner'],
  },
  render: (args) => <MultiSelectWrapper {...(args as MultiSelectArgs)} />,
}

export const CustomPlaceholders: Story = {
  args: {
    searchPlaceholder: 'Type to search medical specialties...',
    formControlPlaceholder: 'Choose your specialties',
  },
  render: (args) => <MultiSelectWrapper {...(args as MultiSelectArgs)} />,
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
  render: (args) => <MultiSelectWrapper {...(args as MultiSelectArgs)} />,
}

export const EmptyOptions: Story = {
  args: {
    searchPlaceholder: 'Search...',
    formControlPlaceholder: 'No options available',
    value: [],
    options: [],
  },
  render: (args) => <MultiSelectWrapper {...(args as MultiSelectArgs)} />,
}

export const Underlined: Story = {
  args: {
    searchPlaceholder: 'Search specialties...',
    formControlPlaceholder: 'Select J2 Specialties',
    value: ['Family Medicine'],
    variant: 'underlined',
  },
  render: (args) => <MultiSelectWrapper {...(args as MultiSelectArgs)} />,
}

export const SingleSelection: Story = {
  args: {
    searchPlaceholder: 'Search specialties...',
    formControlPlaceholder: 'Select J2 Specialties',
    value: 'Family Medicine',
  },
  render: (args) => <SingleSelectWrapper {...(args as SingleSelectArgs)} />,
}

export const Headlined: Story = {
  args: {
    searchPlaceholder: 'Search specialties...',
    formControlPlaceholder: 'Select J2 Specialties',
    value: 'Family Medicine',
    variant: 'headlined',
  },
  render: (args) => (
    <div className="flex flex-col">
      <SingleSelectWrapper {...(args as SingleSelectArgs)} />
      <p className="mt-8 mb-2">popupMatchSelectWidth: false</p>
      <SingleSelectWrapper
        {...(args as SingleSelectArgs)}
        popupMatchSelectWidth={false}
      />
    </div>
  ),
}
