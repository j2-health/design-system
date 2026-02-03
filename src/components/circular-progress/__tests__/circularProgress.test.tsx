import { render, screen } from '@testing-library/react'
import { CircularProgress } from '../CircularProgress'

describe('CircularProgress', () => {
  it('should render correctly', () => {
    const { container } = render(<CircularProgress percent={75} />)
    expect(container).toMatchSnapshot()
  })

  it('should render with correct aria attributes', () => {
    render(<CircularProgress percent={50} />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '50')
    expect(progressbar).toHaveAttribute('aria-valuemin', '0')
    expect(progressbar).toHaveAttribute('aria-valuemax', '100')
  })

  it('should clamp percent to 0 when negative', () => {
    render(<CircularProgress percent={-10} />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '0')
  })

  it('should clamp percent to 100 when over 100', () => {
    render(<CircularProgress percent={150} />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '100')
  })

  it('should render with custom size', () => {
    render(<CircularProgress percent={50} size={100} />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('width', '100')
    expect(progressbar).toHaveAttribute('height', '100')
  })

  it('should show percentage text when showPercent is true', () => {
    render(<CircularProgress percent={75} showPercent />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('should not show percentage text when showPercent is false', () => {
    render(<CircularProgress percent={75} showPercent={false} />)
    expect(screen.queryByText('75%')).not.toBeInTheDocument()
  })

  it('should round percentage text', () => {
    render(<CircularProgress percent={75.7} showPercent />)
    expect(screen.getByText('76%')).toBeInTheDocument()
  })

  it('should render center fill when centerClassName is provided', () => {
    const { container } = render(
      <CircularProgress percent={50} centerClassName="text-blue-500" />
    )
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBe(3) // center, ring, track
  })

  it('should not render center fill when centerClassName is not provided', () => {
    const { container } = render(<CircularProgress percent={50} />)
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBe(2) // ring, track only
  })

  it('should apply custom className to svg', () => {
    const { container } = render(
      <CircularProgress percent={50} className="custom-class" />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('custom-class')
  })

  it('should apply ringClassName to background ring', () => {
    const { container } = render(
      <CircularProgress percent={50} ringClassName="ring-custom" />
    )
    const circles = container.querySelectorAll('circle')
    expect(circles[0]).toHaveClass('ring-custom')
  })

  it('should apply trackClassName to progress track', () => {
    const { container } = render(
      <CircularProgress percent={50} trackClassName="track-custom" />
    )
    const circles = container.querySelectorAll('circle')
    expect(circles[1]).toHaveClass('track-custom')
  })

  it('should not apply strokeDasharray when percent is 100', () => {
    const { container } = render(<CircularProgress percent={100} />)
    const trackCircle = container.querySelectorAll('circle')[1]
    expect(trackCircle).not.toHaveAttribute('stroke-dasharray')
  })

  it('should apply strokeDasharray when percent is less than 100', () => {
    const { container } = render(<CircularProgress percent={50} />)
    const trackCircle = container.querySelectorAll('circle')[1]
    expect(trackCircle).toHaveAttribute('stroke-dasharray')
  })

  describe('size and strokeWidth validation', () => {
    it('should handle size of 0 without crashing', () => {
      const { container } = render(<CircularProgress percent={50} size={0} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should handle negative size without crashing', () => {
      const { container } = render(<CircularProgress percent={50} size={-10} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should handle strokeWidth greater than size', () => {
      const { container } = render(
        <CircularProgress percent={50} size={20} strokeWidth={50} />
      )
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      // Should still render circles with clamped strokeWidth
      const circles = container.querySelectorAll('circle')
      expect(circles.length).toBe(2)
    })

    it('should handle strokeWidth equal to size', () => {
      const { container } = render(
        <CircularProgress percent={50} size={50} strokeWidth={50} />
      )
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should handle negative strokeWidth', () => {
      const { container } = render(
        <CircularProgress percent={50} strokeWidth={-5} />
      )
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      const circles = container.querySelectorAll('circle')
      expect(circles.length).toBe(2)
    })

    it('should render correctly with very small size', () => {
      const { container } = render(
        <CircularProgress percent={75} size={1} strokeWidth={1} />
      )
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })
})
