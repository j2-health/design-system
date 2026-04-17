import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button'
import { Tag } from '../tag'
import { SummarizedSelect } from '../select/SummarizedSelect'
import { PageHeader } from './PageHeader'

const description = `
A consistent top-level header for application pages. Displays a page title on the left and optional action buttons on the right.

## When to Use

- **Top-level page headers** — one per page, at the top of the content area
- **String titles** for pages with a static name (e.g. "Reports", "Networks", "Settings")
- **Custom title nodes** for pages where the title doubles as navigation (e.g. a network selector on pages where content is specific to a single network)

## When Not to Use

- **Section headers within a page** — use \`CardHeader\` or a plain heading instead
- **Modal or drawer titles** — use the title prop on those components directly
- **Nested sub-navigation** — PageHeader is for the primary page identity, not secondary nav bars

## Title Variants

### String Title
Pass a string to \`pageTitle\` for standard pages. It renders as an \`<h1>\` at 30px.
Use this for global or administrative pages (e.g. Settings, Networks list, Reports) where content is not network-specific.

### Network Selector Title
For pages where content is scoped to a single network (e.g. Scores, Scorecard, Details), pass a \`SummarizedSelect\` as the title.
This lets users switch networks without leaving the page.

Use a network selector title when:
- The page content is scoped to a single network
- Users need to switch between networks frequently

Use a string title when:
- The page is global or administrative
- The page content is not network-specific
`

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: { component: description },
    },
  },
  argTypes: {
    pageTitle: { control: 'text' },
    bordered: { control: 'boolean' },
    actions: { table: { disable: true } },
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

type StoryArgs = Story['args'] & Record<string, unknown>

export const Default: Story = {
  args: {
    pageTitle: 'Explore',
    bordered: true,
  },
}

export const WithActions: Story = {
  argTypes: {
    showSecondaryAction: { control: 'boolean', name: 'Secondary Action' },
    showPrimaryAction: { control: 'boolean', name: 'Primary Action' },
  } as Meta['argTypes'],
  args: {
    pageTitle: 'Networks',
    bordered: true,
    showSecondaryAction: true,
    showPrimaryAction: true,
  } as StoryArgs,
  render: (args) => {
    const { showSecondaryAction, showPrimaryAction, ...rest } =
      args as StoryArgs
    return (
      <PageHeader
        {...rest}
        actions={
          <>
            {showSecondaryAction && (
              <Button shape="round">Archived Networks</Button>
            )}
            {showPrimaryAction && (
              <Button type="primary" shape="round">
                + Create Network
              </Button>
            )}
          </>
        }
      />
    )
  },
}

export const NoBorder: Story = {
  argTypes: {
    showPrimaryAction: { control: 'boolean', name: 'Primary Action' },
  } as Meta['argTypes'],
  args: {
    pageTitle: 'Reports',
    bordered: false,
    showPrimaryAction: true,
  } as StoryArgs,
  render: (args) => {
    const { showPrimaryAction, ...rest } = args as StoryArgs
    return (
      <PageHeader
        {...rest}
        actions={
          showPrimaryAction ? (
            <Button type="primary" shape="round">
              + Report
            </Button>
          ) : undefined
        }
      />
    )
  },
}

export const NetworkSelectTitle: Story = {
  argTypes: {
    showMetadata: { control: 'boolean', name: 'Metadata' },
    showTag: { control: 'boolean', name: 'Tag' },
  } as Meta['argTypes'],
  args: {
    pageTitle: '',
    bordered: true,
    showMetadata: true,
    showTag: true,
  } as StoryArgs,
  render: (args) => {
    const { showMetadata, showTag, ...rest } = args as StoryArgs
    return (
      <PageHeader
        {...rest}
        pageTitle={
          <SummarizedSelect
            variant="headlined"
            popupMatchSelectWidth
            searchPlaceholder="Search networks..."
            options={[
              { label: 'IN Demo', value: '1' },
              { label: 'FL Dental Network', value: '2' },
              { label: 'NC Expansion', value: '3' },
            ]}
            value="1"
            onChange={() => {}}
          />
        }
        actions={
          <>
            {showMetadata && (
              <>
                <span
                  style={{ color: '#666', fontSize: 14, whiteSpace: 'nowrap' }}
                >
                  Last Updated: Mar 25, 2026
                </span>
                <span
                  style={{ color: '#666', fontSize: 14, whiteSpace: 'nowrap' }}
                >
                  Updated by: J2 Admin
                </span>
              </>
            )}
            {showTag && <Tag status="default">Health Service Delivery</Tag>}
          </>
        }
      />
    )
  },
}
