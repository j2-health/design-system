import { vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { BarChart } from '../BarChart'

vi.mock('react-dom/server', () => ({
  renderToString: vi.fn(() => 'mocked string'),
}))

const renderBarChart = () =>
  render(
    <BarChart
      categories={['Category 1', 'Category 2']}
      series={[
        { name: 'Series 1', data: [1, 2] },
        { name: 'Series 2', data: [3, 4] },
      ]}
      min={0}
      max={5}
      tickInterval={1}
      xAxisTitle="X Axis"
      yAxisTitle="Y Axis"
      width={600}
      height={400}
      tooltip={(category, value, seriesName) => (
        <div>
          {category}: {value} ({seriesName})
        </div>
      )}
    />
  )

const chartSvg = async (container: HTMLElement) => {
  await waitFor(() =>
    expect(container.querySelector('svg.highcharts-root')).toBeInTheDocument()
  )
  return container.querySelector('svg.highcharts-root') as SVGElement
}

describe('BarChart', () => {
  it('draws one column series per series, each carrying its own points', async () => {
    const { container } = renderBarChart()
    await chartSvg(container)

    // happy-dom reports a zero-width container, so Highcharts never gives the
    // columns geometry. The per-series accessibility label is derived from the
    // data it did parse, which is the part worth pinning here; the drawn bars
    // are covered by the browser pass instead.
    const seriesLabels = Array.from(
      container.querySelectorAll('g.highcharts-column-series[aria-label]')
    ).map((node) => node.getAttribute('aria-label'))

    expect(seriesLabels).toEqual([
      'Series 1, bar series 1 of 2 with 2 bars.',
      'Series 2, bar series 2 of 2 with 2 bars.',
    ])
  })

  it('renders the configured axes', async () => {
    const { container } = renderBarChart()
    await chartSvg(container)

    const xAxisLabels = Array.from(
      container.querySelectorAll('.highcharts-xaxis-labels text')
    ).map((node) => node.textContent)
    expect(xAxisLabels).toEqual(
      expect.arrayContaining(['Category 1', 'Category 2'])
    )

    const axisTitles = Array.from(
      container.querySelectorAll('.highcharts-axis-title')
    ).map((node) => node.textContent)
    expect(axisTitles).toEqual(expect.arrayContaining(['X Axis', 'Y Axis']))
  })

  it('pins the chart to the light colour scheme', async () => {
    // Highcharts 13 sets `color-scheme: light dark` on .highcharts-container,
    // which repaints the chart against a dark palette when the viewer's OS is
    // in dark mode. j2 has no dark theme, so we opt back out via the
    // `highcharts-light` ancestor class Highcharts ships for the purpose.
    const { container } = renderBarChart()
    await chartSvg(container)

    expect(
      container
        .querySelector('.highcharts-container')
        ?.closest('.highcharts-light')
    ).not.toBeNull()
  })
})
