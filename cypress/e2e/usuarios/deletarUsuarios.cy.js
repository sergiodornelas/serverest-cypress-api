import { gerarUsuario, gerarCarrinho } from "../../support/commands/factories";

describe("DELETE /usuarios/{id} - Exclusão", () => {
  it("deve excluir o usuário criado pelo id gerado no cadastro (200)", () => {
    const usuario = gerarUsuario();
    cy.criarUsuario(usuario).then((response) => {
      const id = response.body._id;
      cy.excluirUsuario(id).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq("Registro excluído com sucesso");
      });
    });
  });

  it("deve retornar 400 ao excluir usuário com carrinho cadastrado", () => {
    const usuario = gerarUsuario();
    cy.criarUsuario(usuario).then((resUsuario) => {
      const idUsuario = resUsuario.body._id;
      cy.fazerLogin({
        email: usuario.email,
        password: usuario.password,
      }).then((resLogin) => {
        const token = resLogin.body.authorization;
        // cria um carrinho para o usuário antes de tentar excluí-lo
        cy.criarProdutosEObterIds(token).then((ids) => {
          cy.criarCarrinho(gerarCarrinho(ids), token).then(() => {
            cy.excluirUsuario(idUsuario).then((res) => {
              expect(res.status).to.eq(400);
              expect(res.body.message).to.eq(
                "Não é permitido excluir usuário com carrinho cadastrado",
              );
            });
          });
        });
      });
    });
  });
});
