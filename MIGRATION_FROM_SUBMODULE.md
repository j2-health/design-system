# Migrating from Git Submodule to npm Package

Guide for migrating projects that currently use design-system as a git submodule
to using the `@j2-health/design-system` npm package.

## Quick Answer

**Yes!** Remove the submodule directory and add `@j2-health/design-system` to
your package.json. But follow these steps carefully:

---

## Step-by-Step Migration

### 1. Set Up Authentication (in your project)

**Fish:**

```fish
cd /path/to/your/project

# Create .npmrc
echo '@j2-health:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}' > .npmrc

# Set token if not already set
set -x GITHUB_TOKEN your_github_personal_access_token

# Make it permanent
echo 'set -x GITHUB_TOKEN your_github_personal_access_token' >> ~/.config/fish/config.fish
```

**Bash/Zsh:**

```bash
cd /path/to/your/project

# Create .npmrc
cat > .npmrc << 'EOF'
@j2-health:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
EOF

# Set token if not already set
export GITHUB_TOKEN=your_github_personal_access_token
echo 'export GITHUB_TOKEN=your_github_personal_access_token' >> ~/.zshrc
source ~/.zshrc
```

### 2. Remove Git Submodule

**Fish:**

```fish
# Assuming submodule is at ./design-system
git submodule deinit -f design-system
git rm -f design-system
rm -rf .git/modules/design-system

# Commit the removal
git commit -m "Remove design-system submodule, migrate to npm package"
```

**Bash/Zsh:**

```bash
# Same commands work in bash/zsh
git submodule deinit -f design-system
git rm -f design-system
rm -rf .git/modules/design-system
git commit -m "Remove design-system submodule, migrate to npm package"
```

### 3. Install npm Package

```bash
# Install the package
npm install @j2-health/design-system

# Or add to package.json first, then npm install
```

Your `package.json` should now have:

```json
{
  "dependencies": {
    "@j2-health/design-system": "^1.0.0"
  }
}
```

### 4. Update Your Imports

**Before (Submodule):**

```typescript
// Individual component imports
import { Button } from './design-system/src/components/button'
import { Card } from './design-system/src/components/card'
import { Modal } from './design-system/src/components/modal'

// Styles
import './design-system/src/stylesheets/index.css'
```

**After (npm Package):**

```typescript
// All components from single import
import { Button, Card, Modal } from '@j2-health/design-system'

// Single CSS import
import '@j2-health/design-system/dist/style.css'
```

### 5. Update Build Configuration

If your webpack/vite config had special handling for the submodule, remove it:

**Remove configurations like:**

```typescript
// vite.config.ts - REMOVE these if present
export default {
  resolve: {
    alias: {
      '@design-system': path.resolve(__dirname, './design-system/src'),
    },
  },
  optimizeDeps: {
    include: ['./design-system'],
  },
}

// webpack.config.js - REMOVE these if present
module: {
  rules: [
    {
      test: /\.(ts|tsx)$/,
      include: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'design-system'), // REMOVE this line
      ],
      use: 'ts-loader',
    },
  ],
}
```

The npm package is pre-built, so no special configuration needed!

### 6. Update TypeScript Config (if needed)

**Remove submodule paths:**

```json
// tsconfig.json - REMOVE design-system references
{
  "compilerOptions": {
    "paths": {
      "@design-system/*": ["./design-system/src/*"] // REMOVE
    }
  },
  "include": [
    "src",
    "design-system/src" // REMOVE
  ]
}
```

### 7. Search and Replace All Imports

**Fish:**

```fish
# Find all files importing from the submodule
rg "from ['\"]\.\/design-system" --files-with-matches

# Or with grep
grep -r "from './design-system" src/

# Find all CSS imports
rg "design-system.*\.css" --files-with-matches
```

**Bash/Zsh:**

```bash
# Find all files importing from the submodule
grep -r "from './design-system" src/

# Find all CSS imports
grep -r "design-system.*\.css" src/
```

