import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Controls,
  Description,
  Markdown,
  Primary,
  Stories,
  Title,
} from '@storybook/addon-docs/blocks'
import { Tag } from './Tag'
import { ChefHatIcon, TagIcon } from '@phosphor-icons/react'

const changelog = `
## Changelog

### Add \`size\` prop with \`small\` variant — 2026-04-20

**What:** Added \`size?: 'default' | 'small'\` prop to \`Tag\`. Default keeps
current Ant Design styling untouched. \`small\` applies a condensed variant:
10px font, 16px line height, 4px horizontal padding, 0 vertical padding, 6px
radius — all on design tokens.

**Why:** Consuming surfaces sometimes need a subtle inline label ("Optional",
"Beta", etc.) sitting next to body-weight text. The default Tag's padding and
12px font pull too much attention relative to the label it's qualifying, so
product teams were reaching for raw \`text-[10px]\` spans instead of the
component. The \`small\` size fills that gap.

**Breaking:** No. \`size\` defaults to \`default\` — existing call sites are
unaffected.

**Notes:** The status + size matrix is independent — all five \`status\` values
(\`default\`, \`error\`, \`success\`, \`warning\`, \`processing\`) respect the
\`small\` variant's geometry. If more sizes come up later, promote the class
naming to a size-scoped set rather than layering one-offs.
`

const meta = {
  title: 'Components/Tag',
  component: Tag,
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
  args: {
    status: 'default',
    showIcon: true,
  },
  argTypes: {
    status: {
      control: 'radio',
      options: ['default', 'error', 'success', 'warning', 'processing'],
    },
    size: {
      control: 'radio',
      options: ['default', 'small'],
    },
    showIcon: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Tag',
    status: 'default',
    showIcon: true,
  },
}

export const Small: Story = {
  args: {
    children: 'Optional',
    status: 'default',
    size: 'small',
  },
  argTypes: {
    showIcon: { table: { disable: true } },
    icon: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 14 }}>Page name</span>
      <Tag {...args} />
    </div>
  ),
}

export const SmallAllStatuses: Story = {
  name: 'Small — all statuses',
  argTypes: {
    showIcon: { table: { disable: true } },
    icon: { table: { disable: true } },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(['default', 'error', 'success', 'warning', 'processing'] as const).map(
        (status) => (
          <Tag key={status} status={status} size="small">
            {status}
          </Tag>
        )
      )}
    </div>
  ),
}

export const NoIcon: Story = {
  args: {
    children: 'Tag',
    status: 'default',
    showIcon: false,
  },
}

export const CustomIcon: Story = {
  args: {
    children: 'Look at me, I have a hat!',
    status: 'default',
    showIcon: true,
    icon: ChefHatIcon,
  },
}

export const InsideFlexContainer: Story = {
  args: {
    children: 'Tagged tag',
    status: 'default',
    showIcon: true,
    icon: TagIcon,
  },
  render: (args) => (
    <div style={{ display: 'flex' }}>
      <Tag {...args} />
    </div>
  ),
}
