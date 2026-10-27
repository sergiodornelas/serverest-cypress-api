import { gerarProduto } from "../../support/commands/factories";
import tokens from "../../fixtures/tokens.json";

describe("PUT/produtos/{id} - Edição", () => {
  it("deve editar o produto criado pelo id gerado no cadastro", () => {
    cy.criarProdutoAutenticado().then(({ token, id }) => {
      // novos dados aleatórios para a edição
      const produtoEditado = gerarProduto();

      cy.editarProduto(id, produtoEditado, token).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq("Registro alterado com sucesso");
      });
    });
  });

  it("deve retornar 400 ao editar produto com nome já existente", () => {
    cy.criarProdutoAutenticado().then(
      ({ token, produto: produtoExistente }) => {
        // cria um segundo produto para tentar renomeá-lo com o nome do primeiro
        const outroProduto = gerarProduto();

        cy.criarProduto(outroProduto, token).then((res) => {
          const idOutro = res.body._id;

          cy.editarProduto(
            idOutro,
            { ...outroProduto, nome: produtoExistente.nome },
            token,
          ).then((resEdit) => {
            expect(resEdit.status).to.eq(400);
            expect(resEdit.body.message).to.eq(
              "Já existe produto com esse nome",
            );
          });
        });
      },
    );
  });

  it("deve retornar 401 ao editar produto com token inválido ou expirado", () => {
    cy.criarProdutoAutenticado().then(({ id }) => {
      cy.editarProduto(id, gerarProduto(), tokens.invalido).then((res) => {
        expect(res.status).to.eq(401);
        expect(res.body.message).to.eq(
          "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais",
        );
      });
    });
  });
});
