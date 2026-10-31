import { useEffect, useState } from 'react'
import { LocalStorageRepository, newEntity, type Entity } from '../data/repository'
import { priceByMarkup, priceByMargin, formatARS, ingredientCost } from '../domain/costing'
import type { Unit } from '../domain/costing'

interface Ingrediente { materiaPrimaId: string; quantity: number; unit: Unit }
interface MateriaPrima extends Entity { name: string; price: number; quantity: number; unit: Unit }
interface Receta extends Entity { name: string; yieldQty: number; ingredientes: Ingrediente[]; extraCost: number }
interface Producto extends Entity {
  name: string
  recetaId: string
  presentation: string
  method: 'manual' | 'margen' | 'recargo'
  targetPercent: number
  salePrice: number
}

const mpRepo = new LocalStorageRepository<MateriaPrima>('materias-primas')
const recetaRepo = new LocalStorageRepository<Receta>('recetas')
const prodRepo = new LocalStorageRepository<Producto>('productos')

function recetaUnitCost(r: Receta, mps: MateriaPrima[]): number {
  const material = r.ingredientes.reduce((acc, ing) => {
    const mp = mps.find((m) => m.id === ing.materiaPrimaId)
    if (!mp) return acc
    return acc + Number(ingredientCost(ing.quantity, ing.unit, mp.price, mp.quantity, mp.unit))
  }, 0)
  const lot = material + r.extraCost
  return r.yieldQty > 0 ? lot / r.yieldQty : 0
}

export default function ProductosPage() {
  const [mps, setMps] = useState<MateriaPrima[]>([])
  const [recetas, setRecetas] = useState<Receta[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [name, setName] = useState('')
  const [recetaId, setRecetaId] = useState('')
  const [presentation, setPresentation] = useState('')
  const [method, setMethod] = useState<'manual' | 'margen' | 'recargo'>('margen')
  const [target, setTarget] = useState('30')
  const [salePrice, setSalePrice] = useState('')

  useEffect(() => {
    mpRepo.list().then(setMps)
    recetaRepo.list().then(setRecetas)
    prodRepo.list().then(setProductos)
  }, [])

  const receta = recetas.find((r) => r.id === recetaId)
  const cost = receta ? recetaUnitCost(receta, mps) : 0
  const suggestedMarkup = cost > 0 ? priceByMarkup(cost, Number(target)) : 0
  const suggestedMargin = cost > 0 ? priceByMargin(cost, Number(target)) : 0

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const entity = newEntity<Omit<Producto, keyof Entity>>({
      name, recetaId, presentation, method, targetPercent: Number(target), salePrice: Number(salePrice || 0),
    })
    await prodRepo.save(entity)
    setProductos(await prodRepo.list())
    setName(''); setRecetaId(''); setPresentation(''); setSalePrice('')
  }

  return (
    <>
      <form onSubmit={save} className="mt-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <input className="rounded border px-3 py-2" placeholder="Nombre comercial" value={name} onChange={(e) => setName(e.target.value)} required />
          <select className="rounded border px-3 py-2" value={recetaId} onChange={(e) => setRecetaId(e.target.value)} required>
            <option value="">Receta</option>
            {recetas.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <input className="rounded border px-3 py-2" placeholder="Presentación" value={presentation} onChange={(e) => setPresentation(e.target.value)} />
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <select className="rounded border px-3 py-2" value={method} onChange={(e) => setMethod(e.target.value as any)}>
            <option value="manual">Manual</option><option value="margen">Margen</option><option value="recargo">Recargo</option>
          </select>
          <input className="rounded border px-3 py-2" placeholder="Objetivo %" type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
          <input className="rounded border px-3 py-2" placeholder="Precio venta" type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
          <div className="rounded border px-3 py-2 text-sm">Costo unit: {formatARS(cost)}</div>
        </div>
        {cost > 0 && (
          <div className="text-sm space-y-1">
            <p>Sugerido por recargo {target}%: {formatARS(suggestedMarkup)}</p>
            <p>Sugerido por margen {target}%: {formatARS(suggestedMargin)}</p>
          </div>
        )}
        <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">Guardar producto</button>
      </form>

      <table className="mt-6 w-full text-left text-sm">
        <thead><tr><th>Nombre</th><th>Presentación</th><th>Método</th><th>Objetivo</th><th>Precio</th></tr></thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="py-2">{p.name}</td><td>{p.presentation}</td><td>{p.method}</td><td>{p.targetPercent}%</td><td>{formatARS(p.salePrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}