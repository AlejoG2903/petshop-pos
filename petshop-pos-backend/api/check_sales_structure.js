import db from './src/services/db.js';

async function checkSalesStructure() {
  try {
    console.log('🔍 Verificando estructura de la tabla sales...');
    
    // Verificar datos existentes
    const existingSales = await db.query('SELECT * FROM sales LIMIT 5');
    console.log('📊 Ventas existentes:', existingSales.rows);
    
    // Verificar si user_id o seller_id tienen datos
    const userData = await db.query('SELECT COUNT(*) as count FROM sales WHERE user_id IS NOT NULL');
    const sellerData = await db.query('SELECT COUNT(*) as count FROM sales WHERE seller_id IS NOT NULL');
    
    console.log('👤 Ventas con user_id:', userData.rows[0].count);
    console.log('👤 Ventas con seller_id:', sellerData.rows[0].count);
    
    if (parseInt(userData.rows[0].count) > 0) {
      console.log('✅ Usar user_id (tiene datos existentes)');
    } else if (parseInt(sellerData.rows[0].count) > 0) {
      console.log('✅ Usar seller_id (tiene datos existentes)');
    } else {
      console.log('ℹ️ Ambas columnas están vacías, usar seller_id (nueva)');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkSalesStructure();
