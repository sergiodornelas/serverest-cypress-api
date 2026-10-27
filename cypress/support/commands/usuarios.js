import { gerarUsuario } from "./factories";

Cypress.Commands.add("listarUsuarios", () => {
  const apiUrl = Cypress.expose("API_URL");
  return cy.api({
    method: "GET",
    url: `${apiUrl}/usuarios`,
    headers: {
      accept: "application/json",
    },
  });
});

Cypress.Commands.add("criarUsuario", (body) => {
  const apiUrl = Cypress.expose("API_URL");
  return cy.api({
    method: "POST",
    url: `${apiUrl}/usuarios`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("buscarUsuarioPorId", (id) => {
  const apiUrl = Cypress.expose("API_URL");
  return cy.api({
    method: "GET",
    url: `${apiUrl}/usuarios/${id}`,
    headers: {
      accept: "application/json",
    },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("excluirUsuario", (id) => {
  const apiUrl = Cypress.expose("API_URL");
  return cy.api({
    method: "DELETE",
    url: `${apiUrl}/usuarios/${id}`,
    headers: {
      accept: "application/json",
    },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("editarUsuario", (id, body) => {
  const apiUrl = Cypress.expose("API_URL");
  return cy.api({
    method: "PUT",
    url: `${apiUrl}/usuarios/${id}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
    failOnStatusCode: false,
  });
});

// Cria um usuário admin, autentica e devolve { usuario, token }
Cypress.Commands.add("criarUsuarioEObterToken", () => {
  const usuario = gerarUsuario();

  return cy.criarUsuario(usuario).then(() => {
    return cy
      .fazerLogin({
        email: usuario.email,
        password: usuario.password,
      })
      .then((resLogin) => {
        return { usuario, token: resLogin.body.authorization };
      });
  });
});
