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
      branches: 57,
      statements: 76,
      functions: 74,
      lines: 76,
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
