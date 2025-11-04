# Cleaning Up Your Consuming Project (j2)

After updating to the new version of `@j2-health/design-system` with peer
dependencies, you can remove duplicate dependencies from your project's
`package.json`.

## What Changed

The design-system now declares these as **peer dependencies** instead of
bundling them:

- `antd` ^5.21.0
- `formik` ^2.4.0
- `yup` ^1.4.0
- `lodash` ^4.17.0
- `@phosphor-icons/react` ^2.1.0
- `react` ^18.3.1 or ^19.0.0
- `react-dom` ^18.3.1 or ^19.0.0

This means:

- ✅ Your project keeps these dependencies (you already have them)
- ✅ No duplication - both your code and design-system use the same versions
- ✅ Smaller bundle size
- ✅ Faster installs

## For Your j2 Project

### Dependencies You Can Keep (Already Compatible)

Your `j2/package.json` already has all the peer dependencies with compatible
versions:

```json
{
  "dependencies": {
    "@phosphor-icons/react": "^2.1.7", // ✅ Compatible
    "antd": "^5.21.2", // ✅ Compatible
    "formik": "^2.4.6", // ✅ Compatible
    "lodash": "^4.17.21", // ✅ Compatible
    "react": "^19.1.0", // ✅ Compatible (React 19 supported)
    "react-dom": "^19.1.0", // ✅ Compatible
    "yup": "^1.4.0" // ✅ Compatible
  }
}
```

**You don't need to change anything!** The design-system will use these existing
installations.

### Optional: Dependencies You Could Remove

Since these are duplicated between your dependencies and devDependencies, you
could clean them up:

#### Already in dependencies, can remove from devDependencies:

```diff
  "devDependencies": {
-   "@types/react": "^19.1.2",           // Already in dependencies
-   "@types/react-dom": "^19.1.2",       // Already in dependencies
-   "@vitejs/plugin-react": "^4.4.1",    // Already in dependencies
-   "eslint-config-prettier": "^9.1.0",  // Already in dependencies
-   "eslint-plugin-import": "^2.31.0",   // Already in dependencies
-   "typescript": "~5.8.3",              // Already in dependencies (keep this one, newer version)
-   "vite": "^6.3.6",                    // Already in dependencies
  }
```

Actually, looking closer, you should keep different versions in dependencies vs
devDependencies for:

- `typescript` - Keep the devDependency version (5.8.3 is newer)
- `@types/react` & `@types/react-dom` - Keep devDependency versions (19.x
  matches your React 19)

### Recommended Cleanup

**Move to devDependencies** (build-time only):

```diff
  "dependencies": {
-   "@types/js-cookie": "^3.0.6",
-   "@types/lodash": "^4.17.14",
-   "@types/react": "^18.3.10",
-   "@types/react-dom": "^18.3.0",
-   "@vitejs/plugin-react": "^4.3.2",
-   "eslint-config-prettier": "^9.1.0",
-   "eslint-plugin-import": "^2.31.0",
-   "eslint-plugin-react": "^7.37.2",
-   "ts-node": "^10.9.2",
-   "typescript": "^5.5.3",
-   "vite": "^6.3.6",
-   "vite-plugin-svgr": "^4.3.0",
  },
  "devDependencies": {
+   "@types/js-cookie": "^3.0.6",
+   "@types/lodash": "^4.17.14",
    // Keep the React 19 types in devDependencies
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
+   "@vitejs/plugin-react": "^4.4.1",
    // ... rest of devDependencies
  }
```

**Remove duplicates** (keep the devDependency version):

```diff
  "dependencies": {
-   "eslint-config-prettier": "^9.1.0",
-   "eslint-plugin-import": "^2.31.0",
-   "eslint-plugin-react": "^7.37.2",
-   "typescript": "^5.5.3",  // Remove old version, keep ~5.8.3 in devDeps
-   "vite": "^6.3.6",        // Duplicate
  }
```

## Step-by-Step Migration

### 1. Update Design System

**Fish:**

```fish
cd /path/to/j2
npm update @j2-health/design-system
```

**Bash/Zsh:**

```bash
cd /path/to/j2
npm update @j2-health/design-system
```

### 2. Verify Peer Dependencies

Check that npm doesn't complain about missing peer dependencies:

```bash
npm install
```

