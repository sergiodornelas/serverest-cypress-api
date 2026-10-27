import { gerarCarrinho } from "../../support/commands/factories";
import tokens from "../../fixtures/tokens.json";
import carrinhos from "../../fixtures/carrinhos.json";

describe("POST/carrinhos - Cadastro", () => {
  it("deve cadastrar um carrinho com produtos aleatórios", () => {
    cy.criarUsuarioEObterToken().then(({ token }) => {
      cy.criarProdutosEObterIds(token).then((ids) => {
        const carrinho = gerarCarrinho(ids);
        cy.criarCarrinho(carrinho, token).then((res) => {
          expect(res.status).to.eq(201);
          expect(res.body.message).to.eq("Cadastro realizado com sucesso");
          expect(res.body).to.have.property("_id");
        });
      });
    });
  });

  it("deve retornar 400 ao cadastrar carrinho com produto duplicado", () => {
    cy.criarUsuarioEObterToken().then(({ token }) => {
      cy.criarProdutosEObterIds(token).then((ids) => {
        // mesmo produto informado duas vezes no body
        const carrinho = gerarCarrinho([ids[0], ids[0]]);
        cy.criarCarrinho(carrinho, token).then((res) => {
          expect(res.status).to.eq(400);
          expect(res.body.message).to.eq(
            "Não é permitido possuir produto duplicado",
          );
        });
      });
    });
  });

  it("deve retornar 401 ao cadastrar carrinho com token inválido ou expirado", () => {
    const carrinho = gerarCarrinho(carrinhos.idsProdutoFicticio);
    cy.criarCarrinho(carrinho, tokens.invalido).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq(
        "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais",
      );
    });
  });
});
