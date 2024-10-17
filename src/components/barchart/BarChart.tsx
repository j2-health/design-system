import * as React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { Card } from '../card'
import { Table } from 'antd'

const BarChart = () => {
  const [hoveredBar, setHoveredBar] = React.useState<string | null>(null)

  const data = [
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
  ]

  return (
    <ResponsiveBar
      data={data}
      minValue={0}
      maxValue={100}
      indexBy="plan"
      keys={['providerShare']}
      enableLabel={false}
      margin={{ top: 50, right: 60, bottom: 120, left: 72 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={(node) => {
        if (node.data.plan === hoveredBar) {
          return '#5670AA'
        }

        return '#253761'
      }}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: 12,
        tickRotation: -45,
        legend: 'Network Plan',
        legendPosition: 'middle',
        legendOffset: 100,
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Total Providers',
        legendPosition: 'middle',
        legendOffset: -60,
        truncateTickAt: 0,
        format: (value) => `${value}%`,
      }}
      theme={{
        text: {
          fontSize: 14,
          fontFamily: 'Rubik',
        },
        axis: {
          ticks: {
            text: {
              fontSize: 14,
            },
          },
          legend: {
            text: {
              fontSize: 14,
            },
          },
        },
      }}
      role="application"
      ariaLabel="Nivo bar chart demo"
      onMouseEnter={(node) => {
        setHoveredBar(node.data.plan)
      }}
      onMouseLeave={() => {
        setHoveredBar(null)
      }}
      tooltip={(node) => {
        const columns = [
          {
            title: 'Plan',
            dataIndex: 'plan',
            key: 'plan',
          },
          {
            title: 'Provider Breadth',
            dataIndex: 'providerShare',
            key: 'providerShare',
          },
        ]
        const data = [
          {
            key: '1',
            plan: node.data.plan,
            providerShare: `${node.data.providerShare.toFixed(2)}%`,
          },
        ]
        return (
          <Card>
            <Table columns={columns} dataSource={data} pagination={false} />
          </Card>
        )
      }}
    />
  )
}

export { BarChart }
