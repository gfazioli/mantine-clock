/**
 * Custom Jest transformer wrapping esbuild directly.
 *
 * The stock esbuild-jest package falls back to babel when the source code
 * contains the substring "ock(" (intended to detect jest.mock calls).
 * That babel fallback requires @babel/plugin-transform-modules-commonjs
 * which is not installed at the top level, causing test failures for any
 * file whose source (or whose imported modules' source) matches.
 *
 * This transformer uses esbuild directly without the babel fallback.
 */
const esbuild = require('esbuild');
const path = require('path');

const loaders = ['js', 'jsx', 'ts', 'tsx', 'json'];

module.exports = {
  canInstrument: false,
  createTransformer() {
    return {
      process(content, filename) {
        const extName = path.extname(filename).slice(1);
        const loader = loaders.includes(extName) ? extName : 'text';

        const result = esbuild.transformSync(content, {
          loader,
          format: 'cjs',
          target: 'es2018',
          sourcefile: filename,
        });

        return { code: result.code, map: null };
      },
    };
  },
};
