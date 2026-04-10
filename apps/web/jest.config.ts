import type { Config } from 'jest';
import nextJest from 'next/jest.js';

// This automatically loads your Next.js config and environment variables
const createJestConfig = nextJest({
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom', // This tells Jest we are testing browser/UI components
};

// Export the config wrapped in the Next.js compiler
export default createJestConfig(config);