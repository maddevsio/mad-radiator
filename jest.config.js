/* eslint-disable */
const { pathsToModuleNameMapper } = require('ts-jest/utils')
const tsconfig = require('./tsconfig')

module.exports = {
  clearMocks: true,
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
    '<rootDir>/src/pagesAnalytics',
    '<rootDir>/src/storage',
    '<rootDir>/src/sitemap',
    '<rootDir>/src/lighthouse/Sitemap',
    '<rootDir>/src/analytics/EbookDownloadsRepository',
    '<rootDir>/src/utils/firestore'
  ],
  coverageReporters: ['lcov'],
  coverageThreshold: {
    global: {
      branches: 50,
      statements: 72,
      functions: 68,
      lines: 71,
    },
  },
  moduleNameMapper: pathsToModuleNameMapper({
      ...tsconfig.compilerOptions.paths,
      'firebase-admin/firestore': ['<rootDir>/node_modules/firebase-admin/lib/firestore/index.js'],
    }, '<rootDir>'),
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/lib',
    '<rootDir>/src/services',
    '<rootDir>/src/__tests__/fixtures',
  ],
}
