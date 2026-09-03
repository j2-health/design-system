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
    // Fail loudly if the match stops working — a silent no-op here republishes
    // the declaration tree to the public Pages site, which is exactly what
    // this filter exists to prevent. Mirrors the emitted-nothing guard in
    // vite.config.ts.
    const before = config.plugins?.length ?? 0
    config.plugins = (config.plugins ?? []).filter(
      (p) => !(p && 'name' in p && p.name === 'unplugin-dts')
    )
    if (config.plugins.length === before) {
      throw new Error(
        "the 'unplugin-dts' plugin was not found in Storybook's Vite config; " +
          'it may have been renamed. Update this filter, or the declaration ' +
          'tree will be emitted into the public storybook-static/ build.'
      )
    }
    return config
  },
}

// eslint-disable-next-line import/no-default-export
export default config
