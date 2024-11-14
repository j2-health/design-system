import { act, render } from '@testing-library/react'
import { BarChart } from '../BarChart'

const stripDynamicIds = (html: string): string => {
  return html
    .replace(/id="highcharts-[a-z0-9-]+"/g, 'id="highcharts-unique-id"')
    .replace(
      /clip-path="url\(#highcharts-[a-z0-9-]+\)"/g,
      'clip-path="url(#highcharts-unique-id)"'
    )
}

jest.mock('react-dom/server', () => ({
  renderToString: jest.fn(() => 'mocked string'),
}))

describe('BarChart', () => {
  let originalGetBoundingClientRect: typeof HTMLElement.prototype.getBoundingClientRect

  beforeEach(() => {
    // Store the original getBoundingClientRect function
    originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect

    // Mock the chart container dimensions
    Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
      value: () => ({
        width: 600,
        height: 400,
        x: 0,
        y: 0,
        top: 0,
        right: 600,
        bottom: 400,
        left: 0,
      }),
      configurable: true,
    })
  })

  afterEach(() => {
    // Restore the original getBoundingClientRect function
    Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
      value: originalGetBoundingClientRect,
      configurable: true,
    })
  })

  it('should render correctly', async () => {
    await act(async () => {
      const { container } = render(
        <div style={{ width: '600px', height: '400px' }}>
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
            tooltip={(category, value, seriesName) => (
              <div>
                {category}: {value} ({seriesName})
              </div>
            )}
          />
        </div>
      )

      // Allow Highcharts to complete initialization
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(stripDynamicIds(container.innerHTML)).toMatchSnapshot()
    })
  })
})
