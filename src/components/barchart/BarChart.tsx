import * as React from 'react'
import ReactDOMServer from 'react-dom/server'
import { ResponsiveBar } from '@nivo/bar'
import { Card } from '../card'
import { Table } from 'antd'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

type Props = {
  library: 'nivo' | 'highcharts'
}

const BarChart = ({ library }: Props) => {
  switch (library) {
    case 'nivo':
      return <NivoBarChart />
    case 'highcharts':
      return <HighchartsBarChart />
    default:
      return null
  }
}

const HighchartsBarChart = () => {
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

  console.log(data.map((item) => item.plan))

  const options: Highcharts.Options = {
    chart: {
      type: 'column',
    },
    xAxis: {
      categories: data.map((item) => item.plan),
      title: {
        text: 'Network Plan',
        style: {
          fontSize: '14px',
          fontFamily: 'Rubik',
          color: '#20201B',
        },
      },
      labels: {
        y: 30,
        style: {
          fontSize: '14px',
          fontFamily: 'Rubik',
          color: '#20201B',
        },
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: 'Total Providers',
        style: {
          fontSize: '14px',
          fontFamily: 'Rubik',
          color: '#20201B',
        },
      },
      tickInterval: 10,
      labels: {
        format: '{value}%',
        style: {
          fontSize: '14px',
          fontFamily: 'Rubik',
          color: '#20201B',
        },
      },
    },
    tooltip: {
      useHTML: true, // Enable HTML rendering for the tooltip
      formatter: function () {
        const plan = this.x
        const providerShare = this.y as number
        const columns = [
          {
            title: 'Plan',
            dataIndex: 'plan',
            key: 'plan',
          },
          {
            title: 'Provider Share',
            dataIndex: 'providerShare',
            key: 'providerShare',
          },
        ]

        const data = [
          {
            key: '1',
            plan: plan,
            providerShare: `${providerShare.toFixed(2)}%`,
          },
        ]

        return ReactDOMServer.renderToString(
          <Card>
            <Table columns={columns} dataSource={data} pagination={false} />
          </Card>
        )
      },
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        type: 'column',
        name: 'Provider Share',
        data: data.map((item) => item.providerShare),
        color: '#253761',
        states: {
          hover: {
            color: '#5670AA',
          },
        },
      },
    ],
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}

const NivoBarChart = () => {
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
