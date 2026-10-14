import { vi } from 'vitest'
import { act, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Steps } from '../Steps'
import { useSteps } from '../useSteps'

const ITEMS = [{ title: 'First' }, { title: 'Second' }, { title: 'Third' }]

const activeStep = (container: HTMLElement) =>
  container.querySelector('.ant-steps-item-active')

describe('useSteps', () => {
  it('follows `current` without a setter', () => {
    const { result, rerender } = renderHook(
      ({ current }) => useSteps({ current, totalSteps: 3 }),
      { initialProps: { current: 1 } }
    )
    expect(result.current.current).toBe(1)

    rerender({ current: 2 })
    expect(result.current.current).toBe(2)
  })

  it('leaves a read-only position where the parent put it', () => {
    const { result } = renderHook(() => useSteps({ current: 0, totalSteps: 3 }))

    act(() => result.current.next())

    expect(result.current.current).toBe(0)
  })

  it('asks the parent to move when it owns the position', () => {
    const setCurrent = vi.fn()
    const { result } = renderHook(() =>
      useSteps({ current: 1, setCurrent, totalSteps: 3 })
    )

    act(() => result.current.next())

    expect(setCurrent).toHaveBeenCalledWith(2)
  })

  it('keeps its own position when no `current` is given', () => {
    const { result } = renderHook(() => useSteps({ totalSteps: 3 }))

    act(() => result.current.next())

    expect(result.current.current).toBe(1)
  })
})

describe('Steps', () => {
  it('shows the step it is given without a setter', () => {
    const { container } = render(<Steps items={ITEMS} current={1} />)

    expect(activeStep(container)).toHaveTextContent('Second')
  })

  it('cannot be clicked when read-only', async () => {
    const { container } = render(<Steps items={ITEMS} current={0} />)

    expect(screen.queryAllByRole('button')).toHaveLength(0)

    await userEvent.click(screen.getByText('Third'))
    expect(activeStep(container)).toHaveTextContent('First')
  })

  it('reports a clicked step when the parent owns the position', async () => {
    const setCurrent = vi.fn()
    render(<Steps items={ITEMS} current={0} setCurrent={setCurrent} />)

    await userEvent.click(screen.getByText('Third'))

    expect(setCurrent).toHaveBeenCalledWith(2)
  })

  it('moves on click when it keeps its own position', async () => {
    const { container } = render(<Steps items={ITEMS} />)

    await userEvent.click(screen.getByText('Third'))

    expect(activeStep(container)).toHaveTextContent('Third')
  })

  it('keeps its own styling alongside a caller class', () => {
    const { container } = render(
      <Steps items={ITEMS} className="caller-class" />
    )

    const bar = container.querySelector('.ant-steps')
    expect(bar).toHaveClass('j2Steps')
    expect(bar).toHaveClass('caller-class')
  })
})
