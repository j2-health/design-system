import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '../../modal'
import { SwatchPicker, type SwatchPickerColor } from '../SwatchPicker'

const BASE = [
  '#4f86a8',
  '#c58940',
  '#8c5383',
  '#5b8a72',
  '#a34a63',
  '#2f8a8a',
  '#997b52',
  '#6d6d64',
]
const lighter = (hex: string) =>
  `#${[1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16))
    .map((c) => Math.round(c + (255 - c) * 0.45))
    .map((c) => c.toString(16).padStart(2, '0'))
    .join('')}`
const COLORS: SwatchPickerColor[] = [...BASE, ...BASE.map(lighter)].map(
  (hex) => ({ value: hex })
)

const renderPicker = ({
  value = '#364975',
  defaultValue,
  onChange = vi.fn(),
}: {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
} = {}) => {
  render(
    <SwatchPicker
      colors={COLORS}
      value={value}
      defaultValue={defaultValue}
      label="Area A"
      onChange={onChange}
    >
      <button type="button">Open</button>
    </SwatchPicker>
  )
  return onChange
}

// The test DOM never finishes antd's animations, so a closed popover stays in
// the page; read the open class antd puts on the control's wrapper.
const expectClosed = () =>
  expect(
    screen.getByRole('button', { name: 'Open' }).closest('.ant-popover-open')
  ).toBeNull()

const open = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Open' }))
  return screen.findByRole('radiogroup', { name: 'Color for Area A' })
}

