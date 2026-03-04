import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  js.configs.recommended,
  pluginReact.configs.flat.recommended,

  // Backend (Node)
  {
    files: ['index.js', 'models/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    }
  },
  // Frontend (React)
  {
    files: ['src/**/*.js', 'src/**/*.jsx'],
    languageOptions: {
      sourceType: 'module',
      globals: { ...globals.browser },
      ecmaVersion: 'latest',
    },
    settings: {
      react: { version: 'detect' }
    }
  },
  // Stylistic plugin JS
  {
    plugins: { '@stylistic/js': stylisticJs },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    }
  },

  { ignores: ['dist/**'] },
])