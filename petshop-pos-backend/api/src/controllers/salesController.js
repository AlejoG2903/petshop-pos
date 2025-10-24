import db from "../services/db.js";

export const salesController = {
  async createSale(req, res) {
    const { items, payment_method, total, seller_id } = req.body;
    
    try {
      // Iniciar transacción
      await db.query('BEGIN');
      
      // Crear la venta
      const saleResult = await db.query(
        'INSERT INTO sales (total, payment_method, seller_id) VALUES ($1, $2, $3) RETURNING id, date',
        [total, payment_method, seller_id]
      );
      
      const saleId = saleResult.rows[0].id;
      
      // Crear los items de la venta y actualizar stock
      for (const item of items) {
        // Insertar item de venta
        await db.query(
          'INSERT INTO sale_items (sale_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
          [saleId, item.product_id, item.quantity, item.price]
        );
        
        // Actualizar stock del producto
        await db.query(
          'UPDATE products SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );
      }
      
      // Confirmar transacción
      await db.query('COMMIT');
      
      res.json({
        success: true,
        sale_id: saleId,
        message: 'Venta registrada exitosamente'
      });
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error creating sale:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Error al registrar la venta',
        error: error.message,
        details: error.stack
      });
    }
  },

  async listSales(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      let query = `
        SELECT s.id, s.date, s.total, s.payment_method, u.name as seller_name
        FROM sales s
        JOIN users u ON s.seller_id = u.id
      `;
      
      const params = [];
      
      if (startDate && endDate) {
        query += ' WHERE s.date::date BETWEEN $1 AND $2';
        params.push(startDate, endDate);
      }
      
      query += ' ORDER BY s.date DESC';
      
      const result = await db.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error listing sales:', error);
      res.status(500).json({ message: 'Error al obtener las ventas' });
    }
  },

  async getSalesHistory(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      let query = `
        SELECT s.id, s.date, s.total, s.payment_method, u.name as seller_name
        FROM sales s
        JOIN users u ON s.seller_id = u.id
      `;
      
      const params = [];
      
      if (startDate && endDate) {
        query += ' WHERE s.date::date BETWEEN $1 AND $2';
        params.push(startDate, endDate);
      }
      
      query += ' ORDER BY s.date DESC';
      
      const result = await db.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error getting sales history:', error);
      res.status(500).json({ message: 'Error al obtener el historial de ventas' });
    }
  },

  async printSale(req, res) {
    // Implementar lógica de impresión si es necesario
    res.json({ message: 'Función de impresión no implementada' });
  },
};
