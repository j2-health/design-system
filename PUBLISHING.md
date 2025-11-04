# Publishing Design System to GitHub Packages

This guide covers how to publish and consume the design-system package from
GitHub Packages.

## Prerequisites

1. **GitHub Personal Access Token (PAT)** with the following scopes:

   - `write:packages` - to publish packages
   - `read:packages` - to install packages
   - `repo` - for private repositories

   Create a PAT at: https://github.com/settings/tokens/new

2. **Update Configuration**
   - Replace `j2-health` in `package.json` with your actual GitHub organization
     or username
   - Replace `j2-health` in `.npmrc` with your actual GitHub organization or
     username

## Publishing the Package

### Option 1: Manual Publishing (Local)

1. **Set up authentication:**

   **Fish:**
   ```fish
   set -x GITHUB_TOKEN your_github_personal_access_token
   ```
   
   **Bash/Zsh:**
   ```bash
   export GITHUB_TOKEN=your_github_personal_access_token
   ```

2. **Build and publish:**
   ```bash
   npm run build:lib
   npm publish
   ```

### Option 2: Automated Publishing (CI/CD)

Create a GitHub Actions workflow (`.github/workflows/publish.yml`):

```yaml
name: Publish Package

on:
  release:
    types: [created]
  workflow_dispatch:
    inputs:
      version:
        description: 'Version bump type'
        required: true
        type: choice
        options:
          - patch
          - minor
          - major

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@j2-health'

      - name: Install dependencies
        run: npm ci

      - name: Bump version
        if: github.event_name == 'workflow_dispatch'
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          npm version ${{ github.event.inputs.version }}
          git push --follow-tags

      - name: Build package
        run: npm run build:lib

      - name: Publish to GitHub Packages
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Installing the Package in Other Projects

### 1. Configure the consuming project

Create or update `.npmrc` in the consuming project:

```
@j2-health:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 2. Authenticate

Set your GitHub token as an environment variable:

**Fish:**
```fish
set -x GITHUB_TOKEN your_github_personal_access_token

# Make it permanent
echo 'set -x GITHUB_TOKEN your_github_personal_access_token' >> ~/.config/fish/config.fish
```

**Bash/Zsh:**
```bash
export GITHUB_TOKEN=your_github_personal_access_token

# Make it permanent
echo 'export GITHUB_TOKEN=your_github_personal_access_token' >> ~/.bashrc
source ~/.bashrc
```

### 3. Install the package

```bash
npm install @j2-health/design-system
```

Or add to `package.json`:

```json
{
  "dependencies": {
    "@j2-health/design-system": "^1.0.0"
  }
}
```

### 4. Use in your project

```typescript
// Import components
import { Button, Card, Modal } from '@j2-health/design-system';

// Import styles
import '@j2-health/design-system/dist/style.css';

function App() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  );
}
```

## Version Management

To publish a new version:

1. **Update the version:**

   ```bash
   npm version patch  # 1.0.0 -> 1.0.1
   npm version minor  # 1.0.0 -> 1.1.0
   npm version major  # 1.0.0 -> 2.0.0
   ```

2. **Push tags to GitHub:**

   ```bash
   git push --follow-tags
   ```

3. **Publish:**
   ```bash
   npm publish
   ```

## Peer Dependencies

Note: The following are marked as peer dependencies and must be installed in
consuming projects:

- `react` (^18.3.1)
- `react-dom` (^18.3.1)

These won't be bundled with the design-system package.

## Troubleshooting

### Authentication Errors

If you get `401 Unauthorized`:

- Verify your `GITHUB_TOKEN` is set correctly: `echo $GITHUB_TOKEN`
- Ensure your token has `write:packages` and `read:packages` scopes
- Check that the package name in `package.json` matches your GitHub organization

### Module Not Found

If imports fail:

- Ensure you've imported the CSS:
  `import '@j2-health/design-system/dist/style.css'`
- Verify the package is installed: `npm list @j2-health/design-system`
- Clear node_modules and reinstall:
  `rm -rf node_modules package-lock.json && npm install`

### Build Errors

If the build fails:

- Run `npm run type-check` to identify TypeScript errors
- Ensure all dependencies are installed: `npm install`
- Check for circular dependencies in your components

## CI/CD Integration

For projects consuming this package in CI/CD:

1. **Add GitHub token as secret** in your CI/CD platform
2. **Set the environment variable** before npm install:
   ```bash
   export GITHUB_TOKEN=${{ secrets.GITHUB_TOKEN }}
   npm ci
   ```

### GitHub Actions Example

```yaml
- name: Install dependencies
  run: npm ci
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### GitLab CI Example

**Bash/Zsh:**
```yaml
install:
  script:
    - export GITHUB_TOKEN=$GITHUB_TOKEN
    - npm ci
```

**Fish:**
```yaml
install:
  script:
    - set -x GITHUB_TOKEN $GITHUB_TOKEN
    - npm ci
```

## Security Notes

- **Never commit your GitHub token** to version control
- Use `.npmrc` in `.gitignore` if it contains tokens (use environment variables
  instead)
- Rotate tokens periodically
- Use fine-grained tokens with minimal required scopes
