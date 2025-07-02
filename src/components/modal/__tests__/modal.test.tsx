import { render } from '@testing-library/react'
import { Modal } from '../Modal'

describe('Modal', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={jest.fn()}>
        Test content
      </Modal>
    )
    expect(container).toMatchSnapshot()
  })
})
