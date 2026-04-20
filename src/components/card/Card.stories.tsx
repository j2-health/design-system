import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Controls,
  Description,
  Markdown,
  Primary,
  Stories,
  Title,
} from '@storybook/addon-docs/blocks'

import { Card } from './Card'

const changelog = `
## Changelog

### Soften hover shadow + keep border on hover — 2026-04-20

**What:** Overrode Ant Design's default \`hoverable\` styling on \`.j2-card\`:

- Box-shadow lowered to \`var(--j2-box-shadow-tertiary)\` (the lightest level in
  the Ant/Figma shadow scale — designed for panels and forms).
- Border color pinned to \`var(--j2-color-border)\` on hover (Ant's default drops
  it to \`transparent\`).

**Why:** Ant's stock hover lift is a three-layer shadow tuned for a more
material UI. Next to j2's flatter visual language (thin borders, subtle fills)
it read as too severe — especially when multiple hoverable cards sit near each
other, or when a card is already distinguished by a selected border. Dropping
the border on hover additionally made the card appear to collapse/shift.

**Breaking:** No. The shadow still appears on hover for every \`hoverable\` Card —
just at lower intensity, and the border now holds steady. No API change.

**Notes:** If a specific surface later needs a stronger hover lift, prefer adding
an opt-in prop over rolling the global value back up.
`

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Markdown>{changelog}</Markdown>
        </>
      ),
    },
  },
  argTypes: {
    bordered: {
      control: {
        type: 'boolean',
      },
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'small', 'large'],
    },
    innerVariant: {
      control: 'inline-radio',
      options: ['default', 'basic'],
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Network Performance Overview',
    children:
      'Optimizing your provider network might not be thrilling, but hey, it saves money and boosts care quality. Worth it, right?',
    size: 'default',
  },
}
export const WithTabs: Story = {
  args: {
    ...Default.args,
    size: 'default',
    tabList: [
      {
        key: 'optimization_tips',
        tab: 'Optimization Tips',
      },
      {
        key: 'performance_comparison',
        tab: 'Performance Comparison',
      },
    ],
  },
}

export const Borderless: Story = {
  args: {
    ...Default.args,
    bordered: false,
    size: 'default',
  },
}

export const Inner: Story = {
  args: {
    ...Default.args,
    type: 'inner',
    title: 'Innie',
    children: <p>I'm an innie</p>,
    size: 'default',
  },
  render: (args) => {
    return (
      <Card title="Outie">
        <div className="flex flex-col gap-3">
          <Card {...args} title="Inner Default" />
          <Card {...args} title="Inner Basic" innerVariant="basic">
            <p>I'm an inner card with basic variant</p>
          </Card>
          <Card
            {...args}
            size="small"
            title="Small Inner Basic"
            innerVariant="basic"
          >
            <p>I'm a small inner card with basic variant</p>
          </Card>
        </div>
      </Card>
    )
  },
}

export const Small: Story = {
  args: {
    ...Default.args,
    size: 'small',
  },
}

export const SmallWithTabs: Story = {
  args: {
    ...Default.args,
    size: 'small',
    tabList: [
      {
        key: 'optimization_tips',
        tab: 'Optimization Tips',
      },
    ],
  },
}

export const Large: Story = {
  args: {
    ...Default.args,
    size: 'large',
  },
}

export const LargeWithTabs: Story = {
  args: {
    ...Default.args,
    size: 'large',
    tabList: [
      {
        key: 'optimization_tips',
        tab: 'Optimization Tips',
      },
    ],
  },
}
