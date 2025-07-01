import { act, render } from '@testing-library/react'
import { LegacyNavMenu } from '../LegacyNavMenu'
import { ChartPie, FileText, Network, Question } from '../../icons'
import type { NavSection, LegacyNavMenuUser } from '../LegacyNavMenu'

describe('LegacyNavMenu', () => {
  const testSections: NavSection[] = [
    {
      title: 'ANALYZE',
      items: [
        {
          id: 'scorecard',
          label: 'Scorecard',
          icon: <ChartPie size={24} />,
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: <FileText size={24} />,
        },
      ],
    },
    {
      title: 'MANAGE',
      items: [
        {
          id: 'networks',
          label: 'Networks',
          isActive: true,
          icon: <Network size={24} />,
        },
        {
          id: 'user-guide',
          label: 'User Guide',
          icon: <Question size={24} />,
        },
      ],
    },
  ]

  const testUser: LegacyNavMenuUser = {
    firstName: 'Bob',
    lastName: 'Smith',
  }

  it('should render correctly', async () => {
    const { container } = await act(async () =>
      render(<LegacyNavMenu sections={testSections} user={testUser} />)
    )

    expect(container).toMatchSnapshot()
  })
})
