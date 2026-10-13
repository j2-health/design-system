import { forwardRef } from 'react'
import cx from 'classnames'

export type BareButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
>

/**
 * A button with no look of its own: its children supply every pixel. For
 * making a purely visual component clickable, e.g. as a `render` element:
 * `<SwatchStrip renderItem={(props) => <BareButton {...props} onClick={…} />} />`.
 * Adds only a pointer cursor and a focus ring; Tailwind's preflight already
 * resets the browser's button styles.
 *
 * The ring reads `--j2-focus-ring-width` (2px), `--j2-focus-ring-color` (the
 * primary color) and `--j2-focus-ring-offset` (0px, so a ring isn't covered by
 * a neighbour placed close by). Change it by setting them on the button or
 * any ancestor, with a class such as `[--j2-focus-ring-offset:2px]` or through
 * `style`. A competing `focus-visible:` class isn't reliable: the order of
 * rules in the generated CSS decides which one wins.
 */
export const BareButton = forwardRef<HTMLButtonElement, BareButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      {...props}
      ref={ref}
      type="button"
      className={cx(
        'cursor-pointer disabled:cursor-not-allowed focus-visible:[outline:var(--j2-focus-ring-width,2px)_solid_var(--j2-focus-ring-color,var(--j2-color-primary))] focus-visible:[outline-offset:var(--j2-focus-ring-offset,0px)]',
        className
      )}
    />
  )
)
BareButton.displayName = 'BareButton'
