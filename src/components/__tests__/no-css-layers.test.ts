import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

// Component CSS is compiled into dist/style.css. Tailwind 3 consumers that run
// that file through PostCSS fail the build on any `@layer` without a matching
// `@tailwind` directive in the same file, so component CSS must not declare
// layers. The shipped stylesheets in src/stylesheets may: they carry their own
// @tailwind directives.
const cssFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return cssFiles(path)
    return path.endsWith('.css') ? [path] : []
  })

describe('component CSS', () => {
  it.each(cssFiles(join(__dirname, '..')))('%s declares no @layer', (file) => {
    expect(readFileSync(file, 'utf8')).not.toMatch(/@layer\b/)
  })
})
