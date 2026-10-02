import type { Meta, StoryObj } from '@storybook/react-vite'

const TypographyExample = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
    </div>
  )
}

const meta = {
  title: 'Typography',
  component: TypographyExample,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TypographyExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const CaptionsExample = () => (
  <div className="flex w-[28rem] flex-col gap-6">
    <section className="flex flex-col gap-2">
      <span className="j2-caption">Caption · 12px</span>
      <p className="m-0 text-sm">
        <code>j2-caption</code> names a section of page or panel chrome: a
        toolbar band, a group of fields, a list header.
      </p>
    </section>
    <section className="flex flex-col gap-2 rounded-j2 border border-j2-border-secondary p-3">
      <span className="j2-caption-xs">Caption xs · 10px</span>
      <p className="m-0 text-j2-xs">
        <code>j2-caption-xs</code> sits inside dense content: a compact card, a
        chart key, an inline popover.
      </p>
    </section>
    <section className="flex flex-col gap-2">
      <span className="j2-caption text-j2-primary">Override</span>
      <p className="m-0 text-sm">
        Utilities still win, so <code>j2-caption text-j2-primary</code> keeps
        the style and changes the color.
      </p>
    </section>
  </div>
)

export const Captions: Story = {
  render: () => <CaptionsExample />,
}
