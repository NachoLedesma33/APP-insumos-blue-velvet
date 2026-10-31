import { useEffect, useState } from 'react'
import { LocalStorageRepository, newEntity, type Entity } from '../data/repository'
import { unitCost, formatARS } from '../domain/costing'
import type { Unit } from '../domain/costing'

interface Insumo extends Entity {
  name: string
  price: number
  quantity: number
  unit: Unit
  stock: number
  stockMin: number
}

const repo = new LocalStorageRepository<Insumo>('insumos')

export default function InsumosPage() {
  const [items, setItems] = useState<Insumo[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('')
  const [unit, setUnit] = useState<Unit>('u')
  const [stock, setStock] = useState('')
  const [stockMin, setStockMin] = useState('')

  useEffect(() => { repo.list().then(setItems) }, [])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    const entity = newEntity<Omit<Insumo, keyof Entity>>({
      name, price: Number(price), quantity: Number(qty), unit, stock: Number(stock), stockMin: Number(stockMin),
    })
    await repo.save(entity)
    setItems(await repo.list())
    setName(''); setPrice(''); setQty(''); setStock(''); setStockMin('')
  }

  return (
    <>
      <form onSubmit={add} className="mt-4 grid gap-3 md:grid-cols-6">
        <input className="rounded-xl border px-3 py-2" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="rounded-xl border px-3 py-2" placeholder="Precio" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input className="rounded-xl border px-3 py-2" placeholder="Cantidad" type="number" value={qty} onChange={(e) => setQty(e.target.value)} required />
        <select className="rounded-xl border px-3 py-2" value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
          <option value="kg">kg</option><option value="g">g</option><option value="L">L</option><option value="ml">ml</option><option value="u">u</option>
        </select>
        <input className="rounded-xl border px-3 py-2" placeholder="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
        <input className="rounded-xl border px-3 py-2" placeholder="Stock mín" type="number" value={stockMin} onChange={(e) => setStockMin(e.target.value)} />
        <button className="rounded-xl bg-navy-800 px-3 py-2 text-white md:col-span-6" type="submit">Agregar insumo</button>
      </form>
      <table className="mt-6 w-full text-left text-sm">
        <thead><tr><th>Nombre</th><th>Precio</th><th>Cant.</th><th>Unidad</th><th>Costo base</th><th>Stock</th><th>Mín</th></tr></thead>
        <tbody>
          {items.map((m) => (
            <tr key={m.id} className="border-t">
              <td className="py-2">{m.name}</td><td>{m.price}</td><td>{m.quantity}</td><td>{m.unit}</td>
              <td>{formatARS(unitCost(m.price, m.quantity, m.unit))}</td><td>{m.stock}</td><td>{m.stockMin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}