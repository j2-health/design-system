# Peer Dependencies Update Summary

## What Changed (v1.0.0 → v1.1.0)

The design-system package structure has been updated to avoid dependency
duplication in consuming projects.

### Before

Dependencies were bundled with the package:

```json
{
  "dependencies": {
    "@phosphor-icons/react": "^2.1.7",
    "@types/lodash": "^4.17.14",
    "antd": "^5.21.2",
    "classnames": "^2.5.1",
    "formik": "^2.4.6",
    "lodash": "^4.17.21",
    "yup": "^1.4.0"
  }
}
```

### After

Common dependencies are now peer dependencies:

```json
{
  "peerDependencies": {
    "react": "^18.3.1 || ^19.0.0",
    "react-dom": "^18.3.1 || ^19.0.0",
    "antd": "^5.21.0",
    "formik": "^2.4.0",
    "yup": "^1.4.0",
    "lodash": "^4.17.0",
    "@phosphor-icons/react": "^2.1.0"
  },
  "dependencies": {
    "classnames": "^2.5.1",
    "formik-antd": "^3.0.0-beta.9",
    "highcharts": "^11.4.8",
    "highcharts-react-official": "^3.2.1"
  }
}
```

## Why This Change?

### Problems with the old approach:

- ❌ **Duplication**: Both design-system and consuming apps bundled the same
  packages
- ❌ **Multiple versions**: Could lead to two versions of React, antd, etc. in
  the same app
- ❌ **Larger bundles**: Duplicated code increased bundle size
- ❌ **Longer installs**: npm had to install dependencies twice

### Benefits of peer dependencies:

- ✅ **Single source of truth**: One version shared across your app and
  design-system
- ✅ **Smaller bundles**: No duplication
- ✅ **Faster installs**: Dependencies installed once
- ✅ **Version control**: Your app controls the versions
- ✅ **Better compatibility**: Ensures design-system uses your exact React/antd
  version

## Impact on Consuming Projects

### For Existing Consumers (like j2):

**Good news:** Your project already has all the peer dependencies!

Your `j2/package.json` already includes:

- ✅ `react` ^19.1.0 (supported by design-system)
- ✅ `antd` ^5.21.2
- ✅ `formik` ^2.4.6
- ✅ `lodash` ^4.17.21
- ✅ `yup` ^1.4.0
- ✅ `@phosphor-icons/react` ^2.1.7

**Action required:** Just update the design-system package:

```bash
npm update @j2-health/design-system
```

**Optional cleanup:** Remove duplicates from your package.json (see
[CLEANUP_CONSUMING_PROJECT.md](./CLEANUP_CONSUMING_PROJECT.md))

### For New Consumers:

When installing `@j2-health/design-system`, make sure your project has:

```json
{
  "dependencies": {
    "@j2-health/design-system": "^1.0.0",
    "react": "^18.3.1 || ^19.0.0",
    "react-dom": "^18.3.1 || ^19.0.0",
    "antd": "^5.21.0",
    "formik": "^2.4.0",
    "yup": "^1.4.0",
    "lodash": "^4.17.0",
    "@phosphor-icons/react": "^2.1.0"
  }
}
```

## What's Still Bundled?

These dependencies remain bundled with design-system because they're specific to
the design-system:

- `classnames` - Small utility, minimal impact
- `formik-antd` - Bridge library for formik + antd
- `highcharts` - Chart library
- `highcharts-react-official` - React wrapper for highcharts

## Version Compatibility

### React

- Supports **React 18** and **React 19**
- Your j2 project uses React 19, which is fully supported ✅

### Ant Design

- Requires **antd ^5.21.0**
- Your j2 project uses 5.21.2 ✅

### Other Dependencies

All other peer dependencies use minor version ranges (`^`), so any compatible
version works.

## Migration Guide

### Step 1: Update design-system

**Fish:**

```fish
cd /path/to/your/project
npm update @j2-health/design-system
```

**Bash/Zsh:**

```bash
cd /path/to/your/project
npm update @j2-health/design-system
```

### Step 2: Verify installation

```bash
npm install
```

If you see peer dependency warnings, check that you have all required packages.

### Step 3: (Optional) Clean up package.json

See [CLEANUP_CONSUMING_PROJECT.md](./CLEANUP_CONSUMING_PROJECT.md) for a
detailed guide on removing duplicates.

### Step 4: Test

```bash
npm run type-check
npm run build
npm test
```

## Troubleshooting

### Warning: peer dependency not installed

**Symptom:**

```
npm WARN @j2-health/design-system@1.0.0 requires a peer of antd@^5.21.0
```

**Solution:**

```bash
npm install antd@^5.21.0
```

### Error: Can't resolve 'lodash'

**Symptom:** Build fails with module resolution errors

**Solution:** Install missing peer dependencies:

```bash
npm install lodash formik yup @phosphor-icons/react
```

### Multiple React versions warning

**Symptom:**

```
Warning: Invalid hook call. Hooks can only be called inside of the body of a function component.
```

**Cause:** Multiple React versions in node_modules

**Solution:**

```bash
# Clear everything
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Verify single React version
npm ls react
```

## Publishing the Update

When you're ready to publish this change:

### Fish:

```fish
# Bump version
npm version minor  # 1.0.0 → 1.1.0

# Publish
npm publish

# Push tags
git push --follow-tags
```

### Bash/Zsh:

```bash
# Same commands
npm version minor
npm publish
git push --follow-tags
```

## Documentation Updates

Updated documentation to reflect peer dependencies:

- ✅ [README.md](./README.md) - Updated requirements section
- ✅ [PUBLISHING.md](./PUBLISHING.md) - Updated peer dependencies info
- ✅ [CLEANUP_CONSUMING_PROJECT.md](./CLEANUP_CONSUMING_PROJECT.md) - Guide for
  cleaning up consumer projects
- ✅ [package.json](./package.json) - Updated dependencies structure

## For Your j2 Project Specifically

Your j2 project is **already compatible**!

All you need to do:

```fish
cd /path/to/j2
npm update @j2-health/design-system
npm install
npm run build
```

Then optionally clean up duplicates using the
[CLEANUP_CONSUMING_PROJECT.md](./CLEANUP_CONSUMING_PROJECT.md) guide.

## Questions?

- **Does this break existing projects?** No, as long as they have the peer
  dependencies (which they should already have)
- **Do I need to change my imports?** No, imports remain the same
- **Will my bundle size decrease?** Yes, by removing duplication
- **Can I still use React 18?** Yes, both React 18 and 19 are supported
- **What if I don't have all peer deps?** npm will warn you, just install the
  missing ones
