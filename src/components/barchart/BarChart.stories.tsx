import type { Meta, StoryObj } from '@storybook/react'

import { BarChart } from './BarChart'
import { Card } from '../card'

const meta = {
  title: 'Components/BarChart',
  component: BarChart,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: '450px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BarChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    xKey: 'plan',
    yKey: 'providerShare',
    yLabel: 'Total Providers',
    xLabel: 'Network Plan',
    minValue: 0,
    maxValue: 100,
    margin: { top: 50, bottom: 120, left: 72 },
    yAxisConfig: {
      format: (value) => `${value}%`,
    },
    data: [
      {
        plan: 'SCAN-HMO-01',
        providerShare: 0.0789 * 100,
        totalProviders: 10000,
      },
      {
        plan: 'SCAN-HMO-02',
        providerShare: 0.1234 * 100,
        totalProviders: 10000,
      },
      {
        plan: 'UHC-HMO-05',
        providerShare: 0.1588 * 100,
        totalProviders: 10000,
      },
    ],
    onClick: (node) => {
      alert(`Clicked on ${node.data.plan}`)
    },
    tooltip: (node) => {
      return (
        <Card>
          <div>
            <p>
              <strong>Plan:</strong> {node.data.plan}
            </p>
            <p>
              <strong>Provider Share:</strong> {node.data.providerShare}%
            </p>
            <p>
              <strong>Total Providers:</strong> {node.data.totalProviders}
            </p>
          </div>
        </Card>
      )
    },
  },
}
