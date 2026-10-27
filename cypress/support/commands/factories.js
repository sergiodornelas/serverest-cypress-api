import { faker } from "@faker-js/faker";

// Gera um usuário admin com dados aleatórios
export const gerarUsuario = () => ({
  nome: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  administrador: "true",
});

// Gera um produto com dados aleatórios (nome único para evitar duplicidade)
export const gerarProduto = () => ({
  nome: `${faker.commerce.productName()} ${faker.string.alphanumeric(6)}`,
  preco: faker.number.int({ min: 1, max: 5000 }),
  descricao: faker.commerce.productDescription(),
  quantidade: faker.number.int({ min: 1, max: 1000 }),
});

// Monta o body de um carrinho a partir dos ids de produto informados
export const gerarCarrinho = (idsProduto, quantidade = 1) => ({
  produtos: idsProduto.map((idProduto) => ({ idProduto, quantidade })),
});
