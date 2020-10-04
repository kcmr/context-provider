const { createDefaultConfig } = require('@open-wc/testing-karma');
const { merge } = require('webpack-merge');

module.exports = (config) =>
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        {
          pattern: config.grep ? config.grep : 'test/**/*.test.js',
          type: 'module',
        },
      ],

      client: {
        mocha: {
          ui: 'tdd',
        },
      },

      coverageReporter: {
        check: {
          global: {
            statements: 97.3,
            branches: 95,
            functions: 100,
            lines: 97.22,
          },
        },
      },

      esm: {
        nodeResolve: true,
      },
    }),
  );
