# Quick Start - j2-health Design System

Your design-system is **configured and ready to publish** to GitHub Packages! ✅

> **🐟 Fish shell user?** This guide includes Fish commands. Also see [FISH_QUICK_REFERENCE.md](./FISH_QUICK_REFERENCE.md) for more.
> 
> **📦 Migrating from submodule?** See [MIGRATION_FROM_SUBMODULE.md](./MIGRATION_FROM_SUBMODULE.md) for step-by-step guide.

## 📦 Package Details

- **Package Name**: `@j2-health/design-system`
- **Version**: `1.0.0`
- **Registry**: GitHub Packages (npm.pkg.github.com)
- **Repository**: https://github.com/j2-health/design-system

## 🚀 To Publish (First Time)

### 1. Get Your GitHub Token

If you don't have one yet:

1. Go to: https://github.com/settings/tokens/new
2. Token name: `j2-health-packages`
3. Select scopes:
   - ✅ `write:packages`
   - ✅ `read:packages`
   - ✅ `repo`
4. Generate and copy the token

### 2. Set Environment Variable

**Fish shell:**
```fish
set -x GITHUB_TOKEN ghp_your_token_here
```

To make it permanent, add to `~/.config/fish/config.fish`:
```fish
echo 'set -x GITHUB_TOKEN ghp_your_token_here' >> ~/.config/fish/config.fish
```

**Bash/Zsh:**
```bash
export GITHUB_TOKEN=ghp_your_token_here
echo 'export GITHUB_TOKEN=ghp_your_token_here' >> ~/.zshrc
source ~/.zshrc
```

### 3. Publish

```bash
npm publish
```

That's it! Your package will be available at:
`https://github.com/orgs/j2-health/packages/npm/package/design-system`

## 📥 To Install in Other Projects

### In any j2-health project:

1. **Create `.npmrc` in project root:**

```
@j2-health:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

2. **Install:**

```bash
npm install @j2-health/design-system
```

3. **Use in code:**

```typescript
import { Button, Card, Modal, Table } from '@j2-health/design-system';
import '@j2-health/design-system/dist/style.css';

function App() {
  return (
    <Card>
      <Button type="primary">Hello from Design System!</Button>
    </Card>
  );
}
```

## 🔄 Publishing Updates

When you make changes:

```bash
# Patch version (1.0.0 → 1.0.1) - bug fixes
npm version patch

# Minor version (1.0.0 → 1.1.0) - new features
npm version minor

# Major version (1.0.0 → 2.0.0) - breaking changes
npm version major

# Publish (automatically builds via prepublishOnly hook)
npm publish

# Push tags
git push --follow-tags
```

## ✅ What's Included

The build creates:

- **ES Module** (`design-system.es.js`) - 8.5 MB
- **UMD Module** (`design-system.umd.js`) - 6.9 MB
- **Styles** (`style.css`) - 17 KB
- **TypeScript Definitions** (`index.d.ts` + type declarations)

## 🎯 Available Components

All your components are exported and ready to use:

- Layout: Card, Drawer, Modal, Collapse
- Navigation: NavMenu, Breadcrumb, Tabs, Steps
- Forms: Input, InputNumber, Select, Checkbox, Radio, Switch, Form
- Data: Table, Tag, Tooltip, Skeleton
- Feedback: Alert, Message, Notification, Spinner, Rate
- Charts: BarChart, VennDiagram
- Utilities: Button, Dropdown, Popover, Icons

## 🔧 Development Commands

```bash
npm start              # Run Storybook
npm run build:lib      # Build library
npm test               # Run tests
npm run type-check     # Check TypeScript
npm run lint           # Lint code
```

## 📚 More Help

- **Full Guide**: [PUBLISHING.md](./PUBLISHING.md)
- **Checklist**: [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)
- **Technical Details**:
  [GITHUB_PACKAGES_SETUP_SUMMARY.md](./GITHUB_PACKAGES_SETUP_SUMMARY.md)

---

**Next Step**: Get your GitHub token and run `npm publish`! 🎉
