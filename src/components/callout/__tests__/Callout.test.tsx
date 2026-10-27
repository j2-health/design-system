import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Callout } from '../Callout'

describe('Callout', () => {
  it('renders the main line', () => {
    render(<Callout>Want to add more?</Callout>)
    expect(screen.getByText('Want to add more?')).toBeInTheDocument()
  })

  it('renders the title, extra and footer when given', () => {
    render(
      <Callout
        title="Groups"
        extra={<button type="button">Add</button>}
        footer={<span>Tag one</span>}
      >
        Each group needs a column.
      </Callout>
    )
    expect(screen.getByText('Groups')).toBeInTheDocument()
    expect(screen.getByText('Each group needs a column.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
    expect(screen.getByText('Tag one')).toBeInTheDocument()
  })

  it('omits the optional parts when not given', () => {
    const { container } = render(<Callout>Only text</Callout>)
    expect(container.querySelectorAll('button')).toHaveLength(0)
    expect(container.firstElementChild?.children).toHaveLength(1)
  })
})
