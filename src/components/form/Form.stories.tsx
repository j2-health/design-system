import type { Meta, StoryObj } from '@storybook/react-vite'
import { Formik } from 'formik'
import { Form } from './Form'
import { Select } from '../select'
import { Button } from '../button/Button'
import { action } from 'storybook/actions'
import * as Yup from 'yup'

const meta = {
  title: 'Components/Form',
  component: Form,
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

export const BasicForm: Story = {
  render: () => {
    return (
      <Formik
        initialValues={{ ma_plan_type: '' }}
        validationSchema={Yup.object({
          ma_plan_type: Yup.string().required('MA plan type is required'),
        })}
        onSubmit={(values) => action('form-submitted')(values)}
      >
        {({ isValid, dirty }) => {
          const isFormReadyToSubmit = isValid && dirty
          return (
            <Form>
              <Form.Item label="MA Plan Type" name="ma_plan_type" required>
                <Select
                  name="ma_plan_type"
                  placeholder="Select a plan type"
                  allowClear={true}
                  style={{ width: '256px' }}
                  options={[
                    { label: 'HMO', value: 'hmo' },
                    { label: 'HMO SNP', value: 'hmo_snp' },
                    { label: 'HMO-POS', value: 'hmo_pos' },
                    { label: 'HMO D-SNP', value: 'hmo_d_snp' },
                    { label: 'PPO', value: 'ppo' },
                    { label: 'PPO SNP', value: 'ppo_snp' },
                    { label: 'PFFS', value: 'pffs' },
                    { label: 'MSA', value: 'msa' },
                    { label: 'Cost Plan', value: 'cost_plan' },
                    { label: 'PACE', value: 'pace' },
                  ]}
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!isFormReadyToSubmit}
              >
                Submit
              </Button>
            </Form>
          )
        }}
      </Formik>
    )
  },
}
