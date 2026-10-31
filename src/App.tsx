import { useEffect, useState } from 'react'
import { ingredientCost, unitCostPerUnit, priceByMarkup, formatARS, unitCost } from './domain/costing'
import { fetchIpcMonthly } from './lib/ipc'
import { LocalStorageRepository, newEntity, type Entity } from './data/repository'
import type { Unit } from './domain/costing'
import InsumosPage from './components/InsumosPage'
import RecetasPage from './components/RecetasPage'
import ProductosPage from './components/ProductosPage'
import StockPage from './components/StockPage'
import DashboardPage from './components/DashboardPage'
import ReportesPage from './components/ReportesPage'
import ConfigPage from './components/ConfigPage'
import ProduccionPage from './components/ProduccionPage'
import PreciosPage from './components/PreciosPage'
import ComprasPage from './components/ComprasPage'

interface MateriaPrima extends Entity {
  name: string
  price: number
  quantity: number
  unit: Unit
  stock: number
}

const repo = new LocalStorageRepository<MateriaPrima>('materias-primas')

export default function App() {
  const [tab, setTab] = useState<'dashboard' | 'calc' | 'mp' | 'insumos' | 'recetas' | 'productos' | 'stock' | 'reportes' | 'config' | 'produccion' | 'precios' | 'compras'>('dashboard')

  // calculator state
  const [price, setPrice] = useState('1800')
  const [qty, setQty] = useState('1')
  const [unit, setUnit] = useState<'kg' | 'g'>('kg')
  const [used, setUsed] = useState('250')
  const [yieldQty, setYieldQty] = useState('12')
  const [markup, setMarkup] = useState('40')
  const [ipc, setIpc] = useState<{ date: string; value: number } | null>(null)

  // materias primas state
  const [items, setItems] = useState<MateriaPrima[]>([])
  const [name, setName] = useState('')
  const [mpPrice, setMpPrice] = useState('')
  const [mpQty, setMpQty] = useState('')
  const [mpUnit, setMpUnit] = useState<Unit>('kg')
  const [mpStock, setMpStock] = useState('')

  useEffect(() => {
    fetchIpcMonthly(1).then((pts) => {
      if (pts.length) setIpc(pts[pts.length - 1])
    }).catch(() => setIpc(null))
  }, [])

  useEffect(() => {
    repo.list().then(setItems)
  }, [])

  const cost = ingredientCost(used, 'g', price, qty, unit)
  const unitCostVal = unitCostPerUnit(cost, yieldQty)
  const salePrice = priceByMarkup(unitCostVal, markup)

  async function addMp(e: React.FormEvent) {
    e.preventDefault()
    const entity = newEntity<Omit<MateriaPrima, keyof Entity>>({
      name,
      price: Number(mpPrice),
      quantity: Number(mpQty),
      unit: mpUnit,
      stock: Number(mpStock),
    })
    await repo.save(entity)
    setItems(await repo.list())
    setName(''); setMpPrice(''); setMpQty(''); setMpStock('')
  }

  return (
    <main className="mx-auto max-w-6xl p-6 font-body bg-cream-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-navy-800">Blue Velvet Insumos</h1>
      <p className="text-sm text-silver-500">Gestión de costos, recetas y stock</p>
      <nav className="mt-4 flex flex-wrap gap-2">
        <button className={`rounded-xl px-3 py-1 ${tab === 'dashboard' ? 'bg-navy-800 text-white' : 'bg-silver-100'}`} onClick={() => setTab('dashboard')}>Inicio</button>
        <button className={`rounded-xl px-3 py-1 ${tab === 'calc' ? 'bg-navy-800 text-white' : 'bg-silver-100'}`} onClick={() => setTab('calc')}>Calculadora</button>
        <button className={`rounded-xl px-3 py-1 ${tab === 'mp' ? 'bg-navy-800 text-white' : 'bg-silver-100'}`} onClick={() => setTab('mp')}>Materias primas</button>
        <button className={`rounded-xl px-3 py-1 ${tab === 'insumos' ? 'bg-navy-800 text-white' : 'bg-silver-100'}`} onClick={() => setTab('insumos')}>Insumos</button>
        <button className={`rounded-xl px-3 py-1 ${tab === 'recetas' ? 'bg-navy-800 text-white' : 'bg-silver-100'}`} onClick={() => setTab('recetas')}>Recetas</button>
        <button className={`rounded-xl px-3 py-1 ${tab === 'productos' ? 'bg-navy-800 text-white' : 'bg-silver-100'}`} onClick={() => setTab('productos')}>Productos</button>
        <button className={`rounded-xl px-3 py-1 ${tab === 'stock' ? 'bg-navy-800 text-white' : 'bg-silver-100'}`} onClick={() => setTab('stock')}>Stock</button>
        <button className={`rounded-xl px-3 py-1 ${tab === 'reportes' ? 'bg-navy-800 text-white' : 'bg-silver-100'}`} onClick={() => setTab('reportes')}>Reportes</button>
        <button className={`rounded-xl px-3 py-1 ${tab === 'config' ? 'bg-navy-800 text-white' : 'bg-silver-100'}`} onClick={() => setTab('config')}>Configuración</button>
        <button className={`rounded-xl px-3 py-1 ${tab === 'produccion' ? 'bg-navy-800 text-white' : 'bg-silver-100'}`} onClick={() => setTab('produccion')}>Producción</button>
        <button className={`rounded-xl px-3 py-1 ${tab === 'precios' ? 'bg-navy-800 text-white' : 'bg-silver-100'}`} onClick={() => setTab('precios')}>Precios</button>
        <button className={`rounded-xl px-3 py-1 ${tab === 'compras' ? 'bg-navy-800 text-white' : 'bg-silver-100'}`} onClick={() => setTab('compras')}>Compras</button>
      </nav>

      {tab === 'dashboard' && <DashboardPage />}
      {tab === 'calc' && (
        <>
          <section className="mt-4 grid gap-3">
            <label className="flex flex-col gap-1">Precio compra<input className="rounded-xl border px-3 py-2" value={price} onChange={(e) => setPrice(e.target.value)} /></label>
            <label className="flex flex-col gap-1">Cantidad compra<div className="flex gap-2"><input className="flex-1 rounded-xl border px-3 py-2" value={qty} onChange={(e) => setQty(e.target.value)} /><select className="rounded-xl border px-3 py-2" value={unit} onChange={(e) => setUnit(e.target.value as 'kg' | 'g')}><option value="kg">kg</option><option value="g">g</option></select></div></label>
            <label className="flex flex-col gap-1">Cantidad usada (g)<input className="rounded-xl border px-3 py-2" value={used} onChange={(e) => setUsed(e.target.value)} /></label>
            <label className="flex flex-col gap-1">Rendimiento (unidades)<input className="rounded-xl border px-3 py-2" value={yieldQty} onChange={(e) => setYieldQty(e.target.value)} /></label>
            <label className="flex flex-col gap-1">Recargo %<input className="rounded-xl border px-3 py-2" value={markup} onChange={(e) => setMarkup(e.target.value)} /></label>
          </section>
          <section className="mt-6 space-y-1">
            <p>Costo ingrediente: {formatARS(cost)}</p>
            <p>Costo por unidad: {formatARS(unitCostVal)}</p>
            <p>Precio sugerido: {formatARS(salePrice)}</p>
            {ipc && <p className="text-sm text-silver-500">IPC último ({ipc.date}): {ipc.value.toFixed(2)}</p>}
          </section>
        </>
      )}

      {tab === 'insumos' && <InsumosPage />}
      {tab === 'recetas' && <RecetasPage />}
      {tab === 'productos' && <ProductosPage />}
      {tab === 'stock' && <StockPage />}
      {tab === 'reportes' && <ReportesPage />}
      {tab === 'config' && <ConfigPage />}
      {tab === 'produccion' && <ProduccionPage />}
      {tab === 'precios' && <PreciosPage />}
      {tab === 'compras' && <ComprasPage />}
      {tab === 'mp' && (
        <>
          <form onSubmit={addMp} className="mt-4 grid gap-3 md:grid-cols-5">
            <input className="rounded-xl border px-3 py-2" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="rounded-xl border px-3 py-2" placeholder="Precio" type="number" value={mpPrice} onChange={(e) => setMpPrice(e.target.value)} required />
            <input className="rounded-xl border px-3 py-2" placeholder="Cantidad" type="number" value={mpQty} onChange={(e) => setMpQty(e.target.value)} required />
            <select className="rounded-xl border px-3 py-2" value={mpUnit} onChange={(e) => setMpUnit(e.target.value as Unit)}>
              <option value="kg">kg</option><option value="g">g</option><option value="L">L</option><option value="ml">ml</option><option value="u">u</option>
            </select>
            <input className="rounded-xl border px-3 py-2" placeholder="Stock" type="number" value={mpStock} onChange={(e) => setMpStock(e.target.value)} />
            <button className="rounded-xl bg-navy-800 px-3 py-2 text-white md:col-span-5" type="submit">Agregar materia prima</button>
          </form>
          <table className="mt-6 w-full text-left text-sm">
            <thead><tr><th>Nombre</th><th>Precio</th><th>Cant.</th><th>Unidad</th><th>Costo base</th><th>Stock</th></tr></thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="py-2">{m.name}</td>
                  <td>{m.price}</td>
                  <td>{m.quantity}</td>
                  <td>{m.unit}</td>
                  <td>{formatARS(unitCost(m.price, m.quantity, m.unit))}</td>
                  <td>{m.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  )
}