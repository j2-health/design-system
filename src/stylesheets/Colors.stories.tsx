import type { Meta, StoryObj } from '@storybook/react-vite'

const Swatch = ({ token }: { token: string }) => (
  <div className="flex flex-col gap-1" style={{ width: 96 }}>
    <div
      className="rounded-j2-sm border border-j2-border-secondary"
      style={{ height: 40, background: `var(${token})` }}
    />
    <code className="text-j2-xs text-j2-text-secondary">
      {token.replace('--j2-color-', '').replace('--j2-', '')}
    </code>
  </div>
)

const Row = ({ title, tokens }: { title: string; tokens: string[] }) => (
  <section className="flex flex-col gap-2">
    <h5 className="m-0">{title}</h5>
    <div className="flex flex-wrap gap-3">
      {tokens.map((token) => (
        <Swatch key={token} token={token} />
      ))}
    </div>
  </section>
)

const Group = ({
  title,
  intro,
  children,
}: {
  title: string
  intro?: React.ReactNode
  children: React.ReactNode
}) => (
  <section className="flex flex-col gap-4">
    <h3 className="m-0">{title}</h3>
    {intro && <p className="m-0 text-sm text-j2-text-secondary">{intro}</p>}
    {children}
  </section>
)

const range = (count: number) => Array.from({ length: count }, (_, i) => i + 1)
const capitalize = (word: string) => word[0].toUpperCase() + word.slice(1)

const SCALES = ['blue', 'gray', 'green', 'gold', 'red']
const STATUSES = ['primary', 'success', 'warning', 'error', 'info']
const STATUS_STEPS = ['', '-bg', '-bg-hover', '-border', '-hover', '-text']

const ColorsPage = () => (
  <div className="flex max-w-5xl flex-col gap-10 p-6">
    <Group
      title="Scales"
      intro={
        <>
          The base palette, 1 (lightest) to 12 (darkest). Reach for a semantic
          token first; use a scale step directly only when no semantic token
          fits. Tailwind: <code>bg-j2-blue-9</code>.
        </>
      }
    >
      {SCALES.map((scale) => (
        <Row
          key={scale}
          title={capitalize(scale)}
          tokens={range(12).map((step) => `--j2-${scale}-${step}`)}
        />
      ))}
    </Group>

    <Group
      title="Semantic"
      intro="What a color means in the interface. Each status has its fill, background, border, hover and text steps."
    >
      {STATUSES.map((status) => (
        <Row
          key={status}
          title={capitalize(status)}
          tokens={STATUS_STEPS.map((step) => `--j2-color-${status}${step}`)}
        />
      ))}
      <Row
        title="Text"
        tokens={[
          '--j2-color-text',
          '--j2-color-text-secondary',
          '--j2-color-text-quaternary',
          '--j2-color-text-disabled',
        ]}
      />
      <Row
        title="Surfaces and borders"
        tokens={[
          '--j2-color-bg-layout',
          '--j2-color-bg-elevated',
          '--j2-color-border',
          '--j2-color-border-secondary',
        ]}
      />
    </Group>

    <Group
      title="Data visualization"
      intro={
        <>
          Colors for charts, maps and legends. None carries meaning on its own:
          the consuming app decides what each one stands for. Tailwind classes
          use the same names, e.g. <code>bg-j2-interval-5-3</code>.
        </>
      }
    >
      <p className="m-0 text-sm text-j2-text-secondary">
        <code>interval-{'{n}-{k}'}</code> is step k of an orange ramp cut into n
        classes. Use the family that matches the number of classes.
      </p>
      {range(7).map((n) => (
        <Row
          key={n}
          title={`Sequential, ${n} ${n === 1 ? 'class' : 'classes'}`}
          tokens={range(n).map((k) => `--j2-color-interval-${n}-${k}`)}
        />
      ))}
      {['orange', 'blue', 'green'].map((name) => (
        <Row
          key={name}
          title={`Sequential, five classes: ${name}`}
          tokens={range(5).map((k) => `--j2-color-ramp-${name}-${k}`)}
        />
      ))}
      <Row
        title="Binary: green / red"
        tokens={['--j2-color-binary-positive', '--j2-color-binary-negative']}
      />
      <Row
        title="Binary: blue / orange"
        tokens={[
          '--j2-color-binary-alt-positive',
          '--j2-color-binary-alt-negative',
        ]}
      />
      <Row
        title="Categorical"
        tokens={[
          ...range(8).map((k) => `--j2-color-categorical-${k}`),
          '--j2-color-categorical-other',
        ]}
      />
    </Group>
  </div>
)

const meta = {
  title: 'Foundations/Colors',
  component: ColorsPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ColorsPage>

// eslint-disable-next-line no-restricted-exports
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
