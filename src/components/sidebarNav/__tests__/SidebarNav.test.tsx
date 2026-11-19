import { useState } from 'react'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SidebarNav, type SidebarNavProps } from '../SidebarNav'
import { SidebarNavCompactControl } from '../SidebarNavCompactControl'
import { SIDEBAR_NAV_WIDTH } from '../constants'

const icon = <svg data-testid="icon" />

const apps = [
  { key: 'one', label: 'App One', icon },
  { key: 'two', label: 'App Two', icon },
]

const baseProps: SidebarNavProps = {
  apps,
  appKey: 'one',
  sections: [
    {
      key: 'analyze',
      label: 'Analyze',
      groups: [
        {
          items: [
            { key: 'overview', label: 'Overview', icon },
            { key: 'reports', label: 'Reports', icon },
          ],
        },
      ],
    },
  ],
  footerItems: [{ key: 'help', label: 'Help', icon }],
  account: { name: 'Alex Rivera', email: 'alex@example.com' },
}

const renderNav = async (props: Partial<SidebarNavProps> = {}) => {
  const result = await act(async () =>
    render(<SidebarNav {...baseProps} {...props} />)
  )
  return result
}

const nav = () => screen.getByRole('navigation')

describe('SidebarNav', () => {
  it('renders sections, footer rows and the account', async () => {
    await renderNav()
    expect(nav()).toHaveAttribute('aria-label', 'App One navigation')
    expect(screen.getByText('Analyze')).toBeInTheDocument()
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
    expect(screen.getByText('Help')).toBeInTheDocument()
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument()
    expect(screen.getByText('alex@example.com')).toBeInTheDocument()
    expect(screen.getByText('AR')).toBeInTheDocument()
  })

  it('marks the selected row and reports clicks by key', async () => {
    const onNavigate = vi.fn()
    await renderNav({ selectedKey: 'reports', onNavigate })
    const selected = screen.getByText('Reports').closest('li')
    expect(selected?.className).toMatch(/ant-menu-item-selected/)

    await userEvent.click(screen.getByText('Overview'))
    expect(onNavigate).toHaveBeenCalledWith('overview')
    await userEvent.click(screen.getByText('Help'))
    expect(onNavigate).toHaveBeenCalledWith('help')
  })

  it('renders labeled groups as sub-groups and unlabeled ones flat', async () => {
    await renderNav({
      sections: [
        {
          key: 'main',
          groups: [
            { label: 'Monitor', items: [{ key: 'a', label: 'A', icon }] },
            { items: [{ key: 'b', label: 'B', icon }] },
          ],
        },
      ],
    })
    expect(screen.getByText('Monitor')).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  describe('collapse', () => {
    it('is uncontrolled by default and toggles both ways', async () => {
      const onCollapsedChange = vi.fn()
      await renderNav({ onCollapsedChange })
      expect(nav().className).not.toMatch(/collapsed/)

      await userEvent.click(screen.getByLabelText('Collapse menu'))
      expect(onCollapsedChange).toHaveBeenLastCalledWith(true)
      expect(nav().className).toMatch(/collapsed/)

      await userEvent.click(screen.getByLabelText('Expand menu'))
      expect(onCollapsedChange).toHaveBeenLastCalledWith(false)
      expect(nav().className).not.toMatch(/collapsed/)
    })

    it('follows `collapsed` when controlled', async () => {
      const onCollapsedChange = vi.fn()
      await renderNav({ collapsed: false, onCollapsedChange })
      await userEvent.click(screen.getByLabelText('Collapse menu'))
      expect(onCollapsedChange).toHaveBeenCalledWith(true)
      // The caller didn't update the prop, so it stays expanded.
      expect(nav().className).not.toMatch(/collapsed/)
    })

    it('starts collapsed with defaultCollapsed', async () => {
      await renderNav({ defaultCollapsed: true })
      expect(nav().className).toMatch(/collapsed/)
      expect(screen.getByLabelText('Expand menu')).toBeInTheDocument()
    })

    it('keeps the section labels as dividers on the rail', async () => {
      await renderNav({ collapsed: true })
      const title = nav().querySelector('.ant-menu-item-group-title')
      expect(title).toHaveTextContent('Analyze')
    })
  })

  describe('width', () => {
    it('defaults to 240px expanded and drops it collapsed', async () => {
      const { rerender } = await renderNav()
      expect(nav()).toHaveStyle({ width: `${SIDEBAR_NAV_WIDTH.default}px` })
      rerender(<SidebarNav {...baseProps} collapsed />)
      expect(nav().style.width).toBe('')
    })

    it('clamps a controlled width to 200–360', async () => {
      const { rerender } = await renderNav({ width: 1000 })
      expect(nav()).toHaveStyle({ width: '360px' })
      rerender(<SidebarNav {...baseProps} width={10} />)
      expect(nav()).toHaveStyle({ width: '200px' })
    })

    it('nudges with arrow keys and resets on double-click', async () => {
      const onWidthChange = vi.fn()
      await renderNav({ defaultWidth: 280, onWidthChange })
      const handle = screen.getByRole('separator')
      expect(handle).toHaveAttribute('aria-valuenow', '280')

      fireEvent.keyDown(handle, { key: 'ArrowRight' })
      expect(onWidthChange).toHaveBeenLastCalledWith(296)
      fireEvent.keyDown(handle, { key: 'ArrowLeft' })
      fireEvent.keyDown(handle, { key: 'ArrowLeft' })
      expect(onWidthChange).toHaveBeenLastCalledWith(264)

      fireEvent.doubleClick(handle)
      expect(onWidthChange).toHaveBeenLastCalledWith(280)
    })

    it('resizes on drag and snaps to the rail under 140px', async () => {
      const Controlled = () => {
        const [collapsed, setCollapsed] = useState(false)
        const [width, setWidth] = useState(240)
        return (
          <SidebarNav
            {...baseProps}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            width={width}
            onWidthChange={setWidth}
          />
        )
      }
      await act(async () => render(<Controlled />))
      const handle = screen.getByRole('separator')

      const move = (clientX: number) =>
        act(() => {
          const event = new MouseEvent('pointermove', { clientX })
          handle.dispatchEvent(event)
        })

      fireEvent.pointerDown(handle, { pointerId: 1 })
      move(300)
      expect(nav()).toHaveStyle({ width: '300px' })
      move(500)
      expect(nav()).toHaveStyle({ width: '360px' })
      move(100)
      expect(nav().className).toMatch(/collapsed/)
      move(220)
      expect(nav().className).not.toMatch(/collapsed/)
      expect(nav()).toHaveStyle({ width: '220px' })
      act(() => {
        handle.dispatchEvent(new MouseEvent('pointerup'))
      })
      move(330)
      // Released: no longer follows the pointer.
      expect(nav()).toHaveStyle({ width: '220px' })
    })

    it('can turn resizing off', async () => {
      await renderNav({ resizable: false })
      expect(screen.queryByRole('separator')).not.toBeInTheDocument()
    })
  })

  describe('app switcher', () => {
    it('opens the launcher and reports another app', async () => {
      const onAppChange = vi.fn()
      await renderNav({ onAppChange })
      const trigger = screen.getByLabelText('App One, switch app')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')

      await userEvent.click(trigger)
      const launcher = await screen.findByRole('menu', { name: 'Apps' })
      const items = within(launcher).getAllByRole('menuitem')
      expect(items).toHaveLength(2)
      expect(items[0]).toHaveAttribute('aria-current', 'true')

      await userEvent.click(within(launcher).getByText('App Two'))
      expect(onAppChange).toHaveBeenCalledWith('two')
    })

    it('does not report the current app', async () => {
      const onAppChange = vi.fn()
      await renderNav({ onAppChange })
      await userEvent.click(screen.getByLabelText('App One, switch app'))
      const launcher = await screen.findByRole('menu', { name: 'Apps' })
      await userEvent.click(within(launcher).getByText('App One'))
      expect(onAppChange).not.toHaveBeenCalled()
    })

    it('is the grid glyph on the rail', async () => {
      await renderNav({ collapsed: true })
      expect(screen.getByLabelText('App One, switch app')).toBeInTheDocument()
    })

    it('with one app, is a static name, and nothing on the rail', async () => {
      const { rerender } = await renderNav({ apps: [apps[0]] })
      expect(screen.getByText('App One')).toBeInTheDocument()
      expect(screen.queryByLabelText(/switch app/)).not.toBeInTheDocument()

      rerender(<SidebarNav {...baseProps} apps={[apps[0]]} collapsed />)
      expect(screen.queryByText('App One')).not.toBeInTheDocument()
    })
  })

  describe('scope block', () => {
    const scoped = (controls: (s: { collapsed: boolean }) => React.ReactNode) =>
      ({
        sections: [
          {
            kind: 'scope',
            key: 'workspace',
            controls,
            groups: [
              {
                label: 'Monitor',
                items: [{ key: 'records', label: 'Records', icon }],
              },
            ],
          },
        ],
      }) satisfies Partial<SidebarNavProps>

    it('draws its controls above its rows, told whether collapsed', async () => {
      const controls = vi.fn(({ collapsed }: { collapsed: boolean }) => (
        <span>{collapsed ? 'compact' : 'field'}</span>
      ))
      const { rerender } = await renderNav(scoped(controls))
      const block = screen.getByTestId('sidebar-nav-scope-workspace')
      expect(within(block).getByText('field')).toBeInTheDocument()
      expect(within(block).getByText('Records')).toBeInTheDocument()

      rerender(<SidebarNav {...baseProps} {...scoped(controls)} collapsed />)
      expect(within(block).getByText('compact')).toBeInTheDocument()
    })

    it('takes a compact control with a click handler', async () => {
      const onClick = vi.fn()
      await renderNav({
        collapsed: true,
        ...scoped(() => (
          <SidebarNavCompactControl
            icon={icon}
            title="Workspace A"
            aria-label="Workspace"
            onClick={onClick}
          />
        )),
      })
      await userEvent.click(screen.getByLabelText('Workspace'))
      expect(onClick).toHaveBeenCalled()
    })

    it('lays an overlay control over the compact button', async () => {
      await renderNav({
        collapsed: true,
        ...scoped(() => (
          <SidebarNavCompactControl
            icon={icon}
            title="Workspace A"
            overlay={<button type="button">Real control</button>}
          />
        )),
      })
      expect(
        screen.getByRole('button', { name: 'Real control' })
      ).toBeInTheDocument()
    })
  })

  describe('account', () => {
    it('shows a context line and custom initials', async () => {
      await renderNav({
        account: { name: 'Sam', context: 'Example Org', initials: 'XY' },
      })
      expect(screen.getByText('Example Org')).toBeInTheDocument()
      expect(screen.getByText('XY')).toBeInTheDocument()
    })

    it('keeps the account text in the DOM, hidden, on the rail', async () => {
      await renderNav({ collapsed: true })
      expect(screen.getByText('Alex Rivera').parentElement).toHaveAttribute(
        'aria-hidden',
        'true'
      )
    })

    it('can be left out', async () => {
      await renderNav({ account: undefined, footerItems: [] })
      expect(screen.queryByText('AR')).not.toBeInTheDocument()
    })
  })
})
