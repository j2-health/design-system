// @ts-check

import js from '@eslint/js'
import { fixupConfigRules } from '@eslint/compat'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import eslintConfigPrettier from 'eslint-config-prettier'

// eslint-disable-next-line no-restricted-exports
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { ignores: ['**/*.stories.{ts,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  { settings: { react: { version: 'detect' } } },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // React's plugin still uses context methods removed in ESLint 10. Remove
  // this adapter and the eslint-plugin-react override in package.json when it
  // supports ESLint 10 natively.
  ...fixupConfigRules([
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat['jsx-runtime'],
  ]),
  eslintConfigPrettier,
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Replaces eslint-plugin-import's import/no-default-export. That plugin
      // has no release accepting ESLint 10; this built-in rule covers the same
      // ban and removes the dependency.
      'no-restricted-exports': [
        'error',
        {
          restrictDefaultExports: {
            direct: true,
            named: true,
            defaultFrom: true,
            namedFrom: true,
          },
        },
      ],
      'react/prop-types': 'off',
      'react/display-name': 'off',
    },
  },
]
