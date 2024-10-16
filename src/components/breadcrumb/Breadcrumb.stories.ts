import type { Meta, StoryObj } from '@storybook/react'

import { Breadcrumb } from './Breadcrumb'

const meta = {
    title: 'Components/Breadcrumb',
    component: Breadcrumb,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        items: [{ title: 'Home', href: '#' }, { title: 'Compare', href: '#' }],
    },
}
