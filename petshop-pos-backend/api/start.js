import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 Iniciando PetShop POS Backend...');

// Función para ejecutar comandos
function runCommand(command, args = [], cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { 
      cwd, 
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

async function startServer() {
  try {
    console.log('📊 Inicializando base de datos...');
    await runCommand('node', ['init_db.js']);
    
    console.log('🌐 Iniciando servidor...');
    await runCommand('npm', ['start']);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

startServer();
