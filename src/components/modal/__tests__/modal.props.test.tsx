import { render, screen } from '@testing-library/react'
import { Modal } from '../Modal'

describe('Modal props', () => {
  it('renders a subtitle under the title', () => {
    render(
      <Modal open title="Export" subtitle="Choose what to include">
        Body
      </Modal>
    )
    expect(screen.getByText('Export')).toBeInTheDocument()
    expect(screen.getByText('Choose what to include')).toBeInTheDocument()
  })

  it('keeps j2-modal alongside a consumer className', () => {
    render(
      <Modal open title="Export" className="custom">
        Body
      </Modal>
    )
    const modal = document.querySelector('.ant-modal') as HTMLElement
    expect(modal).toHaveClass('j2-modal')
    expect(modal).toHaveClass('custom')
  })
})
