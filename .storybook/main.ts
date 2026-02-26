import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen',
    check: false,
    skipCompiler: true,
  },
  viteFinal(config) {
    config.optimizeDeps ??= {}
    config.optimizeDeps.exclude ??= []
    config.optimizeDeps.exclude.push('highcharts', '@highcharts/react')
    return config
  },
}

// eslint-disable-next-line import/no-default-export
export default config
