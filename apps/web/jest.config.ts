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

  // FIX IS HERE:
  moduleNameMapper: {
    // This tells Jest: "If you see @/something, look in the apps/web directory"
    '^@/(.*)$': '<rootDir>/$1',
    '^@repo/database/(.*)$': '<rootDir>/../../packages/database/$1',
  },
};

export default createJestConfig(config);