module.exports = {
  env: {
    node: true,
    es2021: true,
    commonjs: true,
  },
  extends: [
    "airbnb-base",
    "plugin:prettier/recommended", // better Prettier integration
  ],
  parserOptions: {
    ecmaVersion: "latest", // updated for modern syntax
    sourceType: "module",
  },
  rules: {
    "no-console": "off", // allow console (useful in backend)
    "func-names": "off",
    "no-underscore-dangle": "off", // allow _id, etc. from MongoDB
    "import/extensions": "off", // avoid import issues with .js/.mjs
    "class-methods-use-this": "off", // allow non-static methods
    "consistent-return": "off", // useful in Express controllers
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "no-unused-vars": [
      "warn",
      { argsIgnorePattern: "req|res|next" }, // ignore Express params
    ],
    "prefer-destructuring": "off",
    "no-param-reassign": ["error", { props: false }], // allow modifying objects (e.g., req.user)
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".json"],
      },
    },
  },
};
