/* eslint-disable */
const { pathsToModuleNameMapper } = require('ts-jest/utils')
const tsconfig = require('./tsconfig')

module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleDirectories: ['<rootDir>/src', 'node_modules'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'index.ts',
    '<rootDir>/node_modules/',
    '<rootDir>/src/interfaces',
    '<rootDir>/src/__tests__',
  ],
  coverageReporters: ['lcov'],
  coverageThreshold: {
    global: {
      branches: 65,
      statements: 80,
      functions: 82,
      lines: 83,
    },
  },
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, '<rootDir>/src'),
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/lib',
    '<rootDir>/src/services',
    '<rootDir>/src/__tests__/fixtures',
  ],
}
