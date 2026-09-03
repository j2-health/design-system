import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import dts from 'vite-plugin-dts'
import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  // Storybook serves these via staticDirs; the library build must not copy
  // public/ into dist/, which files: ["dist"] would then ship in the tarball.
  publicDir: false,
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'default',
      },
    }),
    dts({
      include: ['lib.ts', 'index.ts', 'tailwind.config.ts', 'src'],
      exclude: [
        '**/*.stories.*',
        '**/*.test.*',
        '**/__tests__/**',
        'src/test-utils/**',
      ],
      copyDtsFiles: true,
      beforeWriteFile: (filePath, content) => {
        // The package's public types use the ambient declarations from
        // src/index.d.ts (global Expand<T> helper, *.svg?react modules).
        // Ambient files are only loaded if something references them, so
        // anchor them to the types entry point.
        if (filePath.endsWith('/lib.d.ts')) {
          return {
            filePath,
            content: `/// <reference path="./src/index.d.ts" />\n${content}`,
          }
        }
        return { filePath, content }
      },
    }),
  ],
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('./lib.ts', import.meta.url)),
        tailwind: fileURLToPath(
          new URL('./tailwind.config.ts', import.meta.url)
        ),
      },
      formats: ['es', 'cjs'],
      cssFileName: 'style',
    },
    cssCodeSplit: false,
    sourcemap: true,
    // Keep output readable so consuming apps' Tailwind content scanning can
    // still detect utility class names in the compiled output.
    minify: false,
    rollupOptions: {
      // Externalize every bare import: peers (react, antd, ...) and their
      // transitive packages (rc-*, @ant-design/*) resolve from the consumer.
      external: (id) => !id.startsWith('.') && !id.startsWith('/'),
      output: {
        preserveModules: false,
      },
    },
  },
})
