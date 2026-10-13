import { render, screen } from '@testing-library/react'
import { ThresholdBar } from '../ThresholdBar'

describe('ThresholdBar', () => {
  it('sizes the solid and projected segments and clamps to 0–100', () => {
    render(<ThresholdBar value={120} projected={-5} ariaLabel="Bar" />)
    const bar = screen.getByRole('img', { name: 'Bar' })
    const [stripes, solid] = Array.from(bar.children) as HTMLElement[]
    expect(stripes.style.width).toBe('0%')
    expect(solid.style.width).toBe('100%')
  })

  it('renders the marker and threshold labels when given', () => {
    render(
      <ThresholdBar
        value={60}
        marker={{ value: 80, label: 'If applied', detail: '80%' }}
        threshold={{ value: 75, label: 'Threshold 75%' }}
        ariaLabel="Bar"
      />
    )
    expect(screen.getByText('If applied')).toBeInTheDocument()
    expect(screen.getByText('80%')).toBeInTheDocument()
    expect(screen.getByText('Threshold 75%')).toBeInTheDocument()
  })

  it('keeps an end label inside the bar', () => {
    render(
      <ThresholdBar
        value={10}
        marker={{ value: 98, label: 'Near the end' }}
        ariaLabel="Bar"
      />
    )
    const label = screen.getByText('Near the end').parentElement as HTMLElement
    expect(label.style.transform).toBe('translateX(-100%)')
  })

  it.each([
    [2, 'translateX(0%)'],
    [98, 'translateX(-100%)'],
  ])(
    'keeps the caret centred on %s%% while its label snaps to the edge',
    (value, labelTransform) => {
      render(
        <ThresholdBar
          value={10}
          marker={{ value, label: 'Marker' }}
          ariaLabel="Bar"
        />
      )
      const label = screen.getByText('Marker').parentElement as HTMLElement
      const caret = label.previousElementSibling as HTMLElement
      expect(label.style.transform).toBe(labelTransform)
      expect(caret.style.transform).toBe('translateX(-50%)')
    }
  )

  it('omits the optional parts', () => {
    render(<ThresholdBar value={40} ariaLabel="Bar" />)
    expect(screen.getByRole('img', { name: 'Bar' }).children).toHaveLength(1)
  })
})
