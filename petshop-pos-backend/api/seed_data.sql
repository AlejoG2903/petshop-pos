-- Solo insertar productos de prueba (no usuarios)
-- Los usuarios ya existen en tu base de datos

-- Insertar productos de prueba
INSERT INTO products (name, price, stock, category, image) VALUES 
('Alimento para perros adulto 20kg', 150000, 10, 'alimento', 'https://via.placeholder.com/150'),
('Collar para perro', 25000, 15, 'accesorio', 'https://via.placeholder.com/150'),
('Pelota de goma', 15000, 20, 'juguetes', 'https://via.placeholder.com/150'),
('Shampoo para mascotas', 35000, 8, 'higiene', 'https://via.placeholder.com/150'),
('Vitamina para perros', 45000, 12, 'medicamentos', 'https://via.placeholder.com/150')
ON CONFLICT DO NOTHING;
