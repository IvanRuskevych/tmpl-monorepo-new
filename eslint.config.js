// Base ESLint config for monorepo using Flat Config
import js from '@eslint/js'; // ESLint's base JavaScript rules
import prettierConfig from 'eslint-config-prettier'; // Turns off conflicting ESLint formatting rules
import prettierPlugin from 'eslint-plugin-prettier'; // Integrates Prettier with ESLint
import reactHooks from 'eslint-plugin-react-hooks'; // React Hooks linting rules
import reactRefresh from 'eslint-plugin-react-refresh'; // Vite HMR safety rules for React
import globals from 'globals'; // Global variable definitions for Node.js and Browser
import path from 'path'; // Utility for file paths
import tseslint from 'typescript-eslint'; // TypeScript ESLint integration
import { fileURLToPath } from 'url'; // Needed to resolve current file path

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config([
  // 1. Global ignores — prevent linting of build and generated files
  // замість globalIgnores(['dist']), у монорепо слід використовувати ignores:[]
  {
    ignores: [
      // "packages/**/dist",         // Ignore dist folders in any package
      // "packages/**/dist/**",      // And their contents
      // "packages/**/build",
      // "packages/**/build/**",
      // "packages/**/generated",    // Ignore generated code (e.g. GraphQL types)
      // "packages/**/generated/**", // And their contents
      '**/.idea/**', // Ignore WebStorm/IntelliJ project config
      '**/node_modules/**', // Ignore dependencies
      '**/dist/**', // Ignore compiled output
      '**/build/**', // Ignore build folders
      '**/generated/**', // Ignore generated files (e.g. GraphQL types)
    ],
  },

  // 2. Main linting configuration for TypeScript + React
  {
    // files: ['**/*.{ts,tsx}'],
    files: ['packages/**/*.{ts,tsx}'], // Apply only to TS/TSX files in all packages
    plugins: {
      prettier: prettierPlugin, // Register Prettier plugin
    },

    extends: [
      js.configs.recommended, // Base ESLint rules
      tseslint.configs.recommended, // TypeScript-specific rules
      reactHooks.configs['recommended-latest'], // React Hooks rules (rules-of-hooks, exhaustive-deps)
      reactRefresh.configs.vite, // Vite HMR compatibility checks
      prettierConfig, // Disable conflicting formatting rules
    ],

    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020, // Modern ECMAScript features (optional chaining, nullish coalescing, etc.)
        sourceType: 'module', // Enable ES module syntax
        project: ['./packages/frontend/tsconfig.eslint.json', './packages/backend/tsconfig.eslint.json'], // Use project-based type-aware linting
        // tsconfigRootDir: path.resolve(__dirname), // Important for resolving paths in monorepo
        tsconfigRootDir: path.resolve(path.dirname(fileURLToPath(import.meta.url))), // Important for resolving paths in monorepo
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
      },

      // globals: globals.browser,
      globals: {
        ...globals.browser, // Allow browser globals like `window`, `document`
        ...globals.node, // Allow Node.js globals like `process`, `__dirname`
      },
    },

    rules: {
      // ────────────────
      // TypeScript Rules
      // ────────────────

      // Disallow usage of 'any' to maintain type safety.
      '@typescript-eslint/no-explicit-any': 'error',

      // Allow unused variables only if prefixed with `_` (e.g. `_unused`).
      // Useful for intentionally unused args in functions.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // Allow unused function args if they start with _
          varsIgnorePattern: '^_', // Allow unused variables if they start with _
          caughtErrorsIgnorePattern: '^_', // Same for caught errors in try/catch
        },
      ],

      // Disable base JS rule (not type-aware) in favor of TS-aware version above.
      'no-unused-vars': 'off',

      // Allow interfaces without 'I' prefix (e.g. `User` instead of `IUser`).
      // "@typescript-eslint/interface-name-prefix": "off", // old rule, not needed

      // Disable enforcing explicit return types on exported functions.
      // Recommended for faster prototyping and less verbosity in small teams.
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Enforce return types on all functions. Enable if you want stricter boundaries.
      // "@typescript-eslint/explicit-function-return-type": ["error"],

      // ────────────────
      // React + React Hooks Rules
      // ────────────────

      // React 17+ with Vite does not require `import React` for JSX usage.
      'react/react-in-jsx-scope': 'off',

      // Enforce the Rules of Hooks — hooks must be used at the top level of a function component.
      'react-hooks/rules-of-hooks': 'error',

      // Warn when dependencies in `useEffect`, `useCallback`, etc. are missing.
      'react-hooks/exhaustive-deps': 'warn',

      // ────────────────
      // Formatting & Style Rules
      // ────────────────

      // Enforce single quotes unless escaping is cleaner
      quotes: ['error', 'single', { avoidEscape: true }],

      // --- Prettier formatting as ESLint rule ---
      'prettier/prettier': 'warn', // Show Prettier formatting issues as ESLint warnings
    },
  },
]);
