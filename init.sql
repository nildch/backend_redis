CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);


INSERT INTO users (name, email, role) VALUES
  ('Alice Silva', 'alice@email.com', 'admin'),
  ('Bruno Souza', 'bruno@email.com', 'user'),
  ('Carla Mendes', 'carla@email.com', 'user'),
  ('Daniel Costa', 'daniel@email.com', 'editor'),
  ('Elisa Ferreira', 'elisa@email.com', 'user');

INSERT INTO products (name, description, price, stock, category) VALUES
  ('Notebook Pro', 'Notebook de alta performance com 16GB RAM', 4999.90, 15, 'Eletrônicos'),
  ('Mouse Gamer', 'Mouse com 12000 DPI e iluminação RGB', 199.90, 50, 'Periféricos'),
  ('Teclado Mecânico', 'Teclado mecânico com switches Cherry MX', 349.90, 30, 'Periféricos'),
  ('Monitor 4K', 'Monitor 27 polegadas resolução 4K', 2299.90, 8, 'Eletrônicos'),
  ('Headset USB', 'Headset com cancelamento de ruído', 449.90, 20, 'Áudio');
