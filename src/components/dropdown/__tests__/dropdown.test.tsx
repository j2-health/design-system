import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown } from '../Dropdown'

describe('Dropdown', () => {
  it('should render correctly', () => {
    const { container } = render(<Dropdown label="Test" />)
    expect(container).toMatchSnapshot()
  })

  describe('menuType', () => {
    const menuItems = {
      items: [
        { key: '1', label: 'Item 1' },
        { key: '2', label: 'Item 2' },
      ],
    }

    it('should append j2-dropdown-slim-menu class when menuType is slim', () => {
      render(<Dropdown label="Test" menu={menuItems} menuType="slim" open />)

      const menuElement = document.querySelector('.ant-dropdown-menu')
      expect(menuElement).toHaveClass('j2-dropdown-slim-menu')
    })

    it('should not append j2-dropdown-slim-menu class when menuType is default', () => {
      render(<Dropdown label="Test" menu={menuItems} menuType="default" open />)

      const menuElement = document.querySelector('.ant-dropdown-menu')
      expect(menuElement).not.toHaveClass('j2-dropdown-slim-menu')
    })

    it('should not append j2-dropdown-slim-menu class when menuType is not specified', () => {
      render(<Dropdown label="Test" menu={menuItems} open />)

      const menuElement = document.querySelector('.ant-dropdown-menu')
      expect(menuElement).not.toHaveClass('j2-dropdown-slim-menu')
    })

    it('should preserve existing menu className when menuType is slim', () => {
      const menuWithClassName = {
        ...menuItems,
        className: 'custom-menu-class',
      }
      render(
        <Dropdown label="Test" menu={menuWithClassName} menuType="slim" open />
      )

      const menuElement = document.querySelector('.ant-dropdown-menu')
      expect(menuElement).toHaveClass('j2-dropdown-slim-menu')
      expect(menuElement).toHaveClass('custom-menu-class')
    })
  })
  describe('custom trigger', () => {
    const menu = { items: [{ key: 'png', label: 'Export as image' }] }

    it('renders children in place of the built-in target', () => {
      render(
        <Dropdown label="Ignored" menu={menu}>
          <button type="button">Share</button>
        </Dropdown>
      )
      expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument()
      expect(screen.queryByText('Ignored')).not.toBeInTheDocument()
    })

    it('opens the menu from the custom trigger', async () => {
      const user = userEvent.setup()
      render(
        <Dropdown menu={menu} trigger={['click']}>
          <button type="button">Share</button>
        </Dropdown>
      )
      await user.click(screen.getByRole('button', { name: 'Share' }))
      expect(await screen.findByText('Export as image')).toBeInTheDocument()
    })

    it('still applies the slim menu with a custom trigger', () => {
      render(
        <Dropdown menu={menu} menuType="slim" open>
          <button type="button">Share</button>
        </Dropdown>
      )
      expect(document.querySelector('.ant-dropdown-menu')).toHaveClass(
        'j2-dropdown-slim-menu'
      )
    })
  })
})
