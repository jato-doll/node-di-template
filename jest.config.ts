// jest.config.ts
import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/*.test.ts", "**/*.spec.ts"],

    setupFiles: ["<rootDir>/src/utils/unit-test.util.ts"],

    roots: ["<rootDir>/src"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    collectCoverage: true,
    coverageDirectory: "<rootDir>/coverage",
    coverageReporters: ["text", "lcov"],
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    verbose: true,
};

export default config;
