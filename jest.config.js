module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    '.eslintrc.js',
    'jest.config',
    'node_modules',
    '<rootDir>/coverage',
    '<rootDir>/dist',
    'test',
    '.interface.ts',
    '.module.ts',
    '.spec.ts',
    'index.ts',
  ],
  testEnvironment: 'node',
};
