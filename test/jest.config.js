const { resolve } = require('path');
const root = resolve(__dirname, '..');

const rootConfig = require(`${root}/jest.config.js`);

module.exports = {...rootConfig, ...{
    rootDir: root,
    displayName: 'testes-end-2-end',
    setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
    testMatch: ['<rootDir>/test/**/*.test.ts'],
}}