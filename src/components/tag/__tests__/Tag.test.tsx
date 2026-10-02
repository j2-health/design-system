import { render, screen } from '@testing-library/react'
import { Tag } from '../Tag'

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
