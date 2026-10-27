import { gerarUsuario } from "../../support/commands/factories";

describe("GET /usuarios - Listagem", () => {
  it("deve retornar a lista de usuários (200)", () => {
    cy.listarUsuarios().its("status").should("eq", 200);
  });

  it("deve buscar o usuário pelo id gerado no cadastro", () => {
    const usuario = gerarUsuario();
    cy.criarUsuario(usuario).then((response) => {
      const id = response.body._id;
      cy.buscarUsuarioPorId(id).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body._id).to.eq(id);
        expect(res.body.email).to.eq(usuario.email);
      });
    });
  });

  it("deve retornar 400 ao buscar usuário com id inexistente", () => {
    cy.buscarUsuarioPorId("idInexistente123").then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.eq("Usuário não encontrado");
    });
  });
});
