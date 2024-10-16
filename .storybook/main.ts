import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  title: 'J2 Health Design System',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: "react-docgen",
    check: false,
    skipCompiler: true
  },
}
export default config
