import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BareButton } from '../../bareButton'
import { SwatchStrip } from '../SwatchStrip'

const items = (n: number, prefix: string) =>
  Array.from({ length: n }, (_, i) => ({
    key: `${prefix}${i}`,
    label: `${prefix} ${i + 1}`,
    swatch: { color: 'red' },
  }))

describe('SwatchStrip', () => {
  it('caps each group at max and shows the overflow', () => {
    render(
      <SwatchStrip max={3} groups={[{ key: 'a', items: items(5, 'A') }]} />
    )
    expect(screen.getAllByRole('img')).toHaveLength(3)
    expect(screen.getByText('+2')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'A 1' })).toBeInTheDocument()
  })

  it('divides groups and skips empty ones', () => {
    const { container } = render(
      <SwatchStrip
        groups={[
          { key: 'a', items: items(1, 'A') },
          { key: 'empty', items: [] },
          { key: 'b', items: items(1, 'B') },
        ]}
      />
    )
    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(1)
    expect(screen.getAllByRole('img')).toHaveLength(2)
  })

  it('renders nothing with no items', () => {
    const { container } = render(<SwatchStrip groups={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('lets a group raise its own max', () => {
    render(
      <SwatchStrip
        max={2}
        groups={[
          { key: 'a', items: items(4, 'A'), max: Infinity },
          { key: 'b', items: items(4, 'B') },
        ]}
      />
    )
    expect(screen.getAllByRole('img', { name: /^A/ })).toHaveLength(4)
    expect(screen.getAllByRole('img', { name: /^B/ })).toHaveLength(2)
    expect(screen.getAllByText('+2')).toHaveLength(1)
  })

  it('renders items and the overflow as the elements the app asks for', () => {
    const onItem = vi.fn()
    const onOverflow = vi.fn()
    const onWrapper = vi.fn()
    render(
      <div onClick={onWrapper}>
        <SwatchStrip
          max={2}
          groups={[{ key: 'a', items: items(3, 'A') }]}
          renderItem={(props, { item, group }) => (
            <BareButton
              {...props}
              onClick={() => onItem(item.key, group.key)}
            />
          )}
          renderOverflow={(props, { group, count }) => (
            <BareButton
              {...props}
              aria-label={`${count} more`}
              onClick={(event) => {
                event.stopPropagation()
                onOverflow(group.key)
              }}
            />
          )}
        />
      </div>
    )
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'A 2' }))
    expect(onItem).toHaveBeenCalledWith('A1', 'a')
    expect(onWrapper).toHaveBeenCalledOnce()
    const more = screen.getByRole('button', { name: '1 more' })
    expect(more).toHaveTextContent('+1')
    fireEvent.click(more)
    expect(onOverflow).toHaveBeenCalledWith('a')
    expect(onWrapper).toHaveBeenCalledOnce()
  })

  it("takes overflow text from the element's children", () => {
    render(
      <SwatchStrip
        max={1}
        groups={[{ key: 'a', items: items(3, 'A') }]}
        renderOverflow={(props, { count }) => (
          <span {...props}>+{count} others</span>
        )}
      />
    )
    expect(screen.getByText('+2 others')).toBeInTheDocument()
  })

  it('centres each divider in the group gap and clips the root', () => {
    const { container } = render(
      <SwatchStrip
        groupGap={9}
        rowGap={6}
        groups={[
          { key: 'a', items: items(1, 'A') },
          { key: 'b', items: items(1, 'B') },
        ]}
      />
    )
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('flex-wrap', 'overflow-clip')
    expect(root.style.columnGap).toBe('9px')
    expect(root.style.rowGap).toBe('6px')
    expect(root.style.padding).toBe('4px')
    expect(root.style.margin).toBe('-4px')
    const divider = container.querySelector('[aria-hidden]') as HTMLElement
    expect(divider).toHaveClass('absolute')
    expect(divider.style.left).toBe('-5px')
    expect(divider.parentElement).toHaveClass('relative')
  })

  it('narrows the root inset so a wrapped divider stays clipped', () => {
    const { container } = render(
      <SwatchStrip
        groupGap={5}
        groups={[
          { key: 'a', items: items(1, 'A') },
          { key: 'b', items: items(1, 'B') },
        ]}
      />
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.style.padding).toBe('2px')
    expect(
      (container.querySelector('[aria-hidden]') as HTMLElement).style.left
    ).toBe('-3px')
  })

  describe('tooltip and label', () => {
    const swatch = { color: 'red' }

    it('shows the label as the tooltip by default', async () => {
      render(
        <SwatchStrip
          groups={[{ key: 'a', items: [{ key: 'a', label: 'One', swatch }] }]}
        />
      )
      await userEvent.hover(screen.getByRole('img', { name: 'One' }))
      expect(await screen.findByRole('tooltip')).toHaveTextContent('One')
    })

    it('names the item after a string tooltip when it has no label', async () => {
      render(
        <SwatchStrip
          groups={[{ key: 'a', items: [{ key: 'a', tooltip: 'Two', swatch }] }]}
        />
      )
      await userEvent.hover(screen.getByRole('img', { name: 'Two' }))
      expect(await screen.findByRole('tooltip')).toHaveTextContent('Two')
    })

    it('renders no tooltip for `tooltip: false` but keeps the name', () => {
      const { container } = render(
        <SwatchStrip
          groups={[
            {
              key: 'a',
              items: [{ key: 'a', label: 'Three', tooltip: false, swatch }],
            },
          ]}
        />
      )
      const item = screen.getByRole('img', { name: 'Three' })
      // With a tooltip, the item sits in the tooltip's wrapper div.
      expect(item.parentElement).toBe(container.querySelector('.relative'))
    })

    it('keeps a label and a different tooltip apart', async () => {
      render(
        <SwatchStrip
          groups={[
            {
              key: 'a',
              items: [
                { key: 'a', label: 'Four', tooltip: <b>Shown</b>, swatch },
              ],
            },
          ]}
        />
      )
      await userEvent.hover(screen.getByRole('img', { name: 'Four' }))
      const tooltip = await screen.findByRole('tooltip')
      expect(tooltip).toHaveTextContent('Shown')
      expect(tooltip).not.toHaveTextContent('Four')
    })
  })

  describe('overflow count', () => {
    it('shows a group overflow even when nothing is hidden', () => {
      render(
        <SwatchStrip
          groups={[{ key: 'a', items: items(2, 'A'), overflow: 7 }]}
        />
      )
      expect(screen.getAllByRole('img')).toHaveLength(2)
      expect(screen.getByText('+7')).toBeInTheDocument()
    })

    it('replaces the computed count and reaches renderOverflow', () => {
      render(
        <SwatchStrip
          max={2}
          groups={[{ key: 'a', items: items(5, 'A'), overflow: 9 }]}
          renderOverflow={(props, { count }) => (
            <span {...props} data-count={count} />
          )}
        />
      )
      expect(screen.getByText('+9')).toHaveAttribute('data-count', '9')
      expect(screen.queryByText('+3')).not.toBeInTheDocument()
    })

    it('hides the +N for `overflow: 0` even with items hidden', () => {
      render(
        <SwatchStrip
          max={2}
          groups={[{ key: 'a', items: items(5, 'A'), overflow: 0 }]}
        />
      )
      expect(screen.getAllByRole('img')).toHaveLength(2)
      expect(screen.queryByText(/^\+/)).not.toBeInTheDocument()
    })

    it('counts the hidden items when unset', () => {
      render(
        <SwatchStrip max={2} groups={[{ key: 'a', items: items(2, 'A') }]} />
      )
      expect(screen.queryByText(/^\+/)).not.toBeInTheDocument()
    })
  })
})
