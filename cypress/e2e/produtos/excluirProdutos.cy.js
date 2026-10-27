import { gerarCarrinho } from "../../support/commands/factories";
import tokens from "../../fixtures/tokens.json";

describe("DELETE /produtos/{id} - Exclusão", () => {
  it("deve excluir o produto criado pelo id gerado no cadastro (200)", () => {
    cy.criarProdutoAutenticado().then(({ token, id }) => {
      cy.excluirProduto(id, token).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq("Registro excluído com sucesso");
      });

      // confirma que o produto não existe mais após a exclusão
      cy.buscarProdutoPorId(id).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq("Produto não encontrado");
      });
    });
  });

  it("deve retornar 401 ao excluir produto com token inválido ou expirado", () => {
    cy.criarProdutoAutenticado().then(({ id }) => {
      cy.excluirProduto(id, tokens.invalido).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq(
          "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais",
        );
      });
    });
  });

  it("deve retornar 400 ao excluir produto que faz parte de um carrinho", () => {
    cy.criarProdutoAutenticado().then(({ token, id }) => {
      // adiciona o produto a um carrinho antes de tentar excluir
      cy.criarCarrinho(gerarCarrinho([id]), token).then(() => {
        cy.excluirProduto(id, token).then((res) => {
          expect(res.status).to.eq(400);
          expect(res.body.message).to.eq(
            "Não é permitido excluir produto que faz parte de carrinho",
          );
        });
      });
    });
  });
});
