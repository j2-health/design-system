import { render } from '@testing-library/react'
import { Dropdown } from '../Dropdown'

describe('Dropdown', () => {
  it('should render correctly', () => {
    const { container } = render(<Dropdown label="Test">Test</Dropdown>)
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
      render(<Dropdown label="Test" menu={menuWithClassName} menuType="slim" open />)

      const menuElement = document.querySelector('.ant-dropdown-menu')
      expect(menuElement).toHaveClass('j2-dropdown-slim-menu')
      expect(menuElement).toHaveClass('custom-menu-class')
    })
  })
})
