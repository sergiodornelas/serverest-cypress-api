# 🧪 Automação de testes de API (ServeRest).

Projeto de automação de testes de API utilizando Cypress utilizando a aplicação
[**ServeRest**](https://serverest.dev), uma API REST pública e gratuita que simula
uma loja virtual, com recursos de usuários, login, produtos e carrinhos.

O objetivo é validar o comportamento dos endpoints da ServeRest de ponta a ponta:
cadastrar, consultar, editar e excluir cada recurso, verificando os códigos de status,
as mensagens de resposta e os efeitos reais de cada operação. As requisições são feitas
com o plugin **cypress-plugin-api** (que exibe a interface visual de cada request/response)
e os dados de teste são gerados dinamicamente com o **Faker**.

## 🛠️ Tecnologias

| Ferramenta | Uso |
|---|---|
| [Cypress 16](https://www.cypress.io/) | Execução dos testes |
| [cypress-plugin-api](https://github.com/filiphric/cypress-plugin-api) | Requisições via `cy.api` com interface visual |
| [@faker-js/faker](https://fakerjs.dev/) | Geração de dados aleatórios |
| [Prettier](https://prettier.io/) | Formatação de código |
| [ESLint](https://eslint.org/) + [eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress) | Análise estática e regras específicas de Cypress |
| [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) | Lint/format automáticos no pre-commit |

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18+)
- npm

## 📦 Instalação

```bash
npm install
```

## ▶️ Execução

Abrir o Cypress em modo interativo:

```bash
npx cypress open
```

Rodar toda a suíte em modo headless:

```bash
npx cypress run
```

Rodar um spec específico:

```bash
npx cypress run --spec cypress/e2e/usuarios/cadastrarUsuarios.cy.js
```

> ℹ️ A URL base da API fica em `cypress.config.js` (`expose.API_URL`) e é lida nos
> comandos via `Cypress.expose('API_URL')`. Os testes criam seus próprios dados
> (usuários, produtos, carrinhos), então nenhuma credencial ou `cypress.env.json`
> é necessário para executar.

## 📁 Estrutura

```
cypress/
├── e2e/                      # specs, organizados por recurso
│   ├── login/
│   ├── usuarios/
│   ├── produtos/
│   └── carrinhos/
├── fixtures/                 # dados estáticos (tokens inválidos, credenciais inválidas)
│   ├── tokens.json
│   └── login.json
└── support/
    ├── e2e.js                # importa os comandos e o plugin
    └── commands/             # comandos customizados + factories
        ├── login.js
        ├── usuarios.js
        ├── produtos.js
        ├── carrinho.js
        └── factories.js
```

Na raiz: `eslint.config.mjs`, `.prettierrc`, `.prettierignore` e `.husky/` (hook de
pre-commit).

## ✅ Cobertura

Cada recurso cobre o caminho feliz **e** cenários negativos (status de erro e
mensagem da API).

| Recurso | Positivos | Negativos |
|---|---|---|
| 🔐 **Login** | Autenticar com credenciais válidas | `401` e-mail/senha inválidos |
| 👤 **Usuários** | Cadastrar, listar, buscar por id, editar, excluir | `400` e-mail em uso, campo obrigatório ausente, id inexistente, exclusão com carrinho |
| 📦 **Produtos** | Cadastrar, listar, buscar por id, editar, excluir (autenticado) | `400` nome duplicado, id inexistente, produto em carrinho; `401` token inválido |
| 🛒 **Carrinhos** | Cadastrar, listar, buscar por id, concluir compra, cancelar compra | `400` produto duplicado, id inexistente; `401` token inválido |

## 📐 Padrões do projeto

- 🌐 **`cy.api`** em todas as requisições (nunca `cy.request`).
- 🎲 **Factories** (`support/commands/factories.js`) geram **dados** aleatórios com Faker;
  **fixtures** (`cypress/fixtures/`) guardam dados fixos e repetíveis (ex.: token inválido).
- 🧩 **Comandos customizados** com verbos em português (`criarUsuario`, `buscarProdutoPorId`,
  `concluirCompra`...); os de escrita recebem o token e enviam `Authorization`.
  Os comandos retornam a cadeia (`return cy.api(...)`) e **não contêm asserções** — validação
  é responsabilidade do `it`.
- 🔁 **Comandos de fluxo** encapsulam pré-condições (`criarUsuarioEObterToken`,
  `criarProdutosEObterIds`, `criarCarrinhoAutenticado`, `criarProdutoAutenticado`).
- 🔒 **Testes autossuficientes**: cada teste cria o recurso e usa o `_id` retornado,
  nunca ids fixos.
- 🎯 **Asserções focadas no objetivo** do teste (sem validar o setup).
- 🏷️ `describe` = `"MÉTODO /rota - Recurso"`; `it` = `"deve <resultado> quando <condição>"`.

## 🔧 Qualidade de código

| Comando | O que faz |
|---|---|
| `npm run format` | Formata o código com o Prettier |
| `npm run format:check` | Verifica a formatação sem alterar arquivos |
| `npm run lint` | Roda o ESLint |
| `npm run lint:fix` | Corrige o que o ESLint conseguir automaticamente |

Um **hook de pre-commit** (Husky + lint-staged) roda `eslint --fix` e `prettier --write`
apenas nos arquivos `.js` em stage a cada commit. Erro de lint não corrigível bloqueia o
commit. O Prettier usa as configurações padrão (aspas duplas, 2 espaços, 80 colunas),
fixadas em `.prettierrc`.
