import React, { useState } from 'react'
import api from '../api/axios'

type Props = {
  onSaved: (p: any) => void
  editing?: any
}

export default function ProductForm({ onSaved, editing }: Props) {
  const [name, setName] = useState(editing?.name || '')
  const [price, setPrice] = useState(editing?.price || 0)
  const [stock, setStock] = useState(editing?.stock || 0)
  const [category, setCategory] = useState(editing?.category || '')

  async function save() {
    const payload = { name, price: Number(price), stock: Number(stock), category }
    if (editing) {
      const res = await api.put(`/api/products/${editing.id}`, payload)
      onSaved(res.data)
    } else {
      const res = await api.post('/api/products', payload)
      onSaved(res.data)
      setName(''); setPrice(0); setStock(0); setCategory('')
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="grid grid-cols-2 gap-2">
        <input className="input" placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Categoría" value={category} onChange={e=>setCategory(e.target.value)} />
        <input className="input" placeholder="Precio" type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} />
        <input className="input" placeholder="Stock" type="number" value={stock} onChange={e=>setStock(Number(e.target.value))} />
      </div>
      <div className="mt-3 flex justify-end">
        <button className="button" onClick={save}>{editing? 'Actualizar' : 'Crear'}</button>
      </div>
    </div>
  )
}
