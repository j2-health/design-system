import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { theme } from 'antd'
import VennModule from 'highcharts/modules/venn'

type Props = {
  data: Highcharts.PointOptionsObject[]
  title?: string
}

export const VennDiagram = ({ data, title }: Props) => {
  VennModule(Highcharts)
  const { token } = theme.useToken()

  const baseFont: Highcharts.CSSObject = {
    fontSize: `${token.fontSize}px`,
    fontFamily: token.fontFamily,
    color: token.colorText,
    textOutline: 'none',
  }

  const options: Highcharts.Options = {
    title: {
      text: title,
    },
    series: [
      {
        type: 'venn',
        data,
        dataLabels: {
          style: baseFont,
        },
      },
    ],
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
