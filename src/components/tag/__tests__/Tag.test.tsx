import { render, screen } from '@testing-library/react'
import { Tag, tintedStyle } from '../Tag'

describe('Tag', () => {
  it('styles a solid tag as a filled badge', () => {
    render(
      <Tag status="processing" variant="solid">
        Met
      </Tag>
    )
    const tag = screen.getByText('Met').closest('.ant-tag')
    expect(tag).toHaveClass('j2-tag-solid')
    expect(tag).not.toHaveClass('bg-[var(--j2-color-fill-quaternary)]')
  })

  it('leaves the default tag unchanged', () => {
    render(<Tag status="default">Plain</Tag>)
    const tag = screen.getByText('Plain').closest('.ant-tag')
    expect(tag).not.toHaveClass('j2-tag-solid')
    expect(tag).toHaveClass('bg-[var(--j2-color-fill-quaternary)]')
  })

  it('uses a custom color in place of the status color', () => {
    render(
      <Tag status="default" variant="solid" color="rgb(240, 142, 46)">
        Not met
      </Tag>
    )
    const tag = screen.getByText('Not met').closest('.ant-tag') as HTMLElement
    expect(tag.style.backgroundColor).toBe('rgb(240, 142, 46)')
  })
})

describe('Tag borderColor', () => {
  it('sets the border color separately from the fill', () => {
    render(
      <Tag
        status="default"
        variant="solid"
        color="rgb(240, 142, 46)"
        borderColor="rgb(166, 82, 0)"
      >
        Edge
      </Tag>
    )
    const tag = screen.getByText('Edge').closest('.ant-tag') as HTMLElement
    expect(tag.style.borderColor).toBe('rgb(166, 82, 0)')
    expect(tag.style.backgroundColor).toBe('rgb(240, 142, 46)')
  })
})

describe('Tag solid default', () => {
  it('uses the DS neutral, not antd near-black, and a white icon', () => {
    render(
      <Tag status="default" variant="solid" showIcon>
        Neutral
      </Tag>
    )
    const tag = screen.getByText('Neutral').closest('.ant-tag') as HTMLElement
    expect(tag.style.backgroundColor).toBe('var(--j2-gray-11)')
    expect(tag.querySelector('svg')).toHaveAttribute('fill', 'white')
  })
})

describe('Tag tinted', () => {
  // The test DOM drops color-mix() declarations, so the colors are checked
  // on the style the tag gets, and the rendered tag for its class.
  it('derives the fill, border and text from one color', () => {
    expect(tintedStyle('var(--j2-color-categorical-3)')).toEqual({
      background:
        'color-mix(in srgb, var(--j2-color-categorical-3) 14%, white)',
      borderColor:
        'color-mix(in srgb, var(--j2-color-categorical-3) 45%, white)',
      color: 'color-mix(in srgb, var(--j2-color-categorical-3) 65%, black)',
    })
  })

  it('renders as tinted, not as the default gray tag', () => {
    render(
      <Tag
        status="default"
        variant="tinted"
        color="var(--j2-color-categorical-3)"
      >
        Q2 refresh
      </Tag>
    )
    const tag = screen.getByText('Q2 refresh').closest('.ant-tag')
    expect(tag).toHaveClass('j2-tag-tinted')
    expect(tag).not.toHaveClass('bg-[var(--j2-color-fill-quaternary)]')
  })

  it("doesn't hand color to antd, which can't parse a CSS variable", () => {
    render(
      <Tag
        status="default"
        variant="tinted"
        color="var(--j2-color-categorical-1)"
      >
        Label
      </Tag>
    )
    const tag = screen.getByText('Label').closest('.ant-tag')
    expect(tag).not.toHaveClass('ant-tag-has-color')
  })

  it('lets borderColor override the tinted border', () => {
    render(
      <Tag
        status="default"
        variant="tinted"
        color="var(--j2-color-categorical-2)"
        borderColor="rgb(1, 2, 3)"
      >
        Edge
      </Tag>
    )
    const tag = screen.getByText('Edge').closest('.ant-tag') as HTMLElement
    expect(tag.style.borderColor).toBe('rgb(1, 2, 3)')
  })
})
