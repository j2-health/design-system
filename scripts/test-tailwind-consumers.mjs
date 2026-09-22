import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = dirname(dirname(fileURLToPath(import.meta.url)))
const packageJson = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8'))
const tailwindPeer = packageJson.peerDependencies.tailwindcss

if (!tailwindPeer.includes('^3.4.14') || !tailwindPeer.includes('^4.0.0')) {
  throw new Error(
    `tailwindcss peer must support v3 and v4; received ${tailwindPeer}`
  )
}

const packDirectory = mkdtempSync(join(tmpdir(), 'design-system-pack-'))

const run = (command, args, cwd) =>
  execFileSync(command, args, { cwd, encoding: 'utf8', stdio: 'pipe' })

try {
  const tarballName = run(
    'npm',
    [
      'pack',
      '--silent',
      '--ignore-scripts',
      '--pack-destination',
      packDirectory,
    ],
    repo
  ).trim()
  const tarball = join(packDirectory, tarballName)

  for (const major of [3, 4]) {
    const consumer = mkdtempSync(join(tmpdir(), `tailwind-${major}-consumer-`))

    try {
      run('npm', ['init', '-y'], consumer)
      run('npm', ['pkg', 'set', 'type=module'], consumer)
      run(
        'npm',
        [
          'install',
          '--silent',
          '--legacy-peer-deps',
          tarball,
          'postcss@^8',
          'postcss-cli@^11',
          `tailwindcss@^${major}`,
          ...(major === 3
            ? ['autoprefixer@^10', 'postcss-import@^16']
            : ['@tailwindcss/postcss@^4']),
        ],
        consumer
      )

      writeFileSync(
        join(consumer, 'tailwind.config.js'),
        `import { tailwindPreset } from '@j2-health/design-system/tailwind'

export default {
  presets: [tailwindPreset],
  content: ['./input.css'],
}
`
      )

      writeFileSync(
        join(consumer, 'postcss.config.js'),
        major === 3
          ? `export default { plugins: { 'postcss-import': {}, tailwindcss: {}, autoprefixer: {} } }\n`
          : `export default { plugins: { '@tailwindcss/postcss': {} } }\n`
      )

      writeFileSync(
        join(consumer, 'input.css'),
        major === 3
          ? `@import './node_modules/@j2-health/design-system/src/stylesheets/index.css';

.probe { @apply text-j2-text-secondary gap-3; }
`
          : `@import 'tailwindcss';
@import './node_modules/@j2-health/design-system/src/stylesheets/index.css';
@config './tailwind.config.js';

.probe { @apply text-j2-text-secondary gap-3; }
`
      )

      run('npx', ['postcss', 'input.css', '-o', 'output.css'], consumer)
      const output = readFileSync(join(consumer, 'output.css'), 'utf8')

      for (const expected of [
        '.probe',
        'color: var(--j2-color-text-secondary)',
      ]) {
        if (!output.includes(expected)) {
          throw new Error(`Tailwind ${major} output is missing ${expected}`)
        }
      }

      if (!/gap: (?:0\.75rem|calc\(var\(--spacing\) \* 3\))/.test(output)) {
        throw new Error(`Tailwind ${major} output is missing the gap-3 value`)
      }

      if (output.includes('@tailwind')) {
        throw new Error(
          `Tailwind ${major} output contains unprocessed directives`
        )
      }

      console.log(`Tailwind ${major} consumer compiled the packed package`)
    } finally {
      rmSync(consumer, { recursive: true, force: true })
    }
  }
} finally {
  rmSync(packDirectory, { recursive: true, force: true })
}
