module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': './esbuild-jest-transformer.cjs',
  },
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  setupFilesAfterEnv: ['./jsdom.mocks.cjs'],
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
  },
};
