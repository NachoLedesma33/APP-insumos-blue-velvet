import { useState } from 'react'
import { ingredientCost, unitCostPerUnit, priceByMarkup, formatARS } from './domain/costing'

export default function App() {
  const [price, setPrice] = useState('1800')
  const [qty, setQty] = useState('1')
  const [unit, setUnit] = useState<'kg' | 'g'>('kg')
  const [used, setUsed] = useState('250')
  const [yieldQty, setYieldQty] = useState('12')
  const [markup, setMarkup] = useState('40')

  const cost = ingredientCost(used, 'g', price, qty, unit)
  const unitCost = unitCostPerUnit(cost, yieldQty)
  const salePrice = priceByMarkup(unitCost, markup)

  return (
    <main className="mx-auto max-w-3xl p-6 font-sans">
      <h1 className="text-2xl font-semibold text-slate-900">Costita — cálculo de costos</h1>
      <section className="mt-4 grid gap-3">
        <label className="flex flex-col gap-1">
          Precio compra
          <input className="rounded border px-3 py-2" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          Cantidad compra
          <div className="flex gap-2">
            <input className="flex-1 rounded border px-3 py-2" value={qty} onChange={(e) => setQty(e.target.value)} />
            <select className="rounded border px-3 py-2" value={unit} onChange={(e) => setUnit(e.target.value as 'kg' | 'g')}>
              <option value="kg">kg</option><option value="g">g</option>
            </select>
          </div>
        </label>
        <label className="flex flex-col gap-1">
          Cantidad usada (g)
          <input className="rounded border px-3 py-2" value={used} onChange={(e) => setUsed(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          Rendimiento (unidades)
          <input className="rounded border px-3 py-2" value={yieldQty} onChange={(e) => setYieldQty(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          Recargo %
          <input className="rounded border px-3 py-2" value={markup} onChange={(e) => setMarkup(e.target.value)} />
        </label>
      </section>
      <section className="mt-6 space-y-1">
        <p>Costo ingrediente: {formatARS(cost)}</p>
        <p>Costo por unidad: {formatARS(unitCost)}</p>
        <p>Precio sugerido: {formatARS(salePrice)}</p>
      </section>
    </main>
  )
}