import * as React from 'react'
import {
  BarDatum,
  BarTooltipProps,
  ComputedDatum,
  ResponsiveBar,
  ResponsiveBarSvgProps,
} from '@nivo/bar'
import { AxisProps, AxisLegendPosition } from '@nivo/axes'
import { appTheme } from '../../appTheme'
import { Margin } from '@nivo/core'

export type Props<D> = ResponsiveBarSvgProps<D & BarDatum> & {
  data: D[]
  xKey: keyof D
  yKey: keyof D
  xLabel?: string
  yLabel?: string
  xAxisConfig?: Partial<AxisProps>
  yAxisConfig?: Partial<AxisProps>
  margin: Partial<Margin>
  tooltip?: React.FunctionComponent<BarTooltipProps<D>>
  onClick?: (node: ComputedDatum<D>) => void
}

// https://nivo.rocks/bar/
const BarChart = <D extends BarDatum>({
  data,
  xKey,
  yKey,
  yLabel,
  xLabel,
  xAxisConfig,
  yAxisConfig,
  ...props
}: Props<D>) => {
  const [hoverBar, setHoverBar] = React.useState<string | number | null>(null)

  const axisBottom: AxisProps = React.useMemo(() => {
    const base = {
      tickSize: 0,
      tickPadding: appTheme.token?.paddingSM,
      tickRotation: 0,
      legend: xLabel,
      legendPosition: 'middle' as AxisLegendPosition,
      legendOffset: appTheme.token?.marginXXL,
      truncateTickAt: 0,
    }

    return { ...base, ...xAxisConfig }
  }, [xAxisConfig, xLabel])

  const axisLeft: AxisProps = React.useMemo(() => {
    const base = {
      legend: yLabel,
      tickSize: 0,
      tickPadding: appTheme.token?.paddingXXS,
      tickRotation: 0,
      legendPosition: 'middle' as AxisLegendPosition,
      legendOffset: -60,
      truncateTickAt: 0,
    }

    return { ...base, ...yAxisConfig }
  }, [yAxisConfig, yLabel])

  const colors = React.useCallback(
    (node: ComputedDatum<D>) => {
      if (hoverBar && hoverBar == node.data[xKey]) {
        return appTheme.token?.colorPrimaryTextHover || ''
      }

      return appTheme.token?.colorPrimary || ''
    },
    [hoverBar, xKey]
  )

  return (
    <ResponsiveBar
      data={data}
      indexBy={xKey as string}
      keys={[yKey as string]}
      enableLabel={false}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      axisTop={null}
      axisRight={null}
      axisBottom={axisBottom}
      axisLeft={axisLeft}
      colors={colors}
      theme={{
        text: {
          fontSize: appTheme.token?.fontSize,
          fontFamily: appTheme.token?.fontFamily,
        },
        axis: {
          ticks: {
            text: {
              fontSize: appTheme.token?.fontSize,
            },
          },
          legend: {
            text: {
              fontSize: appTheme.token?.fontSize,
            },
          },
        },
      }}
      onMouseEnter={(node) => {
        setHoverBar(node.data[xKey])
      }}
      onMouseLeave={() => setHoverBar(null)}
      {...props}
    />
  )
}

export { BarChart }
