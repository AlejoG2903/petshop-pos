CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  document VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  role VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sales (
  id BIGSERIAL PRIMARY KEY,
  date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  total NUMERIC(12,2) NOT NULL,
  payment_method TEXT,
  seller_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sale_items (
  id BIGSERIAL PRIMARY KEY,
  sale_id BIGINT REFERENCES sales(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  quantity INTEGER,
  price NUMERIC(12,2)
);

CREATE TABLE IF NOT EXISTS reports_sent_log (
  id BIGSERIAL PRIMARY KEY,
  date DATE,
  file_path TEXT,
  email_to TEXT,
  sent_at TIMESTAMP DEFAULT now()
);
