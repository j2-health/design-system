import React from 'react'
import type { Preview } from '@storybook/react-vite'
import theme from './theme'
import { AppConfigProvider } from '../src/AppConfigProvider'
import '../src/stylesheets/index.css'

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      theme,
      toc: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: (a, b) => {
        const sortKey = (id, name) => {
          switch (name) {
            case 'Docs':
              return `0-${id}`
            case 'Default':
              return `1-${id}`
            default:
              return id
          }
        }

        const compKeyA = sortKey(a.id, a.name)
        const compKeyB = sortKey(b.id, b.name)

        return compKeyA === compKeyB
          ? 0
          : compKeyA.localeCompare(compKeyB, undefined, { numeric: true })
      },
    },
  },
  decorators: [
    (Story) => (
      <AppConfigProvider>
        <Story />
      </AppConfigProvider>
    ),
  ],
}

export default preview
