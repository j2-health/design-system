import { theme } from 'antd'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import styles from './chart.module.css'
import { renderToString } from 'react-dom/server'
import accessibilityModule from 'highcharts/modules/accessibility'
import exportingModule from 'highcharts/modules/exporting'
import offlineExporting from 'highcharts/modules/offline-exporting'

type Series = {
  name?: string
  data: Highcharts.PointOptionsObject[] | number[]
  color?: string
  hoverColor?: string
}

type BarChartProps = {
  categories: string[]
  series: Series[]
  min: number
  max: number | undefined | null
  tickInterval: number | undefined
  tickFormat?: (value: number) => string
  xAxisTitle?: string
  yAxisTitle?: string
  tooltip: (
    category: string | number | undefined,
    value: number | null | undefined,
    seriesName: string | undefined
  ) => React.ReactNode
  chartRef?: React.RefObject<HighchartsReact.RefObject>
  exporting?: Highcharts.ExportingOptions
  maxBars?: number
  barsWidth?: number
}

const BarChart = ({
  categories,
  series,
  min,
  max,
  tickInterval,
  tickFormat,
  xAxisTitle,
  yAxisTitle,
  tooltip,
  exporting,
  chartRef,
  maxBars = 50,
  barsWidth = undefined,
}: BarChartProps) => {
  if (exporting) {
    exportingModule(Highcharts)
    offlineExporting(Highcharts)
  }
  accessibilityModule(Highcharts)

  const limitedCategories = categories.slice(0, maxBars)
  const limitedSeries = series.map((s) => ({
    ...s,
    data: s.data.slice(0, maxBars),
  }))

  const { token } = theme.useToken()

  const baseFont: Highcharts.CSSObject = {
    fontSize: `${token.fontSize}px`,
    fontFamily: token.fontFamily,
    color: token.colorText,
  }

  const options: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: {
      type: 'column',
    },
    plotOptions: {
      column: {
        borderRadius: '20%',
        ...(barsWidth !== undefined ? { pointWidth: barsWidth } : {}),
      },
    },
    exporting: {
      ...exporting,
      enabled: false,
      chartOptions: {
        ...exporting?.chartOptions,
        title: {
          align: 'left',
          text: exporting?.chartOptions?.title?.text,
          style: {
            fontSize: `${token.fontSize}px`,
            fontFamily: 'sans-serif',
            color: token.colorText,
            ...exporting?.chartOptions?.title?.style,
          },
        },
        series: limitedSeries.map((s) => ({
          type: 'column',
          color: s.color ? s.color : '#253761', // --j2-blue-9
        })),
        legend: exporting?.chartOptions?.legend || { enabled: false },
      },
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: limitedCategories,
      gridLineDashStyle: 'Dot',
      title: xAxisTitle
        ? {
            text: xAxisTitle,
            style: { ...baseFont, color: token.colorTextDescription },
          }
        : undefined,
      labels: {
        y: 30,
        style: baseFont,
      },
    },
    yAxis: {
      min: min,
      max: max,
      endOnTick: true,
      gridLineDashStyle: 'Dot',
      gridLineColor: '#DADAD2',
      title: yAxisTitle
        ? {
            text: yAxisTitle,
            style: { ...baseFont, color: token.colorTextDescription },
          }
        : undefined,
      tickInterval: tickInterval,
      labels: {
        formatter: tickFormat
          ? ({ value }) => tickFormat(value as number)
          : undefined,
        style: baseFont,
      },
    },
    legend: {
      enabled: false,
    },
    series: limitedSeries.map((s) => ({
      data: s.data,
      name: s.name,
      type: 'column',
      color: s.color || 'var(--j2-blue-11)',
      states: {
        hover: {
          color: s.hoverColor || token.colorPrimaryTextHover,
        },
      },
    })),
    tooltip: {
      useHTML: true,
      backgroundColor: 'transparent',
      shadow: false,
      padding: 0,
      formatter: function (this) {
        return renderToString(
          <div className={styles.tooltip}>
            {tooltip(this.x, this.y, this.series.name)}
          </div>
        )
      },
    },
  }

  return (
    <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
  )
}

export { BarChart }
