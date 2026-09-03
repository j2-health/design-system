import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import dts from 'vite-plugin-dts'
import { fileURLToPath } from 'node:url'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

// Matches the specifier of any `from '...'`, `import '...'` or `import('...')`
// that is relative. Deliberately blind to `/// <reference path="..." />`,
// which uses double quotes and is not a module specifier.
const RELATIVE_SPECIFIER = /\b(?:from|import)\s*\(?\s*'(\.[^']*)'/g

// The package is `"type": "module"`, so under moduleResolution node16/nodenext
// an extensionless relative specifier is invalid. tsc emits specifiers
// verbatim from source, and `dist/lib.d.ts` re-exported `./index`, which did
// not resolve — leaving consumers on modern Node resolution with no exports at
// all. Rewriting the 41+ source lines instead is not an option: index.ts is the
// git-submodule entry point.
//
// Whether a specifier names a file or a directory is decided by looking at
// what was actually emitted, never by guessing from the string:
// `./src/components/alert` is a directory and must become
// `./src/components/alert/index.js`, not `./src/components/alert.js`.
const resolvableSpecifier = (declarationFile: string, specifier: string) => {
  // The root tsconfig's `paths` maps a bare specifier onto a file inside
  // node_modules, and tsc emits that mapping as a relative path — which points
  // outside the tarball and leaves the affected props as `any` for consumers.
  // Map it back to the package it names. The leading `.*` is greedy, so a
  // nested node_modules yields the innermost package.
  const inNodeModules = /.*\/node_modules\/((?:@[^/]+\/)?[^/]+)/.exec(specifier)
  if (inNodeModules) return inNodeModules[1]

  if (/\.(js|mjs|cjs|css|json)$/.test(specifier)) return specifier

  // An existing .ts extension is replaced, not appended: ./tailwind.config.ts.
  const bare = specifier.replace(/\.tsx?$/, '')
  const target = resolve(dirname(declarationFile), bare)

  if (existsSync(`${target}.d.ts`)) return `${bare}.js`
  if (existsSync(join(target, 'index.d.ts'))) {
    return `${bare.replace(/\/$/, '')}/index.js`
  }
  // Nothing was emitted under that path — leave it exactly as it is rather
  // than inventing an extension for a specifier that is broken either way.
  return specifier
}

const rewriteDeclarationSpecifiers = (emitted: Map<string, string>) => {
  for (const declarationFile of emitted.keys()) {
    const before = readFileSync(declarationFile, 'utf8')
    const after = before.replace(RELATIVE_SPECIFIER, (match, specifier) =>
      match.replace(
        `'${specifier}'`,
        `'${resolvableSpecifier(declarationFile, specifier)}'`
      )
    )
    if (after !== before) writeFileSync(declarationFile, after)
  }
}

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
      afterBuild: rewriteDeclarationSpecifiers,
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
