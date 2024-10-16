import React from 'react'
import type { Preview } from '@storybook/react'
import theme from './theme'
import { ConfigProvider } from 'antd'

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      theme,
      toc: true
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ConfigProvider theme={{
        token: {
          fontFamily: 'Rubik, sans-serif',
        }
      }}>
        <Story />
      </ConfigProvider>
    ),
  ],
}

export default preview
