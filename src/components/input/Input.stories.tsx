import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'
import { Formik } from 'formik'
import { Form } from '../form'
const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  decorators: [
    (Story) => {
      return (
        <Formik initialValues={{ best_potato_chip: '' }} onSubmit={() => {}}>
          <Form>
            <Story />
          </Form>
        </Formik>
      )
    },
  ],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'best_potato_chip',
    placeholder: 'What is the best potato chip?',
  },
}
