import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // Copied to the build output root, which is what makes the favicon
  // referenced by manager-head.html resolve in the published Storybook.
  staticDirs: ['../public'],
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
    // Drop the library-build-only dts plugin: it would otherwise emit the
    // whole declaration tree into storybook-static/ (published to Pages).
    config.plugins = (config.plugins ?? []).filter(
      (p) => !(p && 'name' in p && p.name === 'unplugin-dts')
    )
    return config
  },
}

// eslint-disable-next-line import/no-default-export
export default config
