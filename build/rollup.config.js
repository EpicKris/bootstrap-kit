const path = require('path');
const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');

const BUNDLE = process.env.BUNDLE === 'true';
const ESM = process.env.ESM === 'true';

let fileDest = `kit${ESM ? '.esm' : ''}`;
const external = ['@popperjs/core'];
const plugins = [
  babel({
    // Only transpile our source code
    exclude: 'node_modules/**',
    // Include the helpers in the bundle, at most one copy of each
    babelHelpers: 'bundled'
  })
];
const globals = {
  '@popperjs/core': 'Popper'
};

if (BUNDLE) {
  fileDest += '.bundle';
  // Remove last entry in external array to bundle Popper
  external.pop();
  delete globals['@popperjs/core'];
  plugins.push(
    replace({
      'process.env.NODE_ENV': '"production"',
      preventAssignment: true
    }),
    nodeResolve()
  );
}

const rollupConfig = {
  input: path.resolve(__dirname, `../js/index.${ESM ? 'esm' : 'umd'}.js`),
  output: {
    file: path.resolve(__dirname, `../dist/js/${fileDest}.js`),
    format: ESM ? 'esm' : 'umd',
    globals
  },
  external,
  plugins
};

if (!ESM) {
  rollupConfig.output.name = 'kit';
}

module.exports = rollupConfig;
