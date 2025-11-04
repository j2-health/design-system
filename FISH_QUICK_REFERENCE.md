# Fish Shell Quick Reference for @j2-health/design-system

Quick commands for Fish shell users working with the design-system package.

## 🐟 Publishing (Design System Maintainers)

### Set Token
```fish
# One-time
set -x GITHUB_TOKEN ghp_your_token_here

# Permanent (add to config)
echo 'set -x GITHUB_TOKEN ghp_your_token_here' >> ~/.config/fish/config.fish
```

### Verify Token
```fish
echo $GITHUB_TOKEN
```

### Publish
```fish
# Build and publish
npm run build:lib
npm publish

# Or with version bump
npm version patch  # or minor, major
npm publish
git push --follow-tags
```

---

## 🐟 Installing (Project Consumers)

### Setup in Your Project
```fish
# Navigate to your project
cd /path/to/your/project

# Create .npmrc
echo '@j2-health:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}' > .npmrc

# Set token (if not already set)
set -x GITHUB_TOKEN your_token_here

# Install
npm install @j2-health/design-system
```

### Update Package
```fish
# Update to latest
npm update @j2-health/design-system

# Check current version
npm list @j2-health/design-system

# Install specific version
npm install @j2-health/design-system@1.2.0
```

---

## 🐟 Migrating from Submodule

### Remove Submodule
```fish
# Remove the submodule (assuming it's at ./design-system)
git submodule deinit -f design-system
git rm -f design-system
rm -rf .git/modules/design-system

# Commit
git commit -m "Migrate to npm package"
```

### Find Old Imports
```fish
# Find files importing from submodule
rg "from ['\"]\.\/design-system" --files-with-matches

# Or with grep
grep -r "from './design-system" src/

# Find CSS imports
rg "design-system.*\.css"
```

### Clean Install
```fish
# Remove everything
rm -rf node_modules package-lock.json

# Fresh install
npm install
```

---

## 🐟 Development

### Environment Check
```fish
# Check Node version
node --version

# Check npm version
npm --version

# Check if token is set
echo $GITHUB_TOKEN

# List environment variables with GITHUB in name
set -n | grep GITHUB
```

### Build Commands
```fish
# Build the library
npm run build:lib

# Type check
npm run type-check

# Run tests
npm test

# Lint
npm run lint

# Run Storybook
npm start
```

### Troubleshooting
```fish
# Check package access
npm view @j2-health/design-system

# Clear npm cache
npm cache clean --force

# Verify .npmrc exists
cat .npmrc

# Check if package is installed
npm list @j2-health/design-system
```

---

## 🐟 Fish-Specific Tips

### Persistent Environment Variables

Fish doesn't use `.bashrc` or `.zshrc`. Use `~/.config/fish/config.fish` instead:

```fish
# Add variable permanently
echo 'set -x GITHUB_TOKEN your_token' >> ~/.config/fish/config.fish

# Reload config
source ~/.config/fish/config.fish
```

### Universal Variables (Alternative)

Fish has "universal" variables that persist across all sessions:

```fish
# Set universal variable (persists automatically)
set -Ux GITHUB_TOKEN your_token

# Remove universal variable
set -e GITHUB_TOKEN
```

### Checking Variables

```fish
# Show all variables
set

# Show variables matching pattern
set -n | grep GITHUB

# Show specific variable
echo $GITHUB_TOKEN

# Check if variable is set
if set -q GITHUB_TOKEN
    echo "Token is set"
else
    echo "Token not set"
end
```

### Command Substitution

```fish
# Fish uses parentheses, not backticks or $()
set current_dir (pwd)
set node_version (node --version)
```

### Multiline Commands

```fish
# Use backslash for line continuation
npm install \
  @j2-health/design-system \
  react \
  react-dom
```

---

## 🐟 Complete Setup Script

Copy-paste this to set up everything at once:

```fish
#!/usr/bin/env fish

# Navigate to your project
cd /path/to/your/project

# Create .npmrc
echo '@j2-health:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}' > .npmrc

# Set token (replace with your actual token)
set -Ux GITHUB_TOKEN ghp_your_actual_token_here

# Install package
npm install @j2-health/design-system

# Verify installation
npm list @j2-health/design-system

echo "✅ Setup complete!"
```

---

## 🐟 Common Issues

### "401 Unauthorized"
```fish
# Check if token is set
echo $GITHUB_TOKEN

# Set it if missing
set -x GITHUB_TOKEN your_token

# Make permanent
set -Ux GITHUB_TOKEN your_token
```

### Package Not Found
```fish
# Verify .npmrc exists
cat .npmrc

# Check token format
echo $GITHUB_TOKEN | string sub -s 1 -l 4  # Should show "ghp_"

# Try with sudo (if permissions issue)
sudo npm install @j2-health/design-system
```

### Fish Config Not Loading
```fish
# Check config exists
test -f ~/.config/fish/config.fish; and echo "exists" or echo "missing"

# Create if missing
mkdir -p ~/.config/fish
touch ~/.config/fish/config.fish

# Edit config
vim ~/.config/fish/config.fish
# or
nano ~/.config/fish/config.fish
```

---

## 📚 More Resources

- **Migration Guide**: [MIGRATION_FROM_SUBMODULE.md](./MIGRATION_FROM_SUBMODULE.md)
- **Full Publishing Guide**: [PUBLISHING.md](./PUBLISHING.md)
- **Quick Start**: [QUICK_START.md](./QUICK_START.md)
- **Fish Documentation**: https://fishshell.com/docs/current/

