const isVendored = (file) => file.includes('/.claude/') || file.includes('skills-lock.json');

const quote = (files) =>
  files
    .filter((file) => !isVendored(file))
    .map((file) => `"${file}"`)
    .join(' ');

const prettierCommand = (files) => {
  const targets = quote(files);
  return targets ? `prettier --write ${targets}` : [];
};

export default {
  'api/**/*.ts': (files) => [
    `npm --prefix api exec -- eslint --config api/eslint.config.mjs --no-warn-ignored --fix ${quote(files)}`,
    prettierCommand(files),
  ],
  'client/**/*.{ts,tsx,mts}': (files) => [
    `npm --prefix client exec -- eslint --config client/eslint.config.mjs --no-warn-ignored --fix ${quote(files)}`,
    prettierCommand(files),
  ],
  '*.{json,md,yml,yaml,mjs}': prettierCommand,
};