describe('SwatchPicker', () => {
  it('offers the colors in order, each named', async () => {
    renderPicker()

    await open()
    const names = screen
      .getAllByRole('radio')
      .map((r) => r.getAttribute('aria-label'))

    expect(names).toEqual(COLORS.map((c) => c.value))
  })

  it('names a swatch by its label when it has one', async () => {
    render(
      <SwatchPicker
        variant="inline"
        colors={[{ value: 'categorical-1', color: 'red', label: 'Color 1' }]}
        value="categorical-1"
        label="Area A"
        onChange={vi.fn()}
      />
    )

    expect(screen.getByRole('radio', { name: 'Color 1' })).toBeChecked()
  })

  it('marks the current color as the checked one', async () => {
    renderPicker({ value: '#c58940' })

    await open()

    expect(screen.getByRole('radio', { name: '#c58940' })).toBeChecked()
    expect(screen.getAllByRole('radio', { checked: true })).toHaveLength(1)
  })

  it('moves focus with the arrow keys, eight to a row, and stays at the ends', async () => {
    renderPicker({ value: '#c58940' })
    await open()
    const radio = (name: string) => screen.getByRole('radio', { name })
    const focused = () => document.activeElement?.getAttribute('aria-label')
    const names = COLORS.map((c) => c.value)

    // Opens with the current color focused (the second one).
    await vi.waitFor(() => expect(radio('#c58940')).toHaveFocus())

    fireEvent.keyDown(radio('#c58940'), { key: 'ArrowRight' })
    expect(focused()).toBe(names[2])
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' })
    expect(focused()).toBe(names[10])
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowLeft' })
    expect(focused()).toBe(names[9])
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowUp' })
    expect(focused()).toBe(names[1])
    // Up from the first row stays put.
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowUp' })
    expect(focused()).toBe(names[1])
    // One tab stop for the whole grid.
    expect(
      screen.getAllByRole('radio').filter((r) => r.tabIndex === 0)
    ).toHaveLength(1)
  })

  it('picks the focused color with Enter, and closes', async () => {
    const onChange = renderPicker()
    await open()
    const first = screen.getByRole('radio', { name: BASE[0] })
    await vi.waitFor(() => expect(first).toHaveFocus())

    fireEvent.keyDown(first, { key: 'ArrowRight' })
    await userEvent.keyboard('{Enter}')

    expect(onChange).toHaveBeenCalledExactlyOnceWith(BASE[1])
    expectClosed()
  })

  it('picks a clicked color and closes', async () => {
    const onChange = renderPicker()
    await open()

    await userEvent.click(screen.getByRole('radio', { name: BASE[3] }))

    expect(onChange).toHaveBeenCalledExactlyOnceWith(BASE[3])
    expectClosed()
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus()
  })

  it('offers Reset to default only once the color differs from the default', async () => {
    renderPicker({ value: '#364975', defaultValue: '#364975' })
    await open()
    expect(
      screen.queryByRole('button', { name: 'Reset to default' })
    ).not.toBeInTheDocument()
  })

  it('resets to the default and closes', async () => {
    const onChange = renderPicker({
      value: BASE[2],
      defaultValue: '#364975',
    })
    await open()

    await userEvent.click(
      screen.getByRole('button', { name: 'Reset to default' })
    )

    expect(onChange).toHaveBeenCalledExactlyOnceWith('#364975')
  })

  it('draws each color with 2px corners', async () => {
    renderPicker()
    await open()

    const swatch = screen.getByRole('radio', { name: BASE[0] })
      .firstElementChild as HTMLElement
    expect(swatch.style.background).toBe(BASE[0])
    expect(swatch.style.borderRadius).toBe('2px')
  })

  describe('onOpenChange', () => {
    const renderReporting = () => {
      const onOpenChange = vi.fn()
      render(
        <SwatchPicker
          colors={COLORS}
          value={BASE[0]}
          label="Area A"
          onChange={vi.fn()}
          onOpenChange={onOpenChange}
        >
          <button type="button">Open</button>
        </SwatchPicker>
      )
      return onOpenChange
    }

    it('reports the open, then the close on a pick', async () => {
      const onOpenChange = renderReporting()

      await open()
      expect(onOpenChange.mock.calls).toEqual([[true]])

      await userEvent.click(screen.getByRole('radio', { name: BASE[2] }))
      expect(onOpenChange.mock.calls).toEqual([[true], [false]])
    })

    it('reports the close on Escape', async () => {
      const onOpenChange = renderReporting()
      await open()
      await vi.waitFor(() =>
        expect(screen.getByRole('radio', { name: BASE[0] })).toHaveFocus()
      )

      await userEvent.keyboard('{Escape}')

      expectClosed()
      expect(onOpenChange.mock.calls).toEqual([[true], [false]])
    })
  })

  it('offers no Reset without a default', async () => {
    renderPicker({ value: BASE[2] })
    await open()
    expect(
      screen.queryByRole('button', { name: 'Reset to default' })
    ).not.toBeInTheDocument()
  })

  describe('inline', () => {
    const Inline = ({ onChange }: { onChange: (value: string) => void }) => {
      const [value, setValue] = useState(BASE[0])
      return (
        <SwatchPicker
          variant="inline"
          colors={COLORS.slice(0, 8)}
          value={value}
          label="Area A"
          onChange={(next) => {
            setValue(next)
            onChange(next)
          }}
        />
      )
    }

    it('draws 20px swatches, against 24px in the popover', async () => {
      const swatch = () =>
        screen.getByRole('radio', { name: BASE[0] })
          .firstElementChild as HTMLElement
      const { unmount } = render(<Inline onChange={vi.fn()} />)
      expect(swatch().style.width).toBe('20px')
      unmount()

      renderPicker()
      await open()
      expect(swatch().style.width).toBe('24px')
    })

    it('shows the grid in place, without taking focus', () => {
      render(<Inline onChange={vi.fn()} />)

      expect(
        screen.getByRole('radiogroup', { name: 'Color for Area A' })
      ).toBeInTheDocument()
      expect(screen.getAllByRole('radio')).toHaveLength(8)
      expect(document.activeElement).toBe(document.body)
    })

    it('picks a clicked color and stays shown', async () => {
      const onChange = vi.fn()
      render(<Inline onChange={onChange} />)

      await userEvent.click(screen.getByRole('radio', { name: BASE[4] }))

      expect(onChange).toHaveBeenCalledExactlyOnceWith(BASE[4])
      expect(screen.getByRole('radio', { name: BASE[4] })).toBeChecked()
    })

    it('moves on from a clicked color with the arrow keys', async () => {
      render(<Inline onChange={vi.fn()} />)

      await userEvent.click(screen.getByRole('radio', { name: BASE[4] }))
      fireEvent.keyDown(screen.getByRole('radio', { name: BASE[4] }), {
        key: 'ArrowRight',
      })

      expect(screen.getByRole('radio', { name: BASE[5] })).toHaveFocus()
      expect(
        screen.getAllByRole('radio').filter((r) => r.tabIndex === 0)
      ).toEqual([screen.getByRole('radio', { name: BASE[5] })])
    })
  })

  describe('in a modal', () => {
    const InModal = ({ onCancel }: { onCancel: () => void }) => (
      <Modal open title="Items" onCancel={onCancel} footer={null}>
        <SwatchPicker
          colors={COLORS}
          value={BASE[0]}
          label="Area A"
          onChange={vi.fn()}
        >
          <button type="button">Open</button>
        </SwatchPicker>
      </Modal>
    )

    it("renders in the modal's container, where it takes clicks", async () => {
      render(<InModal onCancel={vi.fn()} />)

      const grid = await open()

      expect(grid.closest('.ant-modal-container')).not.toBeNull()
    })

    it('closes on Escape without closing the modal', async () => {
      const onCancel = vi.fn()
      render(<InModal onCancel={onCancel} />)
      await open()
      const first = screen.getByRole('radio', { name: BASE[0] })
      await vi.waitFor(() => expect(first).toHaveFocus())

      await userEvent.keyboard('{Escape}')

      expectClosed()
      expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus()
      expect(onCancel).not.toHaveBeenCalled()
    })
  })
})