You should see no warnings about peer dependencies since you already have them
all!

### 3. (Optional) Clean Up package.json

Edit your `j2/package.json` manually or use this script:

**Clean up script (Fish):**

```fish
#!/usr/bin/env fish

# Navigate to your project
cd /path/to/j2

# Backup your package.json
cp package.json package.json.backup

# Now manually edit package.json to:
# 1. Move @types/* to devDependencies
# 2. Remove duplicates between dependencies and devDependencies
# 3. Keep the newer versions

# After editing, reinstall
rm -rf node_modules package-lock.json
npm install

# Build to verify everything works
npm run build
```

### 4. Test Everything

```bash
# Type check
npm run type-check

# Build
npm run build

# Run tests
npm test

# Run dev server
npm run dev
```

## Final j2/package.json Structure

Here's what your cleaned-up `package.json` should look like:

```json
{
  "dependencies": {
    "@amplitude/analytics-browser": "^2.23.5",
    "@amplitude/plugin-session-replay-browser": "^1.22.10",
    "@auth0/auth0-react": "^2.3.0",
    "@j2-health/design-system": "^1.0.0",
    "@phosphor-icons/react": "^2.1.7",
    "@sentry/react": "^9.28.1",
    "@sentry/types": "^9.28.1",
    "@sentry/vite-plugin": "^3.5.0",
    "@tanstack/react-query": "^5.59.15",
    "@tanstack/react-query-devtools": "^5.62.7",
    "antd": "^5.21.2",
    "axios": "^1.12.0",
    "classnames": "^2.5.1",
    "formik": "^2.4.6",
    "js-cookie": "^3.0.5",
    "launchdarkly-react-client-sdk": "^3.8.1",
    "lodash": "^4.17.21",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^6.26.2",
    "yup": "^1.4.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.25.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/js-cookie": "^3.0.6",
    "@types/lodash": "^4.17.14",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^4.4.1",
    "@vitest/ui": "^3.2.3",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.25.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^16.0.0",
    "jsdom": "^26.1.0",
    "nock": "^13.5.5",
    "postcss": "^8.5.4",
    "prettier": "^3.5.3",
    "rollup-plugin-visualizer": "^5.12.0",
    "tailwindcss": "^3.4.17",
    "terser": "^5.36.1",
    "ts-node": "^10.9.2",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.30.1",
    "vite": "^6.3.6",
    "vite-plugin-compression": "^0.5.1",
    "vite-plugin-imagemin": "^0.6.1",
    "vite-plugin-svgr": "^4.3.0",
    "vitest": "^3.2.3"
  }
}
```

**Key changes:**

- ✅ Removed `package-lock.json` from dependencies (that was weird!)
- ✅ Moved type definitions to devDependencies
- ✅ Removed build tool duplicates
- ✅ Kept the newer TypeScript version (5.8.3)
- ✅ Kept React 19 type definitions

## Benefits

After cleanup:

- 🎯 **Clearer separation** between runtime and dev dependencies
- 📦 **No duplication** of shared libraries
- ⚡ **Faster installs** with fewer packages
- 🔒 **Version consistency** between your code and design-system
- 🧹 **Cleaner package.json**

## Troubleshooting

### Peer Dependency Warnings

If you see warnings like:

```
npm WARN @j2-health/design-system@1.0.0 requires a peer of antd@^5.21.0 but none is installed.
```

**Solution:** You already have it! This shouldn't happen, but if it does, just
verify:

```bash
npm list antd
```

### Version Conflicts

If you see:

```
npm ERR! peer dep missing: antd@^5.21.0, required by @j2-health/design-system@1.0.0
```

**Solution:** Your version (`5.21.2`) is compatible! Just make sure it's in
`dependencies`, not `devDependencies`.

### Build Errors After Cleanup

If your build fails after cleanup:

```bash
# Restore backup
cp package.json.backup package.json

# Clean install
rm -rf node_modules package-lock.json
npm install

# Try again, change one thing at a time
```

## Need Help?

If you run into issues:

1. Check your `package-lock.json` is up to date: `npm install`
2. Verify peer deps: `npm ls @j2-health/design-system`
3. Clear caches: `rm -rf node_modules package-lock.json && npm install`
4. Restore backup: `cp package.json.backup package.json`
