import { render, waitFor } from '@testing-library/react'
import type * as Highcharts from 'highcharts'
import { VennDiagram } from '../VennDiagram'

const data = [
  { sets: ['A'], value: 4, name: 'Only A' },
  { sets: ['B'], value: 3, name: 'Only B' },
  { sets: ['A', 'B'], value: 1, name: 'Both' },
] as Highcharts.PointOptionsObject[]

const renderVenn = () => render(<VennDiagram title="Overlap" data={data} />)

const chartSvg = async (container: HTMLElement) => {
  await waitFor(() =>
    expect(container.querySelector('svg.highcharts-root')).toBeInTheDocument()
  )
}

describe('VennDiagram', () => {
  it('registers the venn series type and draws a point per set', async () => {
    const { container } = renderVenn()
    await chartSvg(container)

    // The venn series type is not in Highcharts core -- it arrives via the
    // `@highcharts/react/series/Venn` side-effect import. Without it the chart
    // still renders but the series does not, so this is what notices.
    expect(
      container.querySelector('g.highcharts-venn-series')
    ).toBeInTheDocument()
    expect(container.querySelectorAll('.highcharts-point')).toHaveLength(
      data.length
    )
  })

  it('labels each set with its name and renders the title', async () => {
    const { container } = renderVenn()
    await chartSvg(container)

    expect(container.querySelector('.highcharts-title')?.textContent).toBe(
      'Overlap'
    )

    const labels = Array.from(
      container.querySelectorAll('.highcharts-data-label text')
    ).map((node) => node.textContent)
    expect(labels).toEqual(['Only A', 'Only B', 'Both'])
  })

  it('pins the chart to the light colour scheme', async () => {
    // See the matching test in barchart.test.tsx: Highcharts 13 opts charts
    // into `color-scheme: light dark`, and j2 has no dark theme.
    const { container } = renderVenn()
    await chartSvg(container)

    expect(
      container
        .querySelector('.highcharts-container')
        ?.closest('.highcharts-light')
    ).not.toBeNull()
  })
})
