module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "no-console": "off",
    "func-names": "off",
    "no-underscore-dangle": "off",
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
  },
};
