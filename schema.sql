CREATE DATABASE dindin;

CREATE TABLE IF NOT EXISTS usuarios(
  id SERIAL PRIMARY KEY,
  nome text NOT NULL,
  email text NOT NULL UNIQUE,
  senha text NOT NULL
);

CREATE TABLE IF NOT EXISTS categorias(
  id SERIAL PRIMARY KEY,
  descricao text
);

CREATE TABLE IF NOT EXISTS transacoes(
  id serial PRIMARY KEY,
  descricao text NOT NULL,
  valor int NOT NULL,
  data timestamptz NOT NULL,
  categoria_id integer NOT NULL,
  usuario_id integer NOT NULL,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  tipo text NOT NULL
);

INSERT INTO categorias
(descricao)
VALUES
('Alimentação'),
('Casa'),
('Mercado'),
('Família'),
('Roupas'),
('Saúde'),
('Educação'),
('Transporte'),
('Pets'),
('Lazer'),
('Cuidados Pessoais'),
('Presentes'),
('Assinaturas e Serviços'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');