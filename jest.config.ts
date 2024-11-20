// eslint-disable-next-line import/no-default-export
export default {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '.*.css$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|svg)$': '<rootDir>/src/test-utils/fileStub.ts',
    '\\.svg\\?react$': '<rootDir>/src/test-utils/fileStub.ts',
    '@/(.*)$': '<rootDir>/src/$1',
  },
  roots: ['<rootDir>/src'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  testEnvironment: 'jsdom',
  transform: {
    '^.+.tsx?$': [
      'ts-jest',
      {
        useStrictMode: true,
      },
    ],
  },
}
