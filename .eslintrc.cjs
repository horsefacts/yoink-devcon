/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["next", "prettier", "plugin:prettier/recommended"],
  plugins: ["prettier"],
};
