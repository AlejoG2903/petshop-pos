import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// ... (Interfaces DashboardStats y Sale, y la función formatCurrency se mantienen igual) ...
// (Omitiendo interfaces y formatCurrency por brevedad, asume que están al inicio)

// ...

interface DashboardStats {
  totalSalesToday: number;
  averageTicket: number;
  salesByPaymentMethod: {
    efectivo: number;
    nequi: number;
    daviplata: number;
  };
}

interface Sale {
  id: number;
  date: string;
  total: number;
  payment_method: string;
  seller_name: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(amount);
};


// --- Lógica de fechas (nueva) ---
const getToday = () => new Date().toISOString().split('T')[0];

const getDateRange = (key: string): { startDate: string, endDate: string } => {
  const today = new Date();
  const endDate = getToday();
  let startDate: Date;

  switch (key) {
    case 'today':
      startDate = today;
      break;
    case 'last_7_days':
      startDate = new Date(today.setDate(today.getDate() - 6)); // Hoy y 6 días atrás (7 en total)
      break;
    case 'last_30_days':
      startDate = new Date(today.setDate(today.getDate() - 29)); // Hoy y 29 días atrás (30 en total)
      break;
    case 'current_month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case 'custom':
    default:
      return { startDate: endDate, endDate: endDate }; // Default o Personalizado
  }
  
  // Devuelve la fecha de inicio en formato 'YYYY-MM-DD'
  return { 
    startDate: startDate.toISOString().split('T')[0], 
    endDate: endDate 
  };
};

export default function Dashboard() {
  // ... (State inicial se mantiene igual) ...
  const initialRange = getDateRange('today');
  
  const [stats, setStats] = useState<DashboardStats>({
    totalSalesToday: 0,
    averageTicket: 0,
    salesByPaymentMethod: {
      efectivo: 0,
      nequi: 0,
      daviplata: 0
    }
  });
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [dateRange, setDateRange] = useState(initialRange);
  const [dateFilterKey, setDateFilterKey] = useState('today'); // Nuevo state para el select
  const [loading, setLoading] = useState(true);

  // Usa useCallback para memoizar la función y que no cambie en cada render
  const fetchSalesHistory = useCallback(async (start: string, end: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/sales/history?startDate=${start}&endDate=${end}`);
      setSalesHistory(response.data);
    } catch (error) {
      console.error('Error fetching sales history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect para cargar datos iniciales y cuando cambian las fechas (por el select o inputs)
  useEffect(() => {
    fetchDashboardData();
  }, []); // Solo se ejecuta al montar

  useEffect(() => {
    // Al inicio, carga los datos con el rango inicial ('today')
    // y cada vez que el rango de fechas (startDate/endDate) cambie
    if (dateRange.startDate && dateRange.endDate) {
        fetchSalesHistory(dateRange.startDate, dateRange.endDate);
    }
  }, [dateRange.startDate, dateRange.endDate, fetchSalesHistory]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/reports/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Función para manejar el cambio en el selector de rango
  const handleDateFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setDateFilterKey(key);

    if (key !== 'custom') {
        const newRange = getDateRange(key);
        setDateRange(newRange); // Esto dispara el useEffect para recargar el historial
    }
    // Si es 'custom', los campos de fecha aparecerán para que el usuario defina el rango
    // y el useEffect se disparará cuando el usuario cambie las fechas de inicio/fin manualmente.
  };

  // Función para manejar el cambio manual de fechas (solo visible en 'custom')
  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'startDate' | 'endDate') => {
    setDateRange(prev => ({
        ...prev,
        [type]: e.target.value
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Dashboard 📊</h2>

      {/* ... (Estadísticas principales y Ventas por método de pago se mantienen igual) ... */}
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Ventas del día</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {formatCurrency(stats.totalSalesToday)}
          </p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Ticket promedio</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            {formatCurrency(stats.averageTicket)}
          </p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Total ventas</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
            {salesHistory.length}
          </p>
        </div>
      </div>

      {/* Ventas por método de pago */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Ventas por método de pago</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 dark:text-green-200">💰 Efectivo</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(stats.salesByPaymentMethod.efectivo)}
            </p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200">📱 Nequi</h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(stats.salesByPaymentMethod.nequi)}
            </p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 dark:text-purple-200">💳 Daviplata</h4>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(stats.salesByPaymentMethod.daviplata)}
            </p>
          </div>
        </div>
      </div>

      {/* Historial de ventas */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h3 className="text-lg font-semibold mb-4 md:mb-0">Historial de ventas</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            
            {/* Nuevo selector de rango de fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rango de fecha
              </label>
              <select
                value={dateFilterKey}
                onChange={handleDateFilterChange}
                className="input"
              >
                <option value="today">Hoy</option>
                <option value="last_7_days">Últimos 7 días</option>
                <option value="last_30_days">Últimos 30 días</option>
                <option value="current_month">Mes actual</option>
                <option value="custom">Rango personalizado</option>
              </select>
            </div>

            {/* Campos de fecha personalizados (solo se muestran si se selecciona 'custom') */}
            {dateFilterKey === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fecha inicio
                  </label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => handleCustomDateChange(e, 'startDate')}
                    className="input"
                    // Asegura que la fecha de inicio no sea posterior a la fecha fin
                    max={dateRange.endDate} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fecha fin
                  </label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => handleCustomDateChange(e, 'endDate')}
                    className="input"
                    // Asegura que la fecha fin no sea anterior a la fecha inicio
                    min={dateRange.startDate} 
                  />
                </div>
              </>
            )}
            
            {/* El botón de filtrar ya no es necesario si el filtro se aplica en el useEffect
                pero lo dejo por si quieres que la carga sea explícita.
                Si usas el useEffect de arriba, el botón no es necesario.
            */}
            {/* <button
              onClick={() => fetchSalesHistory(dateRange.startDate, dateRange.endDate)}
              className="btn btn-blue self-end"
            >
              Filtrar
            </button> */}

          </div>
        </div>

        {/* ... (Tabla de Historial de ventas se mantiene igual) ... */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Método de pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Vendedor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {salesHistory.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(sale.date).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(sale.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        sale.payment_method === 'efectivo' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : sale.payment_method === 'nequi'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}>
                        {sale.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {sale.seller_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}