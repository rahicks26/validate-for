// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  testMatch: [
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
};
