describe("GET /carrinhos - Listagem", () => {
  it("deve buscar todos os carrinhos", () => {
    cy.criarCarrinhoAutenticado().then(({ idCarrinho }) => {
      cy.listarCarrinhos().then((res) => {
        expect(res.status).to.eq(200);
        //garante que o carrinho criado pelo teste realmente foi retornado pelo endpoint de listagem.
        const idsCarrinhos = res.body.carrinhos.map((c) => c._id);
        expect(idsCarrinhos).to.include(idCarrinho);
      });
    });
  });

  it("deve buscar carrinho pelo id", () => {
    cy.criarCarrinhoAutenticado().then(({ idCarrinho }) => {
      cy.buscarCarrinhoPorId(idCarrinho).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body._id).to.eq(idCarrinho);
      });
    });
  });

  it("deve retornar 400 ao buscar carrinho com id inexistente", () => {
    cy.buscarCarrinhoPorId("idInexistente123").then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.eq("Carrinho não encontrado");
    });
  });
});
