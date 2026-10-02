import { render, screen } from '@testing-library/react'
import { EmptyState } from '../EmptyState'

describe('EmptyState', () => {
  it('renders the title as a heading by default', () => {
    render(<EmptyState title="No results" description="Try another search." />)
    expect(
      screen.getByRole('heading', { level: 4, name: 'No results' })
    ).toBeInTheDocument()
    expect(screen.getByText('Try another search.')).toBeInTheDocument()
  })

  it('uses body text, not a heading, when compact', () => {
    render(<EmptyState size="compact" title="Nothing to list" />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByText('Nothing to list').tagName).toBe('P')
  })

  it('hides the icon from assistive tech and renders the action', () => {
    render(
      <EmptyState
        title="No results"
        icon={<svg data-testid="icon" />}
        action={<button type="button">Clear filters</button>}
      />
    )
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute(
      'aria-hidden',
      'true'
    )
    expect(
      screen.getByRole('button', { name: 'Clear filters' })
    ).toBeInTheDocument()
  })

  it('omits the optional parts when not given', () => {
    const { container } = render(<EmptyState title="Empty" />)
    expect(container.querySelector('[aria-hidden]')).toBeNull()
    expect(container.querySelectorAll('p')).toHaveLength(0)
  })
})
