/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {tsconfig: './tsconfig.test.json'}],
  },
  moduleNameMapper: {
    '^@prisma/adapter-d1$': '<rootDir>/src/__mocks__/prisma-adapter-d1.ts',
    '(.*)/generated/prisma$': '<rootDir>/src/__mocks__/prisma-client.ts',
  },
}
