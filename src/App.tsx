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
    <main style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'system-ui' }}>
      <h1>Costita — cálculo de costos</h1>
      <section style={{ display: 'grid', gap: '0.75rem' }}>
        <label>Precio compra <input value={price} onChange={(e) => setPrice(e.target.value)} /></label>
        <label>Cantidad compra <input value={qty} onChange={(e) => setQty(e.target.value)} />
          <select value={unit} onChange={(e) => setUnit(e.target.value as 'kg' | 'g')}>
            <option value="kg">kg</option><option value="g">g</option>
          </select>
        </label>
        <label>Cantidad usada (g) <input value={used} onChange={(e) => setUsed(e.target.value)} /></label>
        <label>Rendimiento (unidades) <input value={yieldQty} onChange={(e) => setYieldQty(e.target.value)} /></label>
        <label>Recargo % <input value={markup} onChange={(e) => setMarkup(e.target.value)} /></label>
      </section>
      <section style={{ marginTop: '1.5rem' }}>
        <p>Costo ingrediente: {formatARS(cost)}</p>
        <p>Costo por unidad: {formatARS(unitCost)}</p>
        <p>Precio sugerido: {formatARS(salePrice)}</p>
      </section>
    </main>
  )
}