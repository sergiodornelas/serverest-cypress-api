import { gerarUsuario } from "../../support/commands/factories";

describe("POST /usuarios - Cadastro", () => {
  it("deve cadastrar um usuário com dados válidos (201)", () => {
    cy.criarUsuario(gerarUsuario()).its("status").should("eq", 201);
  });

  it("deve retornar 400 ao cadastrar usuário com e-mail já em uso", () => {
    const usuario = gerarUsuario();
    cy.criarUsuario(usuario).then(() => {
      cy.criarUsuario(usuario).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq("Este email já está sendo usado");
      });
    });
  });

  it("deve retornar 400 ao cadastrar usuário sem campo obrigatório", () => {
    const { email, password, administrador } = gerarUsuario();
    cy.criarUsuario({ email, password, administrador }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.nome).to.eq("nome é obrigatório");
    });
  });
});
