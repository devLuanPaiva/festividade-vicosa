export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'test',
        'docs',
        'chore',
        'ci',
        'build',
        'perf',
        'style',
        'revert',
      ],
    ],
    'header-max-length': [2, 'always', 72],
    'subject-case': [2, 'always', 'lower-case'],
    'body-max-line-length': [0],
  },
};
