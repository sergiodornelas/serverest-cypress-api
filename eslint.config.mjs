import js from "@eslint/js";
import globals from "globals";
import cypress from "eslint-plugin-cypress";
import prettier from "eslint-config-prettier";

export default [
  // ignora artefatos e dependências
  {
    ignores: ["node_modules/", "cypress/videos/", "cypress/screenshots/"],
  },

  // regras base recomendadas do ESLint
  js.configs.recommended,

  // specs e commands do Cypress (ES modules + globais do Cypress/Mocha)
  {
    files: ["cypress/**/*.js"],
    plugins: { cypress },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...cypress.configs.globals.languageOptions.globals,
      },
    },
    rules: {
      ...cypress.configs.recommended.rules,
    },
  },

  // arquivos de configuração rodam no Node (CommonJS)
  {
    files: ["*.config.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: { ...globals.node },
    },
  },

  // desliga regras de formatação para não conflitar com o Prettier
  prettier,
];
