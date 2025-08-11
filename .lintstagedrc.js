// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, 'prettier --write'],

  '*.{json,css,scss,sass,less,md,mdx}': ['prettier --write'],

  '*.{html,htm}': ['prettier --write'],

  '*.{yml,yaml,toml}': ['prettier --write'],
};
