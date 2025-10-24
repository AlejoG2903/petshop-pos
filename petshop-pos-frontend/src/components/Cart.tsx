import React from 'react'
import api from '../api/axios'

export default function Cart({ items, onChange, onClear }: any) {
  const total = items.reduce((s:any,i:any)=>s + i.price * i.qty, 0)
  async function checkout() {
    const payload = { items: items.map((it:any)=>({ id: it.id, quantity: it.qty, price: it.price })), total, paymentMethod: 'EFECTIVO', sellerId: 1 }
    const res = await api.post('/api/sales', payload)
    // try printing (example ip)
    try {
      await api.post('/api/sales/print', { saleId: res.data.saleId, printerIp: import.meta.env.VITE_PRINTER_IP || '192.168.1.100' })
    } catch (err) {
      console.warn('No se pudo imprimir automáticamente', err)
    }
    onClear()
    alert('Venta registrada. ID: ' + res.data.saleId)
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold">Carrito</h3>
      <div className="mt-2 space-y-2">
        {items.map((it:any)=>(
          <div key={it.id} className="flex justify-between">
            <div>{it.name} x {it.qty}</div>
            <div>${(it.price*it.qty).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between items-center">
        <div>Total: <strong>${total.toFixed(2)}</strong></div>
        <div className="space-x-2">
          <button className="button" onClick={checkout} disabled={items.length===0}>Pagar</button>
          <button className="px-3 py-1 border rounded" onClick={onClear}>Limpiar</button>
        </div>
      </div>
    </div>
  )
}
