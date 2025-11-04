# Setup Checklist for Publishing to GitHub Packages

Use this checklist to configure your design-system for GitHub Packages.

## ✅ Pre-Publishing Setup (Do These Once)

### 1. Update Package Configuration

- [ ] **Replace `j2-health` in the following files:**

  - [ ] `package.json` - line 2 (name field)
  - [ ] `package.json` - line 24 (repository URL)
  - [ ] `.npmrc` - line 1
  - [ ] `.github/workflows/publish.yml` - line 23
  - [ ] `README.md` - all occurrences
  - [ ] `PUBLISHING.md` - all occurrences
  - [ ] `.npmrc.example` - line 4

  **Find your GitHub org:** This is your GitHub username or organization name
  (e.g., `octocat` or `my-company`)

### 2. Create GitHub Personal Access Token

- [ ] Go to https://github.com/settings/tokens/new
- [ ] Select scopes:
  - [x] `write:packages` - to publish packages
  - [x] `read:packages` - to install packages
  - [x] `repo` - for private repositories
- [ ] Generate token and save it securely
- [ ] Export token in your terminal:

  **Fish:**

  ```fish
  set -x GITHUB_TOKEN your_github_personal_access_token
  ```

  **Bash/Zsh:**

  ```bash
  export GITHUB_TOKEN=your_github_personal_access_token
  ```

### 3. Test Build Locally

- [ ] Install dependencies:

  ```bash
  npm install
  ```

- [ ] Run type check:

  ```bash
  npm run type-check
  ```

- [ ] Run tests:

  ```bash
  npm test
  ```

- [ ] Build the library:

  ```bash
  npm run build:lib
  ```

- [ ] Verify `dist/` folder was created with:
  - `design-system.es.js`
  - `design-system.umd.js`
  - `style.css`
  - `index.d.ts` (TypeScript declarations)

## 🚀 Publishing (Do This for Each Release)

### Option A: Manual Publishing

1. [ ] Update version:

   ```bash
   npm version patch  # or minor, major
   ```

2. [ ] Build:

   ```bash
   npm run build:lib
   ```

3. [ ] Publish:

   ```bash
   npm publish
   ```

4. [ ] Push tags:
   ```bash
   git push --follow-tags
   ```

### Option B: Automated Publishing via GitHub Actions

1. [ ] Push your code to GitHub
2. [ ] Go to Actions tab in your GitHub repo
3. [ ] Run "Publish Package" workflow manually
4. [ ] Select version bump type (patch/minor/major)

## 📦 Installing in Other Projects

### For Each Consuming Project:

1. [ ] Create `.npmrc` in project root:

   ```
   @j2-health:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

2. [ ] Set environment variable (if not already set):

   **Fish:**

   ```fish
   set -x GITHUB_TOKEN your_github_personal_access_token
   ```

   **Bash/Zsh:**

   ```bash
   export GITHUB_TOKEN=your_github_personal_access_token
   ```

3. [ ] Install the package:

   ```bash
   npm install @j2-health/design-system
   ```

4. [ ] Import in your code:
   ```typescript
   import { Button, Card } from '@j2-health/design-system'
   import '@j2-health/design-system/dist/style.css'
   ```

## 🔍 Verification

After publishing, verify it worked:

- [ ] Go to `https://github.com/j2-health/design-system/packages`
- [ ] You should see your package listed
- [ ] Try installing it in a test project

## 📝 Common Issues

**Problem:** `401 Unauthorized` when publishing

- **Solution:** Check that `GITHUB_TOKEN` is set (`echo $GITHUB_TOKEN`) and has
  `write:packages` scope

**Problem:** Package not found when installing

- **Solution:** Verify the package name matches exactly (including `@j2-health/`
  prefix)

**Problem:** Build fails with TypeScript errors

- **Solution:** Run `npm run type-check` to see errors, fix them, then rebuild

**Problem:** Styles not working in consuming app

- **Solution:** Make sure you imported the CSS file:
  `import '@j2-health/design-system/dist/style.css'`

## 📚 Additional Resources

- Full publishing guide: [PUBLISHING.md](./PUBLISHING.md)
- Project README: [README.md](./README.md)
- GitHub Packages docs: https://docs.github.com/en/packages
