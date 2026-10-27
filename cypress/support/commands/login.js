Cypress.Commands.add("fazerLogin", (body) => {
  const apiUrl = Cypress.expose("API_URL");

  return cy.api({
    method: "POST",
    url: `${apiUrl}/login`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
    failOnStatusCode: false,
  });
});
