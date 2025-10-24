import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface PaymentMethod {
  type: 'efectivo' | 'nequi' | 'daviplata';
  label: string;
  icon: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { type: 'efectivo', label: 'Efectivo', icon: '💰' },
  { type: 'nequi', label: 'Nequi', icon: '📱' },
  { type: 'daviplata', label: 'Daviplata', icon: '💳' }
];

export default function Sales() {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'efectivo' | 'nequi' | 'daviplata' | null>(null);
  const [receivedAmount, setReceivedAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('No hay stock disponible para este producto');
      return;
    }

    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert('No hay suficiente stock disponible');
        return;
      }
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
      alert('No hay suficiente stock disponible');
      return;
    }

    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getChange = () => {
    if (selectedPaymentMethod === 'efectivo' && receivedAmount) {
      const received = parseFloat(receivedAmount);
      const total = getTotal();
      return Math.max(0, received - total);
    }
    return 0;
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    if (!selectedPaymentMethod) {
      alert('Selecciona un método de pago');
      return;
    }

    if (selectedPaymentMethod === 'efectivo' && (!receivedAmount || parseFloat(receivedAmount) < getTotal())) {
      alert('El monto recibido debe ser mayor o igual al total');
      return;
    }

    try {
      setProcessing(true);
      const saleData = {
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        payment_method: selectedPaymentMethod,
        total: getTotal(),
        seller_id: user?.id
      };

      await axios.post('http://localhost:4000/api/sales', saleData);
      
      // Limpiar carrito y formulario
      setCart([]);
      setSelectedPaymentMethod(null);
      setReceivedAmount('');
      
      alert('Venta completada exitosamente');
      fetchProducts(); // Actualizar stock
    } catch (error) {
      console.error('Error completing sale:', error);
      alert('Error al completar la venta');
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Registrar Venta 💰</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productos disponibles */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Productos Disponibles</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      {product.image ? (
                        <img
                          src={`http://localhost:4000${product.image}`}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded-lg"
                          onError={(e) => {
                            console.error('Error loading image in sales:', e);
                            console.log('Sales Image URL:', `http://localhost:4000${product.image}`);
                          }}
                          onLoad={() => {
                            console.log('Sales image loaded successfully:', `http://localhost:4000${product.image}`);
                          }}
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          📦
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{product.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(product.price)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Stock: {product.stock}
                        </p>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className="btn btn-blue text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ➕ Agregar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Carrito y checkout */}
        <div className="space-y-6">
          {/* Carrito */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Carrito de Compras</h3>
            {cart.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                El carrito está vacío
              </p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatCurrency(item.product.price)} c/u
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(getTotal())}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Método de pago */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Método de Pago</h3>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.type}
                  onClick={() => setSelectedPaymentMethod(method.type)}
                  className={`w-full p-3 rounded-lg border-2 transition-colors ${
                    selectedPaymentMethod === method.type
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-medium">{method.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Campo monto recibido para efectivo */}
            {selectedPaymentMethod === 'efectivo' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monto Recibido
                </label>
                <input
                  type="number"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  className="input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                {receivedAmount && (
                  <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                    <p className="text-sm">
                      <span className="font-medium">Cambio:</span> {formatCurrency(getChange())}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botón completar venta */}
          <button
            onClick={handleCompleteSale}
            disabled={cart.length === 0 || !selectedPaymentMethod || processing}
            className="w-full btn btn-green text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Procesando...' : '✅ Completar Venta'}
          </button>
        </div>
      </div>
    </div>
  );
}