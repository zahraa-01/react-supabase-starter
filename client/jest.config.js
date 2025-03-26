module.exports = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|less|scss)$': '<rootDir>/styleMock.js',
    },
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(@testing-library)/)'
    ],
    roots: [
        "<rootDir>"
    ]
};
