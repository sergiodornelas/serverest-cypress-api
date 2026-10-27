# Convenções de testes de API (Cypress + serverest)

Prompt/base de padrões para automatizar testes de API REST com Cypress (serverest.dev)
em JavaScript. A cada teste, rode o spec e só conclua quando estiver verde.

## Ferramentas
- Use o plugin `cypress-plugin-api`: toda chamada HTTP via `cy.api` (nunca `cy.request`).
- Use `@faker-js/faker` para todos os dados de teste (nada hardcoded).
- Variáveis de ambiente na API do Cypress 16: `Cypress.expose("API_URL")` para a URL
  (em `cypress.config.js`) e `cy.env([...])` para dados sensíveis.
  `cypress.env.json` e artefatos (screenshots/videos) sempre no `.gitignore`.

## Estrutura de pastas
- `cypress/support/commands/` → um arquivo por recurso (`login.js`, `usuarios.js`,
  `produtos.js`, `carrinho.js`) e o `factories.js`, todos nessa subpasta.
- `cypress/support/e2e.js` importa cada arquivo de comandos via `./commands/<recurso>`
  (e o `cypress-plugin-api`).
- Specs em `cypress/e2e/<recurso>/<acao>.cy.js`.

## Comandos customizados (`cypress/support/commands`)
- Um command por operação de API, nomeado com verbo em português, SEM prefixo técnico
  (`criarUsuario`, `listarProdutos`, `buscarProdutoPorId`, `editarProduto`,
  `excluirProduto`, `fazerLogin`, `concluirCompra`, `cancelarCompra`...).
- Commands que escrevem exigem o token como parâmetro e enviam header `Authorization`.
- Use `failOnStatusCode: false` para o command servir casos de sucesso e de erro.

## Factories (`cypress/support/commands/factories.js`)
- Funções puras que só montam objetos aleatórios: `gerarUsuario()`, `gerarProduto()`,
  `gerarCarrinho(ids, quantidade)`. Nome de produto sempre único.
- São exports de módulo ES → precisam de `import` no spec que as usa.

## Abstração de fluxo (commands)
- Encapsule fluxos repetidos em commands: `criarUsuarioEObterToken()` → `{usuario, token}`;
  `criarProdutosEObterIds(token)` → `ids`; `criarCarrinhoAutenticado()` → `{token, idCarrinho}`.
- Regra: **factory para DADO, command para COMPORTAMENTO.** Use a abstração como
  PRÉ-CONDIÇÃO; mantenha a ação EXPLÍCITA quando ela for o foco do teste.

## Testes
- `describe` = `"MÉTODO /rota - Recurso"`; `it` = `"deve <resultado esperado> quando <condição>"`,
  em português. Um `it` por cenário.
- Testes autossuficientes: criar o recurso no próprio teste e usar o `_id` retornado
  (nunca id fixo). Para buscar/editar/excluir, sempre cadastrar antes.
- Validações cruzadas: além do status e da `message`, confirme o efeito real
  (ex.: após excluir, buscar o id deve retornar `400`/"não encontrado").

## Formatação
- Prettier com as configurações padrão (`prettier --write .`); sem `.prettierrc`.
- **Aspas duplas** em strings JS (`"application/json"`), não aspas simples.
- 2 espaços de indentação, ponto e vírgula, vírgula final e largura de 80 colunas.
- Scripts: `npm run format` (aplica) e `npm run format:check` (verifica).

## Git
- Commits incrementais e descritivos na branch atual, um por unidade de trabalho.
- Não fazer push sem o autor pedir. Rodar a suíte antes de cada commit.
