import path from 'path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      // Must match vite.config.ts. This config is what vitest builds with, so
      // an `include` set only there leaves every `.svg` here falling through
      // to vite's asset pipeline, which inlines it as a data URI — the default
      // export becomes a string and `<Logo />` renders as `<data:image/...>`
      // instead of the component. It fails as two snapshot mismatches in
      // navMenu/legacyNavMenu, the only components that import an SVG.
      include: '**/*.svg',
      svgrOptions: {
        exportType: 'default',
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
    environmentOptions: {
      happyDOM: {
        url: 'http://localhost',
      },
    },
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    testTimeout: 15000,
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    deps: {
      optimizer: {
        web: {
          enabled: true,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
