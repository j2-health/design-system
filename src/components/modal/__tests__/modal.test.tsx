import { render } from '@testing-library/react'
import { Modal } from '../Modal'

describe('Modal', () => {
  it('should render correctly with onClose', () => {
    const { container } = render(
      <Modal
        isOpen={true}
        onClose={jest.fn()}
        onCancel={jest.fn()}
        onOk={jest.fn()}
      >
        Test content
      </Modal>
    )
    expect(container).toMatchSnapshot()
  })
})
