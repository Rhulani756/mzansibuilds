import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
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

  // FIX IS HERE:
  moduleNameMapper: {
    // This tells Jest: "If you see @/something, look in the apps/web directory"
    '^@/(.*)$': '<rootDir>/$1',
    '^@repo/database/(.*)$': '<rootDir>/../../packages/database/$1',
  },
};

export default createJestConfig(config);