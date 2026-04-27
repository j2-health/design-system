import { render } from '@testing-library/react'
import { Pagination } from '../Pagination'

describe('Pagination', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Pagination current={1} pageSize={10} total={100} />
    )
    expect(container).toMatchSnapshot()
  })

  it('should render with text labels for prev/next', () => {
    const { container } = render(
      <Pagination current={1} pageSize={10} total={100} paginationTextLabels />
    )
    expect(container).toMatchSnapshot()
  })

  it('should render size changer and total', () => {
    const { container } = render(
      <Pagination
        current={1}
        pageSize={10}
        total={100}
        showSizeChanger
        showTotal={(total) => `Total ${total} items`}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
