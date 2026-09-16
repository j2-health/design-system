import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik, useFormikContext } from 'formik'
import { vi } from 'vitest'
import { Form } from '../Form'
import { Input } from '../../input/Input'
import { InputNumber } from '../../inputnumber/InputNumber'
import { Select } from '../../select/Select'

const State = () => {
  const { values, touched } = useFormikContext()
  return (
    <output data-testid="state">{JSON.stringify({ values, touched })}</output>
  )
}

describe('Formik bindings', () => {
  it.each([false, true])(
    'submits and resets nested text and numeric values (fast=%s)',
    async (fast) => {
      const user = userEvent.setup()
      const submit = vi.fn()
      const change = vi.fn()
      const blur = vi.fn()
      render(
        <Formik
          initialValues={{ details: { title: '', count: 1 } }}
          onSubmit={submit}
        >
          <Form>
            <Form.Item name="details.title" label="Title">
              <Input
                name="details.title"
                fast={fast}
                onChange={change}
                onBlur={blur}
              />
            </Form.Item>
            <Form.Item name="details.count" label="Count">
              <InputNumber name="details.count" fast={fast} />
            </Form.Item>
            <button type="submit">Save</button>
            <button type="reset">Reset</button>
            <State />
          </Form>
        </Formik>
      )
      await user.type(screen.getByLabelText('Title'), 'Draft')
      await user.tab()
      fireEvent.change(screen.getByRole('spinbutton'), {
        target: { value: '7' },
      })
      fireEvent.blur(screen.getByRole('spinbutton'))
      await waitFor(() =>
        expect(screen.getByTestId('state')).toHaveTextContent(
          '"touched":{"details":{"title":true,"count":true}}'
        )
      )
      expect(change).toHaveBeenCalled()
      expect(blur).toHaveBeenCalledOnce()
      await user.click(screen.getByText('Save'))
      await waitFor(() =>
        expect(submit).toHaveBeenCalledWith(
          { details: { title: 'Draft', count: 7 } },
          expect.anything()
        )
      )
      await user.click(screen.getByText('Reset'))
      await waitFor(() =>
        expect(screen.getByLabelText('Title')).toHaveValue('')
      )
      expect(screen.getByRole('spinbutton')).toHaveValue('1')
      expect(screen.getByTestId('state')).toHaveTextContent('"touched":{}')
    }
  )

  it('shows nested field validation after blur and blocks invalid submission', async () => {
    const user = userEvent.setup()
    const submit = vi.fn()
    render(
      <Formik initialValues={{ details: { title: '' } }} onSubmit={submit}>
        <Form>
          <Form.Item
            name="details.title"
            label="Title"
            validate={(value: string) => (value ? undefined : 'Required title')}
          >
            <Input name="details.title" />
          </Form.Item>
          <button type="submit">Save</button>
        </Form>
      </Formik>
    )
    expect(screen.queryByText('Required title')).not.toBeInTheDocument()
    await user.click(screen.getByLabelText('Title'))
    await user.tab()
    await waitFor(() =>
      expect(screen.getByText('Required title')).toBeVisible()
    )
    await user.click(screen.getByText('Save'))
    expect(submit).not.toHaveBeenCalled()
    await user.type(screen.getByLabelText('Title'), 'Valid')
    await user.click(screen.getByText('Save'))
    await waitFor(() => expect(submit).toHaveBeenCalledOnce())
    await waitFor(() =>
      expect(screen.queryByText('Required title')).not.toBeInTheDocument()
    )
  })

  it('shows initial errors until the field is touched and successfully validated', async () => {
    const user = userEvent.setup()
    render(
      <Formik
        initialValues={{ title: '' }}
        initialErrors={{ title: 'Server error' }}
        onSubmit={() => {}}
      >
        <Form>
          <Form.Item name="title" label="Title" showValidateSuccess>
            <Input name="title" />
          </Form.Item>
        </Form>
      </Formik>
    )
    await waitFor(() => expect(screen.getByText('Server error')).toBeVisible())
    await user.type(screen.getByLabelText('Title'), 'Fixed')
    await user.tab()
    await waitFor(() =>
      expect(screen.queryByText('Server error')).not.toBeInTheDocument()
    )
  })

  it('updates and clears a select while forwarding focus, change and blur callbacks', async () => {
    const user = userEvent.setup()
    const change = vi.fn()
    const focus = vi.fn()
    const blur = vi.fn()
    render(
      <Formik initialValues={{ choice: null }} onSubmit={() => {}}>
        <Form>
          <Form.Item name="choice" label="Choice">
            <Select
              name="choice"
              placeholder="Choose"
              allowClear
              options={[{ value: 'a', label: 'Option A' }]}
              onChange={change}
              onFocus={focus}
              onBlur={blur}
            />
          </Form.Item>
          <button type="button">Outside</button>
          <State />
        </Form>
      </Formik>
    )
    expect(screen.getByText('Choose')).toBeVisible()
    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByText('Option A'))
    await user.click(screen.getByText('Outside'))
    await waitFor(() =>
      expect(screen.getByTestId('state')).toHaveTextContent(
        '"values":{"choice":"a"},"touched":{"choice":true}'
      )
    )
    expect(change).toHaveBeenCalledWith(
      'a',
      expect.objectContaining({ value: 'a' })
    )
    expect(focus).toHaveBeenCalledOnce()
    expect(blur).toHaveBeenCalledOnce()
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    await waitFor(() =>
      expect(screen.getByTestId('state')).toHaveTextContent('"values":{}')
    )
    expect(change).toHaveBeenLastCalledWith(undefined, undefined)
  })
})
