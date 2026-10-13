import { createRef, forwardRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { mergeProps, useRender, type RenderProp } from '../useRender'

const Part = forwardRef<
  HTMLElement,
  { render?: RenderProp<{ n: number }>; onClick?: () => void }
>(({ render, ...rest }, ref) =>
  useRender({
    render,
    ref,
    state: { n: 7 },
    defaultTagName: 'span',
    props: mergeProps(
      { className: 'own', 'aria-label': 'part', children: 'x' },
      rest
    ),
  })
)

describe('useRender', () => {
  it('renders the default tag with the ref', () => {
    const ref = createRef<HTMLElement>()
    render(<Part ref={ref} />)
    expect(ref.current?.tagName).toBe('SPAN')
    expect(screen.getByLabelText('part')).toHaveClass('own')
  })

  it('merges onto an element: both handlers run and both refs are set', () => {
    const outer = createRef<HTMLElement>()
    const inner = createRef<HTMLButtonElement>()
    const fromParent = vi.fn()
    const fromElement = vi.fn()
    render(
      <Part
        ref={outer}
        onClick={fromParent}
        render={<button ref={inner} className="app" onClick={fromElement} />}
      />
    )
    const button = screen.getByRole('button', { name: 'part' })
    expect(button).toHaveClass('own', 'app')
    expect(button).toHaveTextContent('x')
    fireEvent.click(button)
    expect(fromParent).toHaveBeenCalledOnce()
    expect(fromElement).toHaveBeenCalledOnce()
    expect(outer.current).toBe(button)
    expect(inner.current).toBe(button)
  })

  it("runs a callback ref's cleanup instead of passing it null", () => {
    const cleanup = vi.fn()
    const callback = vi.fn(() => cleanup)
    const { unmount } = render(<Part render={<button ref={callback} />} />)
    expect(callback).toHaveBeenCalledWith(screen.getByRole('button'))
    unmount()
    expect(cleanup).toHaveBeenCalledOnce()
    expect(callback).not.toHaveBeenCalledWith(null)
  })

  it('hands a render function the props, the ref and the state', () => {
    const outer = createRef<HTMLElement>()
    render(
      <Part
        ref={outer}
        render={(props, { n }) => <button {...props} data-n={n} />}
      />
    )
    const button = screen.getByRole('button', { name: 'part' })
    expect(button).toHaveAttribute('data-n', '7')
    expect(outer.current).toBe(button)
  })
})

describe('useRender with a button', () => {
  it('gives one passed as an element type="button"', () => {
    render(<Part render={<button />} />)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('gives one returned by a function type="button"', () => {
    render(<Part render={(props) => <button {...props} />} />)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('keeps a type the app set', () => {
    render(<Part render={<button type="submit" />} />)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('gives other elements no type', () => {
    render(<Part render={<a />} />)
    expect(screen.getByLabelText('part')).not.toHaveAttribute('type')
  })
})

describe('mergeProps', () => {
  it('lets later props win, runs every handler and joins classes and styles', () => {
    const calls: string[] = []
    const merged = mergeProps(
      {
        id: 'a',
        className: 'one',
        style: { color: 'red', margin: 1 },
        onClick: () => calls.push('first'),
      },
      {
        id: 'b',
        className: 'two',
        style: { color: 'blue' },
        onClick: () => calls.push('second'),
      }
    )
    expect(merged.id).toBe('b')
    expect(merged.className).toBe('one two')
    expect(merged.style).toEqual({ color: 'blue', margin: 1 })
    ;(merged.onClick as () => void)()
    expect(calls).toEqual(['second', 'first'])
  })

  it('keeps an earlier handler when a later one is undefined', () => {
    const onClick = vi.fn()
    const merged = mergeProps({ onClick }, { onClick: undefined })
    ;(merged.onClick as () => void)()
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('composes refs, so a render function can add its own', () => {
    const outer = createRef<HTMLElement>()
    const own = createRef<HTMLButtonElement>()
    render(
      <Part
        ref={outer}
        render={(props) => <button {...mergeProps(props, { ref: own })} />}
      />
    )
    const button = screen.getByRole('button')
    expect(outer.current).toBe(button)
    expect(own.current).toBe(button)
  })

  it("runs a composed callback ref's cleanup and clears the others", () => {
    const object = createRef<HTMLElement>()
    const cleanup = vi.fn()
    const merged = mergeProps({ ref: object }, { ref: () => cleanup })
    const node = document.createElement('span')
    const detach = (merged.ref as (node: HTMLElement) => () => void)(node)
    expect(object.current).toBe(node)
    detach()
    expect(cleanup).toHaveBeenCalledOnce()
    expect(object.current).toBeNull()
  })

  it('keeps an earlier ref when a later one is undefined', () => {
    const ref = createRef<HTMLElement>()
    expect(mergeProps({ ref }, { ref: undefined }).ref).toBe(ref)
  })
})
