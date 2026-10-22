import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import noComments from 'eslint-plugin-no-comments';
import sonarjs from 'eslint-plugin-sonarjs';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  sonarjs.configs.recommended,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts']),
  {
    plugins: { 'no-comments': noComments },
    rules: {
      'no-comments/disallowComments': 'error',
      'max-lines': ['error', { max: 200, skipBlankLines: true }],
      'max-lines-per-function': ['error', { max: 60, skipBlankLines: true, IIFEs: true }],
      'max-params': ['error', 3],
      'max-depth': ['error', 2],
      complexity: ['error', 6],
      'no-console': 'error',
      'no-nested-ternary': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'vitest.setup.ts'],
    rules: {
      'max-lines-per-function': 'off',
      'sonarjs/no-duplicate-string': 'off',
    },
  },
]);

export default eslintConfig;
