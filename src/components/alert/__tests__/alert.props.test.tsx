import { render, screen } from '@testing-library/react'
import { Alert } from '../Alert'

describe('Alert props', () => {
  it('accepts a ReactNode description and an action', () => {
    render(
      <Alert
        type="warning"
        message="Heads up"
        description={
          <span>
            Read the <a href="#guide">guide</a>.
          </span>
        }
        action={<button type="button">Fix it</button>}
      />
    )
    expect(screen.getByRole('link', { name: 'guide' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fix it' })).toBeInTheDocument()
  })

  it('keeps its own class alongside a consumer className', () => {
    render(<Alert type="info" message="Notice" className="custom" />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('custom')
    // The DS's own CSS-module class (unhashed in tests), not antd's `ant-alert`.
    expect(alert).toHaveClass('alert')
  })
})
