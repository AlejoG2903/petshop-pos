import db from './src/services/db.js';

async function testSales() {
  try {
    console.log('🧪 Probando creación de ventas...');
    
    // Obtener un usuario
    const userResult = await db.query('SELECT id FROM users LIMIT 1');
    if (userResult.rows.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      return;
    }
    const userId = userResult.rows[0].id;
    console.log('👤 Usuario encontrado:', userId);
    
    // Obtener un producto
    const productResult = await db.query('SELECT id, price FROM products LIMIT 1');
    if (productResult.rows.length === 0) {
      console.log('❌ No hay productos en la base de datos');
      return;
    }
    const product = productResult.rows[0];
    console.log('📦 Producto encontrado:', product);
    
    // Crear una venta de prueba
    console.log('💰 Creando venta de prueba...');
    
    await db.query('BEGIN');
    
    // Crear la venta
    const saleResult = await db.query(
      'INSERT INTO sales (total, payment_method, seller_id) VALUES ($1, $2, $3) RETURNING id',
      [product.price, 'efectivo', userId]
    );
    
    const saleId = saleResult.rows[0].id;
    console.log('✅ Venta creada con ID:', saleId);
    
    // Crear item de venta
    await db.query(
      'INSERT INTO sale_items (sale_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
      [saleId, product.id, 1, product.price]
    );
    console.log('✅ Item de venta creado');
    
    // Actualizar stock
    await db.query(
      'UPDATE products SET stock = stock - 1 WHERE id = $1',
      [product.id]
    );
    console.log('✅ Stock actualizado');
    
    await db.query('COMMIT');
    console.log('🎉 Venta de prueba creada exitosamente');
    
    // Verificar la venta
    const verifyResult = await db.query(
      'SELECT s.*, si.* FROM sales s JOIN sale_items si ON s.id = si.sale_id WHERE s.id = $1',
      [saleId]
    );
    console.log('🔍 Venta verificada:', verifyResult.rows);
    
    process.exit(0);
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('❌ Error probando ventas:', error);
    process.exit(1);
  }
}

testSales();
