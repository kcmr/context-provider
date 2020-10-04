module.exports = {
  nodeResolve: true,
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: {
      statements: 95,
      branches: 87,
      functions: 100,
      lines: 95,
    },
  },
  testFramework: {
    config: {
      ui: 'tdd',
    },
  },
};
