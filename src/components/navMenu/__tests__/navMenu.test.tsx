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

describe('NavMenu defaultCollapsed', () => {
  const renderMenu = (defaultCollapsed?: boolean) =>
    act(async () =>
      render(
        <NavMenu
          defaultCollapsed={defaultCollapsed}
          items={[{ label: 'Dashboard', key: 'dashboard' }]}
          footerItems={[]}
        />
      )
    )
  const root = (container: HTMLElement) =>
    container.firstElementChild as HTMLElement

  it('starts expanded by default', async () => {
    const { container } = await renderMenu()
    expect(root(container).className).not.toMatch(/collapsed/)
  })

  it('starts collapsed and can still expand', async () => {
    const { container } = await renderMenu(true)
    expect(root(container).className).toMatch(/collapsed/)

    const toggle = container.querySelector('.toggle-button') as HTMLElement
    await act(async () => toggle.click())
    expect(root(container).className).not.toMatch(/collapsed/)
  })
})
