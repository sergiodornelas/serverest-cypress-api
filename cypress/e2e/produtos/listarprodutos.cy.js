describe("GET /produtos - Listagem", () => {
  it("deve retornar a lista de produtos (200)", () => {
    cy.listarProdutos().its("status").should("eq", 200);
  });

  it("deve buscar o produto pelo id gerado no cadastro (200)", () => {
    cy.criarProdutoAutenticado().then(({ id, produto }) => {
      cy.buscarProdutoPorId(id).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body._id).to.eq(id);
        expect(res.body.nome).to.eq(produto.nome);
      });
    });
  });

  it("deve retornar 400 ao buscar produto com id inexistente", () => {
    cy.buscarProdutoPorId("idInexistente123").then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.message).to.eq("Produto não encontrado");
    });
  });
});
