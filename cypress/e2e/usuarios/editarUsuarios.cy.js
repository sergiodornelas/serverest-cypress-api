import { faker } from "@faker-js/faker";
import { gerarUsuario } from "../../support/commands/factories";

describe("PUT /usuarios/{id} - Edição", () => {
  it("deve editar o usuário criado pelo id gerado no cadastro (200)", () => {
    const usuario = gerarUsuario();
    cy.criarUsuario(usuario).then((response) => {
      const id = response.body._id;
      const usuarioEditado = {
        ...usuario,
        nome: faker.person.fullName(),
        administrador: "false",
      };
      cy.editarUsuario(id, usuarioEditado).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq("Registro alterado com sucesso");
      });
    });
  });

  it("deve retornar 400 ao editar usuário com e-mail já em uso", () => {
    const usuarioExistente = gerarUsuario();
    cy.criarUsuario(usuarioExistente).then(() => {
      // cria um segundo usuário para tentar atribuir o e-mail do primeiro
      const outroUsuario = gerarUsuario();
      cy.criarUsuario(outroUsuario).then((res) => {
        const id = res.body._id;
        cy.editarUsuario(id, {
          ...outroUsuario,
          email: usuarioExistente.email,
        }).then((resEdit) => {
          expect(resEdit.status).to.eq(400);
          expect(resEdit.body.message).to.eq("Este email já está sendo usado");
        });
      });
    });
  });
});
