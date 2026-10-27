import { gerarProduto } from "../../support/commands/factories";
import tokens from "../../fixtures/tokens.json";

describe("POST/produtos - Cadastro", () => {
  it("deve realizar o cadastro de um produto", () => {
    cy.criarUsuarioEObterToken().then(({ token }) => {
      const produto = gerarProduto();
      cy.criarProduto(produto, token).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.message).to.eq("Cadastro realizado com sucesso");
        expect(res.body).to.have.property("_id");
      });
    });
  });

  it("deve retornar 400 ao cadastrar produto com nome já existente", () => {
    cy.criarUsuarioEObterToken().then(({ token }) => {
      const produto = gerarProduto();
      cy.criarProduto(produto, token).then(() => {
        cy.criarProduto(produto, token).then((resDuplicado) => {
          expect(resDuplicado.status).to.eq(400);
          expect(resDuplicado.body.message).to.eq(
            "Já existe produto com esse nome",
          );
        });
      });
    });
  });

  it("deve retornar 401 ao cadastrar produto com token inválido ou expirado", () => {
    cy.criarProduto(gerarProduto(), tokens.invalido).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq(
        "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais",
      );
    });
  });
});
