import { act, render } from '@testing-library/react'
import { NavMenu } from '../NavMenu'

describe('NavMenu', () => {
  it('should render correctly', async () => {
    const { container } = await act(async () =>
      render(
        <NavMenu
          items={[
            { label: 'Dashboard', key: 'dashboard' },
            { label: 'Settings', key: 'settings' },
          ]}
          footerItems={[{ label: 'Logout', key: 'logout' }]}
        />
      )
    )

    expect(container).toMatchSnapshot()
  })
})
