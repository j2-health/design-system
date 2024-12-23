import type { Meta, StoryObj } from '@storybook/react'
import { FiltersForm } from '.'
import { useState } from 'react'
import { FilterForm } from './FiltersForm'

const meta: Meta<typeof FiltersForm> = {
  title: 'Components/FiltersForm',
  component: FiltersForm,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {},
  decorators: [
    (Story) => {
      const [submittedFormValues, setSubmittedFormValues] = useState<
        FilterForm | undefined
      >(undefined)

      return (
        <div style={{ backgroundColor: '#fff', padding: 50 }}>
          <Story
            onSubmit={(values: FilterForm) => {
              setSubmittedFormValues(values)
            }}
          />
          <div>
            <pre>{JSON.stringify(submittedFormValues, null, 2)}</pre>
          </div>
        </div>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    filterConfigs: [
      {
        label: 'Fruit',
        field: 'fruit',
        type: 'select',
        options: [
          { label: 'Apple', value: 'apple' },
          { label: 'Banana', value: 'banana' },
          { label: 'Orange', value: 'orange' },
        ],
      },
      {
        label: 'Vegetables',
        field: 'vegetables',
        type: 'select',
        options: [
          { label: 'Carrot', value: 'carrot' },
          { label: 'Onion', value: 'onion' },
          { label: 'Celery', value: 'celery' },
        ],
      },
      {
        label: 'Weight',
        field: 'weight',
        type: 'number',
      },
      {
        label: 'Color',
        field: 'color',
        type: 'text',
      },
    ],
    onSubmit: (values: FilterForm) => {
      console.log({ values })
    },
    title: 'Find some produce',
  },
}
