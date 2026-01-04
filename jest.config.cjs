module.exports = {
  // Usar ts-jest en modo estándar (CommonJS) para evitar problemas ESM en tests
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/test/**/*.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
  ,
  // Mapear imports relativos a modelos (.js) hacia los .ts en src/models
  moduleNameMapper: {
    '^\\.\\./models\\/(.*)\\.js$': '<rootDir>/src/models/$1.ts'
  }
};
