import db from "../services/db.js";

export const reportsController = {
  async getDashboardStats(req, res) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Total de ventas del día
      const salesTodayResult = await db.query(
        'SELECT COALESCE(SUM(total), 0) as total_sales FROM sales WHERE date::date = $1',
        [today]
      );
      
      // Ticket promedio del día
      const avgTicketResult = await db.query(
        'SELECT COALESCE(AVG(total), 0) as avg_ticket FROM sales WHERE date::date = $1',
        [today]
      );
      
      // Ventas por método de pago del día
      const salesByPaymentResult = await db.query(
        `SELECT 
          payment_method,
          COALESCE(SUM(total), 0) as total
        FROM sales 
        WHERE date::date = $1 
        GROUP BY payment_method`,
        [today]
      );
      
      // Procesar ventas por método de pago
      const salesByPaymentMethod = {
        efectivo: 0,
        nequi: 0,
        daviplata: 0
      };
      
      salesByPaymentResult.rows.forEach(row => {
        if (salesByPaymentMethod.hasOwnProperty(row.payment_method)) {
          salesByPaymentMethod[row.payment_method] = parseFloat(row.total);
        }
      });
      
      res.json({
        totalSalesToday: parseFloat(salesTodayResult.rows[0].total_sales),
        averageTicket: parseFloat(avgTicketResult.rows[0].avg_ticket),
        salesByPaymentMethod
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ message: 'Error al obtener las estadísticas del dashboard' });
    }
  }
};
