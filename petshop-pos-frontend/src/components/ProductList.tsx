import React from 'react'

type Props = {
  products: any[]
  onEdit: (p:any)=>void
  onDelete: (id:number)=>void
  onAddToCart: (p:any)=>void
}

export default function ProductList({ products, onEdit, onDelete, onAddToCart }: Props) {
  return (
    <div className="bg-white rounded shadow overflow-auto">
      <table className="table">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p,i)=>(
            <tr key={p.id} className="border-t">
              <td className="p-2">{i+1}</td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">${Number(p.price).toFixed(2)}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2 space-x-2">
                <button className="px-2 py-1 bg-yellow-500 text-white rounded" onClick={()=>onEdit(p)}>Editar</button>
                <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={()=>onDelete(p.id)}>Eliminar</button>
                <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={()=>onAddToCart(p)}>Agregar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
