import { gerarProduto } from "./factories";

// Cria N produtos aleatórios autenticado e devolve a lista de ids
Cypress.Commands.add("criarProdutosEObterIds", (token, quantidade = 2) => {
  const ids = [];

  Cypress._.times(quantidade, () => {
    cy.criarProduto(gerarProduto(), token).then((res) => {
      ids.push(res.body._id);
    });
  });

  return cy.wrap(ids);
});

// Fluxo completo: cria usuário admin e um produto. Devolve { token, id, produto }.
Cypress.Commands.add("criarProdutoAutenticado", () => {
  return cy.criarUsuarioEObterToken().then(({ token }) => {
    const produto = gerarProduto();
    return cy.criarProduto(produto, token).then((res) => {
      return { token, id: res.body._id, produto };
    });
  });
});

Cypress.Commands.add(
  "listarProdutos",
  (
    qs = {
      preco: "470",
      quantidade: "0",
    },
  ) => {
    const apiUrl = Cypress.expose("API_URL");
    cy.api({
      method: "GET",
      url: `${apiUrl}/produtos`,
      headers: {
        accept: "application/json",
      },
      qs,
    });
  },
);

Cypress.Commands.add("buscarProdutoPorId", (id) => {
  const apiUrl = Cypress.expose("API_URL");
  return cy.api({
    method: "GET",
    url: `${apiUrl}/produtos/${id}`,
    headers: {
      accept: "application/json",
    },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("criarProduto", (body, token) => {
  const apiUrl = Cypress.expose("API_URL");
  cy.api({
    method: "POST",
    url: `${apiUrl}/produtos`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("excluirProduto", (id, token) => {
  const apiUrl = Cypress.expose("API_URL");
  cy.api({
    method: "DELETE",
    url: `${apiUrl}/produtos/${id}`,
    headers: {
      accept: "application/json",
      Authorization: token,
    },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("editarProduto", (id, body, token) => {
  const apiUrl = Cypress.expose("API_URL");
  cy.api({
    method: "PUT",
    url: `${apiUrl}/produtos/${id}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body,
    failOnStatusCode: false,
  });
});
