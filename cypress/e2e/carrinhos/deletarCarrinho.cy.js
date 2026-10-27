import tokens from "../../fixtures/tokens.json";

describe("DELETE/carrinhos/concluir-compra - Exclusão", () => {
  it("deve excluir o carrinho ao concluir a compra", () => {
    cy.criarCarrinhoAutenticado().then(({ token, idCarrinho }) => {
      cy.concluirCompra(token).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq("Registro excluído com sucesso");
      });
      // confirma que o carrinho não existe mais após concluir a compra
      cy.buscarCarrinhoPorId(idCarrinho).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq("Carrinho não encontrado");
      });
    });
  });

  it("deve retornar 401 ao concluir compra com token inválido ou expirado", () => {
    cy.concluirCompra(tokens.invalido).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq(
        "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais",
      );
    });
  });
});

describe("DELETE/carrinhos/cancelar-compra - Cancelamento", () => {
  it("deve excluir carrinho e retornar produtos ao estoque", () => {
    cy.criarCarrinhoAutenticado().then(({ token }) => {
      cy.cancelarCompra(token).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq(
          "Registro excluído com sucesso. Estoque dos produtos reabastecido",
        );
      });
    });
  });

  it("deve retornar 401 ao cancelar compra com token ausente, inválido ou expirado", () => {
    cy.cancelarCompra(tokens.invalido).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq(
        "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais",
      );
    });
  });
});
