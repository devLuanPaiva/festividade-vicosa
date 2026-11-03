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
    `npm --prefix api run lint:files -- ${quote(files)}`,
    prettierCommand(files),
  ],
  'client/**/*.{ts,tsx,mts}': (files) => [
    `npm --prefix client run lint:files -- ${quote(files)}`,
    prettierCommand(files),
  ],
  '*.{json,md,yml,yaml,mjs}': prettierCommand,
};
