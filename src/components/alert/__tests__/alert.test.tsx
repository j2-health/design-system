import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Alert } from '../Alert'

describe('Alert', () => {
  it('forwards dismissal callbacks when closeText enables closing', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const afterClose = vi.fn()
    render(
      <Alert
        type="info"
        message="Notice"
        closeText="Dismiss"
        onClose={onClose}
        afterClose={afterClose}
      />
    )
    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onClose).toHaveBeenCalledOnce()
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveClass(
        'ant-alert-motion-leave-active'
      )
    )
    fireEvent.transitionEnd(screen.getByRole('alert'))
    await waitFor(() => expect(afterClose).toHaveBeenCalledOnce())
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should render correctly', () => {
    const { container } = render(<Alert message="Hello world" type="success" />)
    expect(container).toMatchSnapshot()
  })
})
