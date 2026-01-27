import type { Meta, StoryObj } from '@storybook/react-vite'

import { BarChart } from './BarChart'

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

const plans = [
  {
    plan: 'SCAN-HMO-01',
    providerShare: 0.0789,
    totalProviders: 10000,
  },
  {
    plan: 'SCAN-HMO-02',
    providerShare: 0.1234,
    totalProviders: 9000,
  },
  {
    plan: 'UHC-HMO-05',
    providerShare: 0.1588,
    totalProviders: 2000,
  },
]

export const Default: Story = {
  args: {
    categories: plans.map((plan) => plan.plan),
    series: [
      {
        name: 'series1',
        data: plans.map((plan) => plan.providerShare),
      },
    ],
    xAxisTitle: 'Plan',
    yAxisTitle: 'Provider Share',
    min: 0,
    max: 1,
    tickInterval: 0.1,
    tickFormat: (value) => `${value * 100}%`,
    tooltip: (category, value, seriesName) => {
      const plan = plans.find((p) => p.plan === category)

      if (!plan) return null

      return (
        <div className="flex flex-col gap-2">
          <div>
            <strong>{plan.plan}</strong>: {value}
          </div>
          <div>Total Providers: {plan.totalProviders}</div>
          <span>Series: {seriesName}</span>
        </div>
      )
    },
  },
}

export const MultipleSeries: Story = {
  args: {
    ...Default.args,
    series: [
      ...Default.args.series,
      {
        name: 'series2',
        data: plans.map((plan) => plan.providerShare * 2),
        color: 'green',
        hoverColor: 'pink',
      },
    ],
  },
}

export const NoMax: Story = {
  args: {
    ...Default.args,
    max: undefined,
    series: [
      {
        name: 'series1',
        data: plans.map((plan) => plan.totalProviders),
      },
    ],
    tickFormat: (value) => `${value}`,
    tickInterval: 1000,
  },
}
