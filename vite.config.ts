import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'default',
      },
    }),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*', 'index.tsx'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'index.tsx'),
      name: 'DesignSystem',
      formats: ['es', 'umd'],
      fileName: (format) => `design-system.${format}.js`,
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: (id) => {
        return (
          id === 'react' ||
          id === 'react-dom' ||
          id === 'react/jsx-runtime' ||
          id === 'react/jsx-dev-runtime' ||
          id.startsWith('react/') ||
          id.startsWith('react-dom/') ||
          id === 'antd' ||
          id === 'formik' ||
          id === 'yup' ||
          id === 'lodash' ||
          id === '@phosphor-icons/react'
        )
      },
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
          antd: 'antd',
          formik: 'Formik',
          yup: 'Yup',
          lodash: '_',
          '@phosphor-icons/react': 'PhosphorIcons',
        },
      },
    },
  },
})
