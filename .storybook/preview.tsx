import React from 'react'
import type { Preview } from '@storybook/react'
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
      storySort: (a, b) =>
        a.id === b.id
          ? 0
          : a.id.localeCompare(b.id, undefined, { numeric: true }),
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
