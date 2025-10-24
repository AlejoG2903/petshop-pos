import fs from 'fs';
import path from 'path';
import db from './src/services/db.js';

async function initializeDatabase() {
  try {
    console.log('🔄 Inicializando base de datos...');
    
    // Leer y ejecutar el esquema
    const schemaPath = path.join(process.cwd(), 'DB_SCHEMA.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    await db.query(schemaSQL);
    console.log('✅ Esquema de base de datos creado');
    
    // Leer y ejecutar datos de prueba
    const seedPath = path.join(process.cwd(), 'seed_data.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    await db.query(seedSQL);
    console.log('✅ Datos de prueba insertados');
    
    console.log('🎉 Base de datos inicializada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    process.exit(1);
  }
}

initializeDatabase();
