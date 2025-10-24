import axios from 'axios';

async function testServer() {
  try {
    console.log('🌐 Probando servidor backend...');
    
    // Probar endpoint de productos
    console.log('📦 Probando endpoint de productos...');
    const productsResponse = await axios.get('http://localhost:4000/api/products');
    console.log('✅ Productos obtenidos:', productsResponse.data.length, 'productos');
    
    // Probar endpoint de ventas
    console.log('💰 Probando endpoint de ventas...');
    const salesResponse = await axios.get('http://localhost:4000/api/sales');
    console.log('✅ Ventas obtenidas:', salesResponse.data.length, 'ventas');
    
    // Probar endpoint de dashboard
    console.log('📊 Probando endpoint de dashboard...');
    const dashboardResponse = await axios.get('http://localhost:4000/api/reports/dashboard');
    console.log('✅ Dashboard obtenido:', dashboardResponse.data);
    
    console.log('🎉 Servidor funcionando correctamente');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Servidor no está ejecutándose en http://localhost:4000');
      console.log('💡 Ejecuta: npm start');
    } else {
      console.error('❌ Error probando servidor:', error.message);
    }
    process.exit(1);
  }
}

testServer();
