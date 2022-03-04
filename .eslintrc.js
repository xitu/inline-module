module.exports = {
  globals: {
    globalThis: true,
  },
  extends:  "eslint-config-next",
  rules: {
    "semi": [2, "always"],
    "complexity": ["warn", 25],
    "no-unused-vars": 'warn',
    'no-restricted-globals': 'off',
    "no-console": 'off',
    "max-params": ["warn", 7],
    "import/no-anonymous-default-export": 'off',
  },
};
