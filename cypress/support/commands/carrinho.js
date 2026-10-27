import { gerarCarrinho } from "./factories";

Cypress.Commands.add("criarCarrinho", (body, token) => {
  const apiUrl = Cypress.expose("API_URL");
  return cy.api({
    method: "POST",
    url: `${apiUrl}/carrinhos`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("listarCarrinhos", (qs = {}) => {
  const apiUrl = Cypress.expose("API_URL");
  return cy.api({
    method: "GET",
    url: `${apiUrl}/carrinhos`,
    headers: {
      accept: "application/json",
    },
    qs,
  });
});

Cypress.Commands.add("buscarCarrinhoPorId", (id) => {
  const apiUrl = Cypress.expose("API_URL");
  return cy.api({
    method: "GET",
    url: `${apiUrl}/carrinhos/${id}`,
    headers: {
      accept: "application/json",
    },
    failOnStatusCode: false,
  });
});

// Fluxo completo: cria usuário admin, produtos e um carrinho.
Cypress.Commands.add("criarCarrinhoAutenticado", () => {
  return cy.criarUsuarioEObterToken().then(({ token }) => {
    return cy.criarProdutosEObterIds(token).then((ids) => {
      return cy.criarCarrinho(gerarCarrinho(ids), token).then((res) => {
        return { token, idCarrinho: res.body._id };
      });
    });
  });
});

Cypress.Commands.add("concluirCompra", (token) => {
  const apiUrl = Cypress.expose("API_URL");
  return cy.api({
    method: "DELETE",
    url: `${apiUrl}/carrinhos/concluir-compra`,
    headers: {
      accept: "application/json",
      Authorization: token,
    },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("cancelarCompra", (token) => {
  const apiUrl = Cypress.expose("API_URL");
  return cy.api({
    method: "DELETE",
    url: `${apiUrl}/carrinhos/cancelar-compra`,
    headers: {
      accept: "application/json",
      Authorization: token,
    },
    failOnStatusCode: false,
  });
});
