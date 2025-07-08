import { render } from '@testing-library/react'
import { NotificationModal } from '../NotificationModal'

describe('NotificationModal', () => {
  it('should render correctly', () => {
    render(
      <NotificationModal open={true} title="Test Modal" type="info">
        Test content
      </NotificationModal>
    )

    // Modal renders to a portal, so we need to find it in the document
    const modal = document.querySelector('.j2-modal')
    expect(modal).toMatchSnapshot()
  })
})
