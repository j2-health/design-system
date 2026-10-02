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

// eslint-disable-next-line no-restricted-exports
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
  variant?:
    'outlined' | 'filled' | 'borderless' | 'underlined' | 'headlined' | 'field'
  loading?: boolean
  disabled?: boolean
}

type SingleSelectArgs = {
  searchPlaceholder?: string
  formControlPlaceholder?: string
  options?: SelectOption[]
  value?: string
  variant?:
    'outlined' | 'filled' | 'borderless' | 'underlined' | 'headlined' | 'field'
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
    multiple: true,
  },
  render: (args) => <MultiSelectWrapper {...(args as MultiSelectArgs)} />,
}

export const WithSelectedValues: Story = {
  args: {
    searchPlaceholder: 'Search specialties...',
    formControlPlaceholder: 'Select J2 Specialties',
    value: ['Family Medicine', 'Nurse Practitioner'],
    multiple: true,
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
    multiple: true,
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
    multiple: true,
  },
  render: (args) => <MultiSelectWrapper {...(args as MultiSelectArgs)} />,
}

export const Underlined: Story = {
  args: {
    searchPlaceholder: 'Search specialties...',
    formControlPlaceholder: 'Select J2 Specialties',
    value: ['Family Medicine'],
    multiple: true,
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

// Dropdown-trigger variant — the trigger is an antd Dropdown with a text
// target: semibold primary label and a duotone caret. Useful when the control
// sits inline (a breadcrumb, a drawer title, a toolbar switcher) rather than
// as a form field.

const networkOptions = [
  { label: 'Aetna California Commercial', value: '1' },
  { label: 'Aetna California Medicare Advantage', value: '2' },
  { label: 'Anthem Blue Cross Texas', value: '3' },
  { label: 'Blue Shield of California', value: '4' },
  { label: 'Cigna National PPO', value: '5' },
  { label: 'Humana Medicare Advantage', value: '6' },
  { label: 'Kaiser Permanente Mid-Atlantic', value: '7' },
  { label: 'UnitedHealthcare Commercial', value: '8' },
  { label: 'UnitedHealthcare Medicare Advantage', value: '9' },
]

type DropdownTriggerArgs = SingleSelectArgs

const DropdownTriggerWrapper = (args: DropdownTriggerArgs) => {
  const [value, setValue] = useState<string>(args.value ?? '')

  return (
    <SummarizedSelect
      trigger="dropdown"
      searchPlaceholder={args.searchPlaceholder ?? 'Search...'}
      formControlPlaceholder={args.formControlPlaceholder ?? 'Select...'}
      options={args.options ?? defaultOptions}
      multiple={false}
      value={value}
      onChange={setValue}
      loading={args.loading}
      disabled={args.disabled}
    />
  )
}

export const DropdownTrigger: Story = {
  args: {
    searchPlaceholder: 'Search networks...',
    formControlPlaceholder: 'Select a network',
    value: '1',
    options: networkOptions,
  },
  render: (args) => (
    <DropdownTriggerWrapper {...(args as DropdownTriggerArgs)} />
  ),
}

type DropdownMultiArgs = MultiSelectArgs

const DropdownMultiWrapper = (args: DropdownMultiArgs) => {
  const [value, setValue] = useState<string[]>(args.value ?? [])

  return (
    <SummarizedSelect
      trigger="dropdown"
      searchPlaceholder={args.searchPlaceholder ?? 'Search...'}
      formControlPlaceholder={args.formControlPlaceholder ?? 'Select...'}
      options={args.options ?? defaultOptions}
      multiple={true}
      renderLabel={args.renderLabel ?? ((count: number) => `${count} selected`)}
      value={value}
      onChange={setValue}
      loading={args.loading}
      disabled={args.disabled}
    />
  )
}

export const DropdownTriggerMulti: Story = {
  args: {
    searchPlaceholder: 'Search specialties...',
    formControlPlaceholder: 'Select specialties',
    value: ['Family Medicine', 'Pediatrics'],
    multiple: true,
  },
  render: (args) => <DropdownMultiWrapper {...(args as DropdownMultiArgs)} />,
}

// The trigger inside a page header: two switchers side by side, the second
// opting out of the semibold weight with `rootClassName="font-normal"`.
const DropdownTriggerInHeaderWrapper = () => {
  const [network, setNetwork] = useState('1')
  const [specialty, setSpecialty] = useState('Family Medicine')

  return (
    <div className="flex items-center gap-3 text-base">
      <SummarizedSelect
        trigger="dropdown"
        searchPlaceholder="Search networks..."
        options={networkOptions}
        value={network}
        onChange={setNetwork}
      />
      <span className="text-j2-text-tertiary">/</span>
      <SummarizedSelect
        trigger="dropdown"
        searchPlaceholder="Search specialties..."
        options={defaultOptions}
        value={specialty}
        onChange={setSpecialty}
      />
      <span className="text-j2-text-tertiary">·</span>
      <SummarizedSelect
        trigger="dropdown"
        rootClassName="font-normal"
        searchPlaceholder="Search specialties..."
        options={defaultOptions}
        value={specialty}
        onChange={setSpecialty}
      />
    </div>
  )
}

export const DropdownTriggerInHeader: Story = {
  render: () => <DropdownTriggerInHeaderWrapper />,
}

// Field variant — a plain form field that fills its column and keeps the same
// look whether or not anything is selected, so it lines up with the controls
// around it.
const FieldWrapper = () => {
  const [single, setSingle] = useState<string | undefined>()
  const [multiple, setMultiple] = useState<string[]>([
    'Family Medicine',
    'Pediatrics',
  ])

  return (
    <div className="grid w-80 grid-cols-[6rem_1fr] items-center gap-x-3 gap-y-2 text-sm">
      <span className="text-j2-text-secondary">Single</span>
      <SummarizedSelect
        variant="field"
        size="small"
        searchPlaceholder="Search specialties..."
        formControlPlaceholder="Any specialty"
        options={defaultOptions}
        value={single}
        onChange={setSingle}
      />
      <span className="text-j2-text-secondary">Multiple</span>
      <SummarizedSelect
        variant="field"
        size="small"
        multiple
        renderLabel={(count) => `${count} specialties`}
        searchPlaceholder="Search specialties..."
        formControlPlaceholder="Any specialty"
        options={defaultOptions}
        value={multiple}
        onChange={setMultiple}
      />
    </div>
  )
}

export const Field: Story = {
  render: () => <FieldWrapper />,
}
