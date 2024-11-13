import { useState, useEffect, useRef } from 'react'
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
      options: { default: '', multiple: 'multiple' },
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
        <Select {...args} />
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
    onChange: { action: 'changed' },
    onSearch: { action: 'searched' },
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
        <Select {...args} />
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
        <Select {...args} />
      </Form>
    </Formik>
  ),
}

const TestComponent = () => {
  const [someVar, setVar] = useState(false)
  const timeoutRef = useRef<boolean>(false)


  useEffect(() => {
    console.log('var changed!')
  }, [someVar])

  if (!timeoutRef.current) {
    setTimeout(() => {
      setVar(true)
      console.log('setting to true the first time')
    }, 1000)
    setTimeout(() => {
      setVar(true)
      console.log('setting to true again')
    }, 3000)
    setTimeout(() => {
      setVar(false)
      console.log('setting back to false just in case')
    }, 5000)
  }

  timeoutRef.current = true

  return <div>{someVar}</div>
}

export const UseEffectTest: Story = {
  args: {
    size: 'middle',
    placeholder: 'Select a value',
    allowClear: true,
    options: [
      { label: '5', value: 5 },
      { label: 'string', value: 'some string' },
      { label: 'string (second)', value: 'some string' },
      { label: '5 (second)', value: 5 },
    ],
  },
  render: () => {
    return <TestComponent />
  },
}
