import db from './src/services/db.js';

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    
    // Probar conexión
    const result = await db.query('SELECT NOW() as current_time');
    console.log('✅ Conexión exitosa:', result.rows[0]);
    
    // Verificar tablas
    const tablesResult = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 Tablas disponibles:', tablesResult.rows.map(r => r.table_name));
    
    // Verificar usuarios
    const usersResult = await db.query('SELECT id, document, name, role FROM users');
    console.log('👥 Usuarios en la BD:', usersResult.rows);
    
    // Verificar productos
    const productsResult = await db.query('SELECT id, name, stock FROM products');
    console.log('📦 Productos en la BD:', productsResult.rows);
    
    // Verificar ventas
    const salesResult = await db.query('SELECT COUNT(*) as total_sales FROM sales');
    console.log('💰 Total de ventas:', salesResult.rows[0].total_sales);
    
    console.log('🎉 Diagnóstico completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el diagnóstico:', error);
    process.exit(1);
  }
}

testConnection();
