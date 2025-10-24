# 🐾 PetShop POS - Instrucciones de Ejecución

## 📋 Requisitos Previos
- Node.js instalado
- PostgreSQL instalado y ejecutándose
- Variables de entorno configuradas

## 🚀 Pasos para Ejecutar

### 1. Configurar Variables de Entorno
Crear archivo `.env` en `petshop-pos-backend/api/` con:
```
DATABASE_URL=postgresql://usuario:password@localhost:5432/petshop_pos
JWT_SECRET=tu_jwt_secret_aqui
PORT=4000
```

### 2. Ejecutar Backend
```bash
cd petshop-pos-backend/api
npm install
node init_db.js  # Inicializar base de datos
npm start        # Iniciar servidor
```

### 3. Ejecutar Frontend
```bash
cd petshop-pos-frontend
npm install
npm run dev
```

## 👤 Usuarios de Prueba
- **Admin**: Documento: 12345678, Contraseña: admin123
- **Vendedor**: Documento: 87654321, Contraseña: vendedor123

## 🔧 Funcionalidades Implementadas
- ✅ Dashboard con estadísticas
- ✅ Gestión de inventario (solo admin)
- ✅ Sistema de ventas con carrito
- ✅ Métodos de pago (efectivo, nequi, daviplata)
- ✅ Calculadora de cambio
- ✅ Historial de ventas con filtros
- ✅ Protección de rutas por roles

## 🐛 Solución de Problemas

### Si las ventas no se guardan:

1. **Ejecutar diagnóstico completo:**
   ```bash
   cd petshop-pos-backend/api
   node diagnostico.js
   ```

2. **Verificar conexión a BD:**
   ```bash
   node test_connection.js
   ```

3. **Probar creación de ventas:**
   ```bash
   node test_sales.js
   ```

4. **Verificar servidor:**
   ```bash
   node test_server.js
   ```

### Problemas comunes:
- ❌ **Servidor no ejecutándose**: `npm start`
- ❌ **BD no conectada**: Verificar DATABASE_URL en .env
- ❌ **Puerto ocupado**: Cambiar puerto en .env
- ❌ **Tablas no creadas**: Ejecutar `node init_db.js`
