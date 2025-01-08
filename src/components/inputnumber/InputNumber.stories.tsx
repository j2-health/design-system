import type { Meta, StoryObj } from '@storybook/react'
import { InputNumber } from './InputNumber'
import { Form } from 'antd'
import { Formik } from 'formik'

const meta: Meta<typeof InputNumber> = {
  title: 'Components/InputNumber',
  component: InputNumber,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    step: {
      control: 'number',
      defaultValue: 1,
    },
    onChange: { action: 'changed' },
  },
  decorators: [
    (Story) => {
      return (
        <Formik initialValues={{ my_number: undefined }} onSubmit={() => {}}>
          <Form>
            <Story />
          </Form>
        </Formik>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'my_number',
    min: 0,
    max: 100,
    step: 1,
  },
}
