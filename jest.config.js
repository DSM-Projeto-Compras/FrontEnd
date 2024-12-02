module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "!app/**/*.test.{js,jsx,ts,tsx}",
    "!app/**/*.{d.ts}",
    "!app/**/layout.tsx",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/app/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },
  transformIgnorePatterns: ["/node_modules/"],
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  testEnvironment: "jest-fixed-jsdom",
};
