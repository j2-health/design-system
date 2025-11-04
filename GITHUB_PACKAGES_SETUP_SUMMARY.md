# GitHub Packages Setup - Complete Summary

This document summarizes the changes made to configure your design-system as a
private npm package for GitHub Packages.

## What Was Changed

### 1. **package.json** - Updated for Library Publishing

- Changed name to scoped package: `@j2-health/design-system`
- Removed `"private": true` (packages must be public to npm, but can be on
  private GitHub repos)
- Updated version to `1.0.0`
- Added entry points: `main`, `module`, `types`, `exports`
- Added `files` field to include only `dist/` in published package
- Added `publishConfig` pointing to GitHub Packages registry
- Added `repository` field
- Added `peerDependencies` for React and React-DOM
- Moved build tools to `devDependencies`
- Added `prepublishOnly` script to auto-build before publishing
- Added `build:lib` script

### 2. **vite.config.ts** - Configured for Library Mode

- Added `vite-plugin-dts` for TypeScript declaration generation
- Configured `build.lib` mode with proper entry point
- Set up UMD and ES module formats
- Externalized React dependencies (won't be bundled)
- Added proper globals for UMD builds

### 3. **tsconfig.json** - TypeScript Configuration

- Enabled `declaration` and `declarationMap` for type definitions
- Set `emitDeclarationOnly: true`
- Added `outDir: "./dist"`
- Updated `include` to cover both `src` and `index.tsx`

### 4. **New Files Created**

- **`.npmrc`** - Local authentication configuration
- **`.npmrc.example`** - Template for other developers
- **`PUBLISHING.md`** - Comprehensive publishing and installation guide
- **`SETUP_CHECKLIST.md`** - Step-by-step checklist
- **`.github/workflows/publish.yml`** - Automated publishing workflow
- **`GITHUB_PACKAGES_SETUP_SUMMARY.md`** - This file

### 5. **README.md** - Updated Documentation

- Added installation instructions for consumers
- Added publishing instructions for maintainers
- Listed all available components
- Added tech stack information
- Updated development setup instructions

### 6. **Dependencies**

- Installed `vite-plugin-dts` for TypeScript declarations

## What You Need to Do Next

### Immediate Actions (Required)

1. **Replace `j2-health` everywhere**

   Run this command to see where it needs to be replaced:

   ```bash
   grep -r "j2-health" --include="*.json" --include="*.md" --include="*.yml" --include=".npmrc" .
   ```

   Replace with your actual GitHub username or organization name in:

   - `package.json` (2 places)
   - `.npmrc`
   - `.github/workflows/publish.yml`
   - All `.md` documentation files

2. **Create a GitHub Personal Access Token**

   - Go to: https://github.com/settings/tokens/new
   - Scopes needed: `write:packages`, `read:packages`, `repo`
   - Save the token securely
   - Export it: `export GITHUB_TOKEN=your_token`

3. **Test the Build**

   ```bash
   npm install
   npm run build:lib
   ```

   Check that `dist/` folder is created with all files.

4. **Publish Your First Version**

   ```bash
   npm run build:lib
   npm publish
   ```

### For Installing in Other Projects

Each project that needs to use this design-system must:

1. Create `.npmrc` with GitHub Packages configuration
2. Set `GITHUB_TOKEN` environment variable
3. Run `npm install @j2-health/design-system`
4. Import components and styles

See `PUBLISHING.md` for detailed instructions.

## Architecture Overview

### Build Output Structure

```
dist/
├── design-system.es.js      # ES Module format
├── design-system.umd.js     # UMD format (for browser <script>)
├── style.css                # All component styles
├── index.d.ts               # TypeScript type definitions
└── index.d.ts.map           # Source map for types
```

### Package Entry Points

- **ES Modules**: `import { Button } from '@YOUR_ORG/design-system'`
- **CommonJS**: `const { Button } = require('@YOUR_ORG/design-system')`
- **Styles**: `import '@YOUR_ORG/design-system/dist/style.css'`

### Dependencies Structure

- **dependencies**: Bundled with the package (antd, lodash, etc.)
- **peerDependencies**: Must be installed by consumers (react, react-dom)
- **devDependencies**: Only for development (vite, typescript, storybook, etc.)

## Publishing Workflow

### Manual Workflow

```bash
# 1. Update version
npm version patch  # or minor, major

# 2. Build (happens automatically via prepublishOnly)
npm run build:lib

# 3. Publish
npm publish

# 4. Push tags
git push --follow-tags
```

### Automated Workflow (GitHub Actions)

1. Push code to GitHub
2. Go to Actions → "Publish Package"
3. Click "Run workflow"
4. Select version bump type
5. Workflow will build, test, and publish automatically

## Version Management

Follow semantic versioning:

- **Patch** (`1.0.0` → `1.0.1`): Bug fixes, minor changes
- **Minor** (`1.0.0` → `1.1.0`): New features, backward compatible
- **Major** (`1.0.0` → `2.0.0`): Breaking changes

## Troubleshooting

### Build Issues

**Error: Cannot find module 'vite-plugin-dts'**

```bash
npm install
```

**TypeScript errors during build**

```bash
npm run type-check  # Shows all type errors
# Fix errors, then rebuild
```

### Publishing Issues

**Error: 401 Unauthorized**

- Check `GITHUB_TOKEN` is set: `echo $GITHUB_TOKEN`
- Verify token has `write:packages` scope
- Check `.npmrc` is configured correctly

**Error: Package already exists**

- You can't republish the same version
- Bump version first: `npm version patch`

### Installation Issues (in consuming projects)

**Error: 404 Not Found**

- Verify package name matches exactly
- Check `.npmrc` points to correct registry
- Ensure `GITHUB_TOKEN` is set in consuming project

**Error: Module not found**

- Install peer dependencies: `npm install react react-dom`
- Import CSS file: `import '@YOUR_ORG/design-system/dist/style.css'`

## Next Steps for Production

1. **Set up CI/CD integration**

   - Use the GitHub Actions workflow for automated releases
   - Configure branch protection rules

2. **Document component APIs**

   - Keep Storybook up to date
   - Consider publishing Storybook to GitHub Pages

3. **Establish release process**

   - Create release branches
   - Write changelogs
   - Tag releases properly

4. **Monitor package usage**
   - Check GitHub Packages insights
   - Gather feedback from consuming teams
   - Track which versions are being used

## Resources

- **Internal Documentation**

  - [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) - Quick setup guide
  - [PUBLISHING.md](./PUBLISHING.md) - Detailed publishing instructions
  - [README.md](./README.md) - General project information

- **External Documentation**
  - [GitHub Packages Docs](https://docs.github.com/en/packages)
  - [Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode)
  - [npm Scoped Packages](https://docs.npmjs.com/cli/v9/using-npm/scope)

## Summary

Your design-system is now configured to be published as a private npm package to
GitHub Packages! The setup includes:

✅ Proper package configuration with scoped naming ✅ Vite library build
configuration ✅ TypeScript declaration generation ✅ Automated publishing
workflow ✅ Comprehensive documentation ✅ Proper dependency management (peer
dependencies) ✅ Authentication setup with .npmrc

Just replace `j2-health` with your actual org name and you're ready to publish!
