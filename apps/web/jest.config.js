/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-env node */
const nextJest = require('next/jest');

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  dir: './',
});

const config = {
  coverageProvider: 'v8',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/e2e/' 
  ],

  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!<rootDir>/.next/**',
    '!<rootDir>/*.config.ts',
    '!<rootDir>/coverage/**',
  ],
  coverageDirectory: 'coverage',

  moduleNameMapper: {
    // Standard Next.js alias
    '^@/(.*)$': '<rootDir>/$1',
    // Your Turborepo package mapping
    '^@repo/database/(.*)$': '<rootDir>/../../packages/database/$1',
  },
};

module.exports = createJestConfig(config);