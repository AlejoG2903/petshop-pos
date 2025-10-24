import db from './src/services/db.js';

async function debugSale() {
  try {
    console.log('🔍 Debugging sale creation...');
    
    // Verificar que el servidor esté ejecutándose
    console.log('1️⃣ Verificando conexión a BD...');
    const testConnection = await db.query('SELECT NOW()');
    console.log('✅ BD conectada:', testConnection.rows[0]);
    
    // Verificar productos
    console.log('2️⃣ Verificando productos...');
    const products = await db.query('SELECT id, name, stock, price FROM products WHERE id IN (2, 3)');
    console.log('📦 Productos:', products.rows);
    
    // Verificar usuario
    console.log('3️⃣ Verificando usuario...');
    const user = await db.query('SELECT id, name FROM users WHERE id = 3');
    console.log('👤 Usuario:', user.rows);
    
    // Simular la transacción exacta
    console.log('4️⃣ Simulando transacción...');
    
    const items = [
      { product_id: 2, quantity: 5, price: 10000 },
      { product_id: 3, quantity: 4, price: 12000 }
    ];
    const payment_method = 'nequi';
    const total = 98000;
    const seller_id = 3;
    
    await db.query('BEGIN');
    
    // Crear la venta
    console.log('💰 Creando venta...');
    const saleResult = await db.query(
      'INSERT INTO sales (total, payment_method, seller_id) VALUES ($1, $2, $3) RETURNING id',
      [total, payment_method, seller_id]
    );
    const saleId = saleResult.rows[0].id;
    console.log('✅ Venta creada con ID:', saleId);
    
    // Crear items
    for (const item of items) {
      console.log('📦 Creando item:', item);
      await db.query(
        'INSERT INTO sale_items (sale_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [saleId, item.product_id, item.quantity, item.price]
      );
      
      console.log('📉 Actualizando stock para producto', item.product_id);
      await db.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }
    
    await db.query('COMMIT');
    console.log('🎉 Transacción completada exitosamente');
    
    // Verificar resultado
    const finalSale = await db.query(`
      SELECT s.*, si.* 
      FROM sales s 
      JOIN sale_items si ON s.id = si.sale_id 
      WHERE s.id = $1
    `, [saleId]);
    console.log('🔍 Venta final:', finalSale.rows);
    
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('❌ Error en debug:', error);
    console.error('Stack:', error.stack);
  }
}

debugSale();
