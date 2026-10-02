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

### Add \`variant="solid"\` styling and a \`color\` override — 2026-10-02

**What:** \`variant="solid"\` (antd 6's filled tag) now renders white, bold
text. New optional \`color\` and \`borderColor\` props take any CSS color:
\`color\` overrides the status color, so a badge can use a token outside the
status set (e.g. \`color="var(--j2-color-interval-7-5)"\`), and
\`borderColor\` gives it a different edge.

**Why:** Products were building filled score badges by stacking \`!bg-*\`,
\`!border-*\` and \`!text-white\` overrides on a default tag.

**Breaking:** No. \`color\` is optional and \`solid\` was unstyled before.

### Add \`size\` prop with \`small\` variant — 2026-04-20

**What:** Added \`size?: 'default' | 'small'\` prop to \`Tag\`. Default keeps
current Ant Design styling untouched. \`small\` applies a condensed variant
via Tailwind classes (\`!px-1 !py-0 !h-auto !text-j2-xs !rounded-j2-sm\`):
10px font, 16px line height, 4px horizontal padding, 0 vertical padding, 6px
radius. New \`text-j2-xs\` Tailwind token added to the config (pairs
\`--j2-font-size-xs\` with \`--j2-line-height-xs\`).

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
    variant: {
      control: 'radio',
      options: ['outlined', 'filled', 'solid'],
      description:
        '`solid` is a filled badge: white bold text on the status color, or on `color`.',
    },
    color: {
      control: 'text',
      description:
        'Any CSS color, overriding the status color. E.g. `var(--j2-color-interval-7-5)`.',
    },
    borderColor: {
      control: 'text',
      description: 'The border color, when it should differ from the fill.',
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

export const Solid: Story = {
  args: {
    children: 'Solid',
    status: 'processing',
    variant: 'solid',
    size: 'small',
  },
  argTypes: {
    showIcon: { table: { disable: true } },
    icon: { table: { disable: true } },
  },
}

// A pair of filled badges built only from props: a status color with a
// lighter edge, and a data-viz color with a darker one.
export const SolidBadges: Story = {
  name: 'Solid badges',
  argTypes: {
    showIcon: { table: { disable: true } },
    icon: { table: { disable: true } },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Tag
        status="processing"
        variant="solid"
        size="small"
        borderColor="var(--j2-color-primary-border)"
      >
        Met
      </Tag>
      <Tag
        status="default"
        variant="solid"
        size="small"
        color="var(--j2-color-interval-7-5)"
        borderColor="var(--j2-color-interval-7-7)"
      >
        Not met
      </Tag>
      <Tag status="success" variant="solid">
        Solid
      </Tag>
      <Tag status="error" variant="solid">
        Solid
      </Tag>
    </div>
  ),
}
