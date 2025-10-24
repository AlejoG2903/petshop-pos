import axios from 'axios';

async function testSaleRequest() {
  try {
    console.log('🧪 Probando petición de venta exacta...');
    
    // Datos de prueba basados en lo que veo en la imagen
    const saleData = {
      items: [
        {
          product_id: 2, // prueba 1
          quantity: 5,
          price: 10000
        },
        {
          product_id: 3, // prueba 2  
          quantity: 4,
          price: 12000
        }
      ],
      payment_method: 'nequi',
      total: 98000,
      seller_id: 3 // Alejandro
    };
    
    console.log('📤 Enviando datos:', JSON.stringify(saleData, null, 2));
    
    const response = await axios.post('http://localhost:4000/api/sales', saleData);
    console.log('✅ Respuesta exitosa:', response.data);
    
  } catch (error) {
    console.error('❌ Error en la petición:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testSaleRequest();