Then update each file with the new imports.

### 8. Test Everything

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Type check
npm run type-check  # or tsc --noEmit

# Build
npm run build

# Run dev server
npm run dev

# Run tests
npm test
```

---

## Common Migration Patterns

### Pattern 1: Direct Component Imports

**Old:**

```typescript
import { Button } from './design-system/src/components/button/Button'
import { Card } from './design-system/src/components/card/Card'
```

**New:**

```typescript
import { Button, Card } from '@j2-health/design-system'
```

### Pattern 2: Type Imports

**Old:**

```typescript
import type { ButtonProps } from './design-system/src/components/button/Button'
```

**New:**

```typescript
import type { ButtonProps } from '@j2-health/design-system'
```

### Pattern 3: Multiple Imports

**Old:**

```typescript
import { Button } from './design-system/src/components/button'
import { Card } from './design-system/src/components/card'
import { Modal } from './design-system/src/components/modal'
import { Table } from './design-system/src/components/table'
import { Form } from './design-system/src/components/form'
```

**New:**

```typescript
import { Button, Card, Modal, Table, Form } from '@j2-health/design-system'
```

### Pattern 4: Icons

**Old:**

```typescript
import { Icon } from './design-system/src/components/icons'
```

**New:**

```typescript
import { icons } from '@j2-health/design-system'
// Use as: icons.IconName
```

---

## Benefits of Migration

✅ **Simpler imports** - One package instead of file paths  
✅ **Faster builds** - Pre-built, no need to transpile  
✅ **Version control** - Lock to specific versions  
✅ **Easier updates** - `npm update` instead of git submodule commands  
✅ **Better caching** - npm caches packages across projects  
✅ **Cleaner git** - No submodule commits in your history  
✅ **CI/CD friendly** - Just `npm ci`, no submodule init needed

---

## Rollback Plan

If something goes wrong during migration:

**Fish:**

```fish
# Temporarily add submodule back
git submodule add https://github.com/j2-health/design-system.git design-system-temp
git submodule update --init --recursive

# Keep npm package installed for gradual migration
# Switch imports one file at a time
```

**Bash/Zsh:**

```bash
# Same commands
git submodule add https://github.com/j2-health/design-system.git design-system-temp
git submodule update --init --recursive
```

---

## Verification Checklist

- [ ] `.npmrc` created with GitHub Packages config
- [ ] `GITHUB_TOKEN` environment variable set
- [ ] npm package installed: `npm list @j2-health/design-system`
- [ ] Submodule removed: `git submodule status` shows nothing
- [ ] All imports updated to use `@j2-health/design-system`
- [ ] CSS import updated to `@j2-health/design-system/dist/style.css`
- [ ] Build configuration cleaned up
- [ ] TypeScript compiles: `npm run type-check`
- [ ] Project builds: `npm run build`
- [ ] Tests pass: `npm test`
- [ ] Dev server runs: `npm run dev`

---

## Updating the Package

After migration, updating is simple:

**Check current version:**

```bash
npm list @j2-health/design-system
```

**Update to latest:**

```bash
npm update @j2-health/design-system
```

**Install specific version:**

```bash
npm install @j2-health/design-system@1.2.0
```

**Update package.json version range:**

```json
{
  "dependencies": {
    "@j2-health/design-system": "^1.2.0"  // Latest 1.x
    "@j2-health/design-system": "~1.2.0"  // Patch updates only
    "@j2-health/design-system": "1.2.0"   // Exact version
  }
}
```

---

## Need Help?

If you run into issues during migration:

1. **Check authentication:** `echo $GITHUB_TOKEN`
2. **Verify package access:** `npm view @j2-health/design-system`
3. **Check imports:** Look for remaining `./design-system` references
4. **Clear caches:**
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```

**For Fish-specific issues:** Make sure `GITHUB_TOKEN` is in your
`~/.config/fish/config.fish` if you want it permanent across sessions.
