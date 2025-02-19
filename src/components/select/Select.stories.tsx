import type { Meta, StoryObj } from '@storybook/react'
import { Formik } from 'formik'
import { Form } from 'formik-antd'
import { Select } from './Select'

const meta = {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    size: {
      control: 'radio',
      options: ['large', 'middle', 'small'],
    },
    mode: {
      control: 'radio',
      options: ['multiple'],
      table: {
        defaultValue: { summary: '' },
      },
    },
    allowClear: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    onChange: { action: 'changed' },
  },
  args: {
    name: 'plan_metal',
    size: 'middle',
    options: [
      { label: 'Bronze Plan', value: 'bronze' },
      { label: 'Silver Plan', value: 'silver' },
      { label: 'Gold Plan', value: 'gold' },
      { label: 'Platinum Plan', value: 'platinum' },
    ],
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    size: 'middle',
    defaultValue: 'bronze',
    loading: false,
  },
  render: (args) => (
    <Formik initialValues={{ plan_metal: 'bronze' }} onSubmit={() => {}}>
      <Form>
        <Select {...args} className="w-64" />
      </Form>
    </Formik>
  ),
}

export const Search: Story = {
  args: {
    size: 'middle',
    showSearch: true,
    placeholder: 'Select a health care plan',
    optionFilterProp: 'label',
    allowClear: true,
    loading: false,
    options: [
      { value: 'bronze', label: 'Bronze Plan' },
      { value: 'silver', label: 'Silver Plan' },
      { value: 'gold', label: 'Gold Plan' },
      { value: 'platinum', label: 'Platinum Plan' },
    ],
  },
  render: (args) => (
    <Formik initialValues={{ plan_metal: '' }} onSubmit={() => {}}>
      <Form>
        <Select {...args} className="w-64" />
      </Form>
    </Formik>
  ),
}

export const Multiple: Story = {
  args: {
    size: 'middle',
    mode: 'multiple',
    placeholder: 'Select health care plans',
    defaultValue: ['bronze', 'gold'],
    allowClear: true,
    loading: false,
  },
  render: (args) => (
    <Formik
      initialValues={{ plan_metal: ['bronze', 'gold'] }}
      onSubmit={() => {}}
    >
      <Form>
        <Select {...args} className="w-64" />
      </Form>
    </Formik>
  ),
}

export const Loading: Story = {
  args: {
    ...Basic.args,
    loading: true,
    options: [],
  },
  render: (args) => (
    <Formik initialValues={{ plan_metal: '' }} onSubmit={() => {}}>
      <Form>
        <Select {...args} className="w-64" />
      </Form>
    </Formik>
  ),
}

export const NoOptions: Story = {
  args: {
    ...Basic.args,
    options: [],
  },
  render: (args) => (
    <Formik initialValues={{ plan_metal: '' }} onSubmit={() => {}}>
      <Form>
        <Select {...args} className="w-64" />
      </Form>
    </Formik>
  ),
}
