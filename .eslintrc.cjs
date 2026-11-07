/**
 * ESLint con @vercel/style-guide 6.0.0 (archivado; versión fijada). Requiere ESLint 8.
 * @next/eslint-plugin-next se fija en 14.x por el peer range del style guide; las reglas
 * de Next 14 siguen siendo válidas para el App Router de Next 15.
 */
const project = require('node:path').resolve(__dirname, 'tsconfig.json');

module.exports = {
  root: true,
  extends: [
    require.resolve('@vercel/style-guide/eslint/browser'),
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/react'),
    require.resolve('@vercel/style-guide/eslint/next'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
  ],
  parserOptions: { project },
  settings: { 'import/resolver': { typescript: { project } } },
  ignorePatterns: ['node_modules/', '.next/', '.claude/', 'demo/', '.qa/', '*.cjs', '*.mjs', 'next-env.d.ts'],
  rules: {
    'import/no-default-export': 'off',
    'unicorn/filename-case': 'off',
    'react/function-component-definition': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // Ajustes habituales en proyectos React: números en template literals y handlers async en JSX.
    '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
  },
  overrides: [
    {
      files: ['tests/unit/**/*.ts'],
      extends: [require.resolve('@vercel/style-guide/eslint/vitest')],
    },
  ],
};
