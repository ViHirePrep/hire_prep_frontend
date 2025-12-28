import eslint from '@eslint/js'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import nextPlugin from '@next/eslint-plugin-next'

export default tseslint.config(
  {
    ignores: ['.next/**', '**/*config.js', '**/*config.mjs', 'out/**', 'build/**', 'next-env.d.ts'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      import: importPlugin,
      prettier: eslintPluginPrettier,
      react: reactPlugin,
      '@next/next': nextPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          semi: true,
          singleQuote: true,
          endOfLine: 'auto',
          tabWidth: 4,
          trailingComma: 'all',
        },
      ],
      'no-useless-call': 'error',
      eqeqeq: 'error',
      'no-restricted-syntax': 'off',
      'max-len': [
        'error',
        {
          code: 128,
          ignoreUrls: true,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'import/newline-after-import': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      'newline-before-return': 'error',
      'newline-after-var': ['error', 'always'],
      'import/no-duplicates': [
        'error',
        {
          considerQueryString: true,
        },
      ],
      'import/named': 'off',
      'import/order': [
        'error',
        {
          groups: ['external', 'builtin', 'index', 'sibling', 'parent', 'internal'],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'next'],
          'newlines-between': 'always',
        },
      ],
      'no-console': 'error',
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],
      'no-alert': 'error',
      'import/no-unresolved': 'error',
      'import/no-anonymous-default-export': 'off',
    },
  },
)
