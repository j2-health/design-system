import { execFileSync } from 'node:child_process'
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { satisfies } from 'semver'

const repo = dirname(dirname(fileURLToPath(import.meta.url)))
const packageJson = JSON.parse(readFileSync(join(repo, 'package.json'), 'utf8'))
const tailwindPeer = packageJson.peerDependencies.tailwindcss
const scenarios = [
  { name: '3-min', tailwind: '3.4.14' },
  { name: '3-latest', tailwind: '^3' },
  {
    name: '4-min',
    tailwind: '4.0.0',
    postcss: '4.0.0',
    transitivePins: ['@tailwindcss/node@4.0.0', '@tailwindcss/oxide@4.0.0'],
  },
  { name: '4-latest', tailwind: '^4', postcss: '^4' },
]

for (const version of ['3.4.14', '4.0.0']) {
  if (!satisfies(version, tailwindPeer)) {
    throw new Error(
      `tailwindcss peer ${tailwindPeer} does not include supported minimum ${version}`
    )
  }
}

const packDirectory = mkdtempSync(join(tmpdir(), 'design-system-pack-'))

const run = (command, args, cwd) =>
  execFileSync(command, args, { cwd, encoding: 'utf8', stdio: 'pipe' })

try {
  run('npm', ['run', 'build'], repo)
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

  for (const scenario of scenarios) {
    const major = Number(scenario.name[0])
    const consumer = mkdtempSync(
      join(tmpdir(), `tailwind-${scenario.name}-consumer-`)
    )

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
          'vite@^6',
          'postcss@^8',
          `tailwindcss@${scenario.tailwind}`,
          ...(major === 3
            ? ['autoprefixer@^10', 'postcss-import@^16']
            : [
                `@tailwindcss/postcss@${scenario.postcss}`,
                ...(scenario.transitivePins ?? []),
              ]),
        ],
        consumer
      )

      writeFileSync(
        join(consumer, 'tailwind.config.js'),
        `import { tailwindPreset } from '@j2-health/design-system/tailwind'

export default {
  presets: [tailwindPreset],
  content: [
    './index.html',
    './node_modules/@j2-health/design-system/dist/**/*.{js,cjs,css}',
  ],
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
        join(consumer, 'index.html'),
        '<link rel="stylesheet" href="/input.css"><main>consumer</main>\n'
      )

      writeFileSync(
        join(consumer, 'input.css'),
        major === 3
          ? `@import '@j2-health/design-system/stylesheets/index.css';

.probe { @apply text-j2-text-secondary gap-3; }
`
          : `@import '@j2-health/design-system/stylesheets/tailwind.css';
@config './tailwind.config.js';

.probe { @apply text-j2-text-secondary gap-3; }
`
      )

      run('npx', ['vite', 'build'], consumer)
      const cssFile = readdirSync(join(consumer, 'dist', 'assets')).find(
        (file) => file.endsWith('.css')
      )
      if (!cssFile) {
        throw new Error(`Tailwind ${scenario.name} build emitted no CSS`)
      }
      const output = readFileSync(
        join(consumer, 'dist', 'assets', cssFile),
        'utf8'
      )

      for (const expected of [
        '.probe',
        'color:var(--j2-color-text-secondary)',
        '.min-h-6',
      ]) {
        if (!output.includes(expected)) {
          throw new Error(
            `Tailwind ${scenario.name} output is missing ${expected}`
          )
        }
      }

      if (!/gap:(?:\.75rem|calc\(var\(--spacing\)\s*\*\s*3\))/.test(output)) {
        throw new Error(
          `Tailwind ${scenario.name} output is missing the gap-3 value: ${[
            ...output.matchAll(/gap:[^;}]+/g),
          ]
            .map(([match]) => match)
            .slice(0, 10)
            .join(', ')}`
        )
      }

      if (!output.startsWith('@import"https://fonts.googleapis.com/')) {
        throw new Error(
          `Tailwind ${scenario.name} output does not preserve the webfont import first`
        )
      }

      if (output.includes('@tailwind')) {
        throw new Error(
          `Tailwind ${scenario.name} output contains unprocessed directives`
        )
      }

      console.log(
        `Tailwind ${scenario.name} consumer compiled the packed package`
      )
    } finally {
      rmSync(consumer, { recursive: true, force: true })
    }
  }
} finally {
  rmSync(packDirectory, { recursive: true, force: true })
}
