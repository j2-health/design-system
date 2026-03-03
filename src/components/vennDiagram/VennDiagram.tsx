import type * as Highcharts from 'highcharts'
import { Chart as HighchartsReact } from '@highcharts/react'
import '@highcharts/react/series/Venn'
import '@highcharts/react/options/Accessibility'
import { theme } from 'antd'

type Props = {
  data: Highcharts.PointOptionsObject[]
  title?: string
  tooltip?: Highcharts.TooltipOptions
  onClick?: Highcharts.SeriesClickCallbackFunction
}

export const VennDiagram = ({ data, title, tooltip, onClick }: Props) => {
  const { token } = theme.useToken()

  const baseFont: Highcharts.CSSObject = {
    fontSize: `${token.fontSize}px`,
    fontFamily: token.fontFamily,
    color: token.colorText,
    textOutline: 'none',
    opacity: 1,
  }

  const options: Highcharts.Options = {
    title: {
      text: title,
    },
    ...(tooltip ? { tooltip } : {}),
    chart: {
      spacing: [36, 36, 36, 36],
    },
    series: [
      {
        type: 'venn',
        data,
        events: {
          click: onClick,
        },
        cursor: onClick ? 'pointer' : undefined,
        dataLabels: {
          style: baseFont,
        },
        states: {
          inactive: {
            opacity: 0.3,
          },
        },
      },
    ],
  }

  return <HighchartsReact options={options} />
}
