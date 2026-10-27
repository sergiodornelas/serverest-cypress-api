const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {},
  // Valores NÃO sensíveis - lidos no teste via Cypress.expose('CHAVE')
  expose: {
    API_URL: "https://serverest.dev",
  },
});
