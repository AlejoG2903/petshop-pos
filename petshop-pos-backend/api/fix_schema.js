import db from './src/services/db.js';

async function fixSchema() {
  try {
    console.log('🔧 Corrigiendo esquema de base de datos...');
    
    // Verificar si la columna seller_id existe
    const checkColumn = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'sales' AND column_name = 'seller_id'
    `);
    
    if (checkColumn.rows.length === 0) {
      console.log('➕ Agregando columna seller_id a la tabla sales...');
      await db.query('ALTER TABLE sales ADD COLUMN seller_id INTEGER REFERENCES users(id)');
      console.log('✅ Columna seller_id agregada');
    } else {
      console.log('✅ Columna seller_id ya existe');
    }
    
    // Verificar si la columna payment_method existe
    const checkPaymentMethod = await db.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'sales' AND column_name = 'payment_method'
    `);
    
    if (checkPaymentMethod.rows.length === 0) {
      console.log('➕ Agregando columna payment_method a la tabla sales...');
      await db.query('ALTER TABLE sales ADD COLUMN payment_method TEXT');
      console.log('✅ Columna payment_method agregada');
    } else {
      console.log('✅ Columna payment_method ya existe');
    }
    
    // Verificar estructura de la tabla sales
    const salesStructure = await db.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'sales'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Estructura actual de la tabla sales:');
    salesStructure.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    console.log('🎉 Esquema corregido exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error corrigiendo esquema:', error);
    process.exit(1);
  }
}

fixSchema();
