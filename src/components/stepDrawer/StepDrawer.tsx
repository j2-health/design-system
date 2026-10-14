import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Button } from '../button'
import { Drawer } from '../drawer'
import { Steps } from '../steps'

type StepDrawerSlots = {
  primary: HTMLElement | null
  extra: HTMLElement | null
}

const SlotContext = createContext<StepDrawerSlots>({
  primary: null,
  extra: null,
})

/**
 * The footer's primary-action slot and the header's extra slot, for steps that
 * build their own buttons from state the drawer's parent cannot reach. Portal
 * into them with `createPortal`. A flow whose buttons are available where the
 * drawer is rendered passes `primaryAction` / `extraContent` instead.
 *
 * Use one or the other on a given step. The header slot only exists while
 * `extraContent` is empty, but the footer slot is always there, so a step that
 * portals its primary action needs the flow to pass no `primaryAction`.
 */
export const useStepDrawerSlots = () => useContext(SlotContext)

export type StepDrawerProps = {
  open: boolean
  onClose: () => void
  title: ReactNode
  /** One label per step, shown under its number in the step bar. */
  labels: string[]
  /** Zero-based index of the step on screen. The drawer never changes it. */
  current: number
  /**
   * Renders a Go back button in the footer. Omit it on a step with nowhere to
   * return to, which is usually the first. A flow whose first step does have
   * somewhere to return to passes a handler there too.
   */
  onBack?: () => void
  /** The footer's main button, such as Next or Submit. */
  primaryAction?: ReactNode
  /**
   * Content in the header, left of the close control. While it is empty
   * (any falsy value, such as the `false` from `cond && <X />`) the header
   * holds the extra slot instead.
   */
  extraContent?: ReactNode
  /**
   * Classes for the body around the step bar and content. Replaces the
   * default `h-full overflow-y-auto`, so a step that scrolls its own content
   * can pass `h-full` alone.
   */
  bodyClassName?: string
  destroyOnHidden?: boolean
  /**
   * Fires once the open or close animation has finished. A flow that resets
   * state on close wants this rather than `open`, which flips while the panel
   * is still on screen.
   */
  afterOpenChange?: (open: boolean) => void
  children: ReactNode
}

/**
 * A full-page multi-step drawer: bottom placement, a numbered step bar that
 * shows progress but cannot be clicked, and a right-aligned footer. Navigation
 * is footer-only. There is no Cancel button: leaving goes through `onClose`,
 * from the close control or Esc.
 *
 * The flow owns everything that gates a step. There is deliberately no
 * `canProceed` prop: whether the primary action is disabled, or clickable and
 * revealing errors, is up to the node passed as `primaryAction`.
 */
export function StepDrawer({
  open,
  onClose,
  title,
  labels,
  current,
  onBack,
  primaryAction,
  extraContent,
  bodyClassName = 'h-full overflow-y-auto',
  destroyOnHidden,
  afterOpenChange,
  children,
}: StepDrawerProps) {
  const [primarySlot, setPrimarySlot] = useState<HTMLDivElement | null>(null)
  const [extraSlot, setExtraSlot] = useState<HTMLDivElement | null>(null)
  const slots = useMemo(
    () => ({ primary: primarySlot, extra: extraSlot }),
    [primarySlot, extraSlot]
  )

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      placement="bottom"
      fillPage
      destroyOnHidden={destroyOnHidden}
      afterOpenChange={afterOpenChange}
      // Unlike the footer slot below, this one is either/or: the header sits in
      // an antd `Space`, which gives every child its own gap, so an unused slot
      // would push the close control across.
      extraContent={extraContent || <div ref={setExtraSlot} />}
      footer={
        <div className="flex w-full justify-end gap-2">
          {/* The group is right-anchored, so a missing Go back leaves the
              primary action where it was rather than shifting it. */}
          {onBack && (
            <Button size="large" onClick={onBack}>
              Go back
            </Button>
          )}
          {primaryAction}
          {/* `contents` keeps the empty slot out of the flex row, so a flow can
              pass `primaryAction` on some steps and portal into the slot on
              others without the unused one opening a gap. */}
          <div ref={setPrimarySlot} className="contents" />
        </div>
      }
    >
      <SlotContext.Provider value={slots}>
        <div className={bodyClassName}>
          <div className="flex w-full justify-center py-8">
            <div className="w-2/3 max-w-4xl">
              {/* `current` without `setCurrent` renders the bar read-only. */}
              <Steps
                items={labels.map((label, index) => ({
                  title: index + 1,
                  description: label,
                }))}
                dot
                current={current}
              />
            </div>
          </div>
          {children}
        </div>
      </SlotContext.Provider>
    </Drawer>
  )
}
