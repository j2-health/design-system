// A port of Base UI's `render` prop: its `useRender` hook and `mergeProps`
// utility (https://base-ui.com/react/utils/use-render), adapted without the
// dependency and cut down to what this library uses. Base UI also maps state
// to data-* attributes and takes arrays of refs; neither is needed here.
//
// A component keeps its own element and props, and lets the app swap the
// element: pass an element to merge onto, or a function that receives the
// props (and the component's state) and returns the element. Unlike Base UI,
// a <button> that ends up with no `type` gets `type="button"`, so swapping
// an element in never makes a form submit button by accident.
//
// Base UI is distributed under the MIT License:
//
// Copyright (c) 2019 Material-UI SAS
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.
import {
  cloneElement,
  createElement,
  isValidElement,
  useCallback,
  version,
  type HTMLAttributes,
  type JSX,
  type ReactElement,
  type Ref,
  type RefCallback,
} from 'react'
import cx from 'classnames'

export type RenderProps = HTMLAttributes<HTMLElement> & {
  [key: string]: unknown
}

/**
 * Replaces a component's element. Pass an element to merge the component's
 * props onto, e.g. `<button />`, or a function that spreads them:
 * `(props, state) => <button {...props} onClick={…} />`.
 */
export type RenderProp<State> =
  | ReactElement
  | ((
      props: RenderProps & { ref: RefCallback<HTMLElement> },
      state: State
    ) => ReactElement)

/**
 * Merges prop objects left to right. Later props win, except that event
 * handlers all run (last first), classNames join and styles combine. An
 * `undefined` handler leaves an earlier one in place.
 */
export const mergeProps = (
  ...sources: (RenderProps | undefined)[]
): RenderProps => {
  const merged: RenderProps = {}
  for (const source of sources) {
    if (!source) continue
    for (const [key, value] of Object.entries(source)) {
      const existing = merged[key]
      if (/^on[A-Z]/.test(key) && value === undefined) {
        continue
      } else if (
        /^on[A-Z]/.test(key) &&
        typeof existing === 'function' &&
        typeof value === 'function'
      ) {
        merged[key] = (...args: unknown[]) => {
          value(...args)
          existing(...args)
        }
      } else if (key === 'className') {
        merged.className = cx(existing as string, value as string)
      } else if (key === 'style') {
        merged.style = { ...(existing as object), ...(value as object) }
      } else {
        merged[key] = value
      }
    }
  }
  return merged
}

/** Sets one ref. Returns a callback ref's cleanup, if it gave one. */
const setRef = <T>(ref: Ref<T> | undefined, value: T | null) => {
  if (typeof ref === 'function') return ref(value)
  if (ref) (ref as { current: T | null }).current = value
}

/**
 * One callback ref that feeds every ref given to it. When a callback ref
 * returns a cleanup (React 19), detaching runs it instead of passing null.
 */
const useMergedRefs = <T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> =>
  useCallback((value: T | null) => {
    const cleanups = refs.map((ref) => setRef(ref, value))
    if (!cleanups.some((cleanup) => typeof cleanup === 'function')) return
    return () =>
      cleanups.forEach((cleanup, index) =>
        typeof cleanup === 'function' ? cleanup() : setRef(refs[index], null)
      )
  }, refs)

const isReact19 = Number(version.split('.')[0]) >= 19

/**
 * The ref an element was created with: a prop in React 19, a field in 18.
 * Reading the field in 19 logs a deprecation warning, so branch on version.
 */
const elementRef = (element: ReactElement): Ref<HTMLElement> | undefined =>
  isReact19
    ? (element.props as { ref?: Ref<HTMLElement> }).ref
    : (element as unknown as { ref?: Ref<HTMLElement> }).ref

export const useRender = <State>({
  render,
  props,
  ref,
  state,
  defaultTagName = 'div',
}: {
  render?: RenderProp<State>
  /** The component's own props, already merged with what it was given. */
  props: RenderProps
  ref?: Ref<HTMLElement>
  /** Passed to a `render` function as its second argument. */
  state: State
  defaultTagName?: keyof JSX.IntrinsicElements
}): ReactElement => {
  const element = isValidElement(render) ? render : undefined
  const mergedRef = useMergedRefs(ref, element && elementRef(element))

  const rendered =
    typeof render === 'function'
      ? render({ ...props, ref: mergedRef }, state)
      : element
        ? cloneElement(element, {
            ...mergeProps(props, element.props as RenderProps),
            ref: mergedRef,
          } as RenderProps)
        : createElement(defaultTagName, { ...props, ref: mergedRef })
  return rendered.type === 'button' &&
    (rendered.props as RenderProps).type === undefined
    ? cloneElement(rendered, { type: 'button' } as RenderProps)
    : rendered
}
