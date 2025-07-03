import { render } from '@testing-library/react'
import { Modal } from '../Modal'

describe('Modal', () => {
  it('should render correctly', () => {
    render(
      <Modal
        open={true}
        onClose={jest.fn()}
        onCancel={jest.fn()}
        onOk={jest.fn()}
        title="Test Modal"
      >
        Test content
      </Modal>
    )

    // Modal renders to a portal, so we need to find it in the document
    const modal = document.querySelector('.j2-modal')
    expect(modal).toMatchSnapshot()
  })
})
