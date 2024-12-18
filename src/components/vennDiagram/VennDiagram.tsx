import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { theme } from 'antd'
import VennModule from 'highcharts/modules/venn'
import accessability from 'highcharts/modules/accessibility'

type Props = {
  data: Highcharts.PointOptionsObject[]
  title?: string
  tooltip?: Highcharts.TooltipOptions
  onClick?: Highcharts.SeriesClickCallbackFunction
}

export const VennDiagram = ({ data, title, tooltip, onClick }: Props) => {
  VennModule(Highcharts)
  accessability(Highcharts)
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
    tooltip,
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

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
