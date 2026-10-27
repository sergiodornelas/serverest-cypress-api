import { gerarUsuario } from "../../support/commands/factories";
import login from "../../fixtures/login.json";

describe("POST/login - Autenticação", () => {
  it("deve realizar autenticação com credenciais válidas", () => {
    const usuario = gerarUsuario();

    cy.criarUsuario(usuario).then(() => {
      cy.fazerLogin({
        email: usuario.email,
        password: usuario.password,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.eq("Login realizado com sucesso");
        expect(res.body).to.have.property("authorization");
      });
    });
  });

  it("deve retornar 401 ao autenticar com e-mail e/ou senha inválidos", () => {
    cy.fazerLogin(login.invalido).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.eq("Email e/ou senha inválidos");
    });
  });

  it("deve retornar 400 ao autenticar com e-mail vazio", () => {
    cy.fazerLogin({ email: "", password: "senha123" }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.email).to.eq("email não pode ficar em branco");
    });
  });

  it("deve retornar 400 ao autenticar com senha vazia", () => {
    cy.fazerLogin({ email: "usuario@qa.com", password: "" }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.password).to.eq("password não pode ficar em branco");
    });
  });

  it("deve retornar 400 ao autenticar com e-mail e senha vazios", () => {
    cy.fazerLogin({ email: "", password: "" }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.email).to.eq("email não pode ficar em branco");
      expect(res.body.password).to.eq("password não pode ficar em branco");
    });
  });
});
