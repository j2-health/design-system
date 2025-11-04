# Design System

A comprehensive React component library built with TypeScript, Ant Design, and
Tailwind CSS. Published to GitHub Packages for easy installation across
projects.

## Installation

### For Consumers (Using the Package)

1. **Configure npm to use GitHub Packages:**

   Create or update `.npmrc` in your project root:

   ```
   @j2-health:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

2. **Set your GitHub token:**

   ```bash
   export GITHUB_TOKEN=your_github_personal_access_token
   ```

   Create a token with `read:packages` scope at:
   https://github.com/settings/tokens/new

3. **Install the package:**

   ```bash
   npm install @j2-health/design-system
   ```

4. **Use in your application:**

   ```typescript
   import { Button, Card, Modal } from '@j2-health/design-system';
   import '@j2-health/design-system/dist/style.css';

   function App() {
     return <Button>Hello World</Button>;
   }
   ```

For detailed installation and usage instructions, see
[PUBLISHING.md](./PUBLISHING.md).

**🐟 Fish shell users:** See
[FISH_QUICK_REFERENCE.md](./FISH_QUICK_REFERENCE.md) for Fish-specific commands.

**📦 Migrating from submodule?** See
[MIGRATION_FROM_SUBMODULE.md](./MIGRATION_FROM_SUBMODULE.md).

## Contributing

### Development Setup

Make sure to install our pre-commit hooks. They are also verified by CI, but if
you want to be notified early of linting or type errors, you have to install
`pre-commit` and run its install step. To do this, run the following:

```bash
$ PIP_REQUIRE_VIRTUALENV=false pip install pre-commit
$ pre-commit install
```

### Local Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/j2-health/design-system.git
   cd design-system
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run Storybook:**
   ```bash
   npm start
   ```
   This will start Storybook on http://localhost:6006

### Available Scripts

- `npm start` - Run Storybook for component development
- `npm run build:lib` - Build the library for publishing
- `npm test` - Run tests
- `npm run lint` - Lint the codebase
- `npm run type-check` - Type check without emitting files

### Building for Production

To build the library:

```bash
npm run build:lib
```

This will generate the distributable files in the `dist/` directory.

### Publishing

See [PUBLISHING.md](./PUBLISHING.md) for detailed instructions on publishing new
versions to GitHub Packages.

Quick publish:

```bash
npm version patch  # or minor, major
npm run build:lib
npm publish
```

## Components

This design system includes:

- **Layout**: Card, Drawer, Modal, Collapse
- **Navigation**: NavMenu, Breadcrumb, Tabs, Steps
- **Forms**: Input, InputNumber, Select, Checkbox, Radio, Switch, Form
- **Data Display**: Table, Tag, Tooltip, Skeleton
- **Feedback**: Alert, Message, Notification, Spinner, Rate
- **Data Visualization**: BarChart, VennDiagram
- **Utilities**: Button, Dropdown, Popover, Icons

## Tech Stack

- **React** 18.3+
- **TypeScript** 5.5+
- **Ant Design** 5.21+
- **Tailwind CSS** 3.4+
- **Vite** for building
- **Storybook** for component documentation

## Requirements

Consuming projects must have these peer dependencies installed:

- `react` ^18.3.1 or ^19.0.0
- `react-dom` ^18.3.1 or ^19.0.0
- `antd` ^5.21.0
- `formik` ^2.4.0
- `yup` ^1.4.0
- `lodash` ^4.17.0
- `@phosphor-icons/react` ^2.1.0

These are not bundled with the design-system to avoid duplication in your
projects.
