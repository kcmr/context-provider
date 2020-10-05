module.exports = {
  nodeResolve: true,
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  testFramework: {
    config: {
      ui: 'tdd',
    },
  },
};
