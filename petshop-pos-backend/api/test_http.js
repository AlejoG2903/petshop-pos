import http from 'http';

const postData = JSON.stringify({
  items: [
    {
      product_id: 2,
      quantity: 5,
      price: 10000
    },
    {
      product_id: 3,
      quantity: 4,
      price: 12000
    }
  ],
  payment_method: 'nequi',
  total: 98000,
  seller_id: 3
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/sales',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Probando petición HTTP...');
console.log('📤 Datos:', postData);

const req = http.request(options, (res) => {
  console.log('📊 Status:', res.statusCode);
  console.log('📋 Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📥 Respuesta:', data);
    if (res.statusCode === 200) {
      console.log('✅ Petición exitosa');
    } else {
      console.log('❌ Error en la petición');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error);
});

req.write(postData);
req.end();
