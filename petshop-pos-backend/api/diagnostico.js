import { spawn } from 'child_process';

console.log('🔍 DIAGNÓSTICO COMPLETO DEL SISTEMA PETSHOP POS');
console.log('================================================');

async function runDiagnostic() {
  try {
    console.log('\n1️⃣ Probando conexión a la base de datos...');
    await runCommand('node', ['test_connection.js']);
    
    console.log('\n2️⃣ Probando creación de ventas...');
    await runCommand('node', ['test_sales.js']);
    
    console.log('\n3️⃣ Probando servidor backend...');
    await runCommand('node', ['test_server.js']);
    
    console.log('\n🎉 DIAGNÓSTICO COMPLETADO - TODO FUNCIONANDO');
  } catch (error) {
    console.error('\n❌ ERROR EN EL DIAGNÓSTICO:', error.message);
    console.log('\n💡 SOLUCIONES:');
    console.log('1. Verificar que PostgreSQL esté ejecutándose');
    console.log('2. Verificar variables de entorno (.env)');
    console.log('3. Ejecutar: npm start (para iniciar el servidor)');
    console.log('4. Verificar que el puerto 4000 esté disponible');
  }
}

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { 
      stdio: 'inherit',
      shell: true 
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Comando falló con código ${code}`));
      }
    });
  });
}

runDiagnostic();
