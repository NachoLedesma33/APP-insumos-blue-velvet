import { useEffect, useState } from 'react'
import { LocalStorageRepository, newEntity, type Entity } from '../data/repository'
import { ingredientCost, formatARS } from '../domain/costing'
import type { Unit } from '../domain/costing'

interface MateriaPrima extends Entity {
  name: string
  price: number
  quantity: number
  unit: Unit
}

interface Ingrediente {
  materiaPrimaId: string
  quantity: number
  unit: Unit
}

interface Receta extends Entity {
  name: string
  yieldQty: number
  ingredientes: Ingrediente[]
  extraCost: number
}

const mpRepo = new LocalStorageRepository<MateriaPrima>('materias-primas')
const recetaRepo = new LocalStorageRepository<Receta>('recetas')

export default function RecetasPage() {
  const [mps, setMps] = useState<MateriaPrima[]>([])
  const [recetas, setRecetas] = useState<Receta[]>([])
  const [name, setName] = useState('')
  const [yieldQty, setYieldQty] = useState('1')
  const [extraCost, setExtraCost] = useState('0')
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [selMp, setSelMp] = useState('')
  const [selQty, setSelQty] = useState('')
  const [selUnit, setSelUnit] = useState<Unit>('g')

  useEffect(() => {
    mpRepo.list().then(setMps)
    recetaRepo.list().then(setRecetas)
  }, [])

  function addIngrediente() {
    if (!selMp || !selQty) return
    setIngredientes([...ingredientes, { materiaPrimaId: selMp, quantity: Number(selQty), unit: selUnit }])
    setSelQty('')
  }

  const materialCost = ingredientes.reduce((acc, ing) => {
    const mp = mps.find((m) => m.id === ing.materiaPrimaId)
    if (!mp) return acc
    return acc + Number(ingredientCost(ing.quantity, ing.unit, mp.price, mp.quantity, mp.unit))
  }, 0)

  const lotCost = materialCost + Number(extraCost || 0)
  const unitCost = Number(yieldQty) > 0 ? lotCost / Number(yieldQty) : 0

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const entity = newEntity<Omit<Receta, keyof Entity>>({
      name, yieldQty: Number(yieldQty), ingredientes, extraCost: Number(extraCost || 0),
    })
    await recetaRepo.save(entity)
    setRecetas(await recetaRepo.list())
    setName(''); setYieldQty('1'); setExtraCost('0'); setIngredientes([])
  }

  return (
    <>
      <form onSubmit={save} className="mt-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <input className="rounded border px-3 py-2" placeholder="Nombre receta" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="rounded border px-3 py-2" placeholder="Rendimiento" type="number" value={yieldQty} onChange={(e) => setYieldQty(e.target.value)} required />
          <input className="rounded border px-3 py-2" placeholder="Costos adicionales" type="number" value={extraCost} onChange={(e) => setExtraCost(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <select className="rounded border px-3 py-2" value={selMp} onChange={(e) => setSelMp(e.target.value)}>
            <option value="">Materia prima</option>
            {mps.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input className="rounded border px-3 py-2" placeholder="Cantidad" type="number" value={selQty} onChange={(e) => setSelQty(e.target.value)} />
          <select className="rounded border px-3 py-2" value={selUnit} onChange={(e) => setSelUnit(e.target.value as Unit)}>
            <option value="g">g</option><option value="kg">kg</option><option value="ml">ml</option><option value="L">L</option><option value="u">u</option>
          </select>
          <button type="button" className="rounded bg-slate-200 px-3 py-2" onClick={addIngrediente}>Agregar ingrediente</button>
        </div>
        <ul className="text-sm">
          {ingredientes.map((ing, i) => {
            const mp = mps.find((m) => m.id === ing.materiaPrimaId)
            return <li key={i}>{mp?.name ?? '?'} — {ing.quantity} {ing.unit}</li>
          })}
        </ul>
        <div className="text-sm space-y-1">
          <p>Costo material: {formatARS(materialCost as any)}</p>
          <p>Costo lote: {formatARS(lotCost as any)}</p>
          <p>Costo por unidad: {formatARS(unitCost as any)}</p>
        </div>
        <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">Guardar receta</button>
      </form>

      <table className="mt-6 w-full text-left text-sm">
        <thead><tr><th>Nombre</th><th>Rendimiento</th><th>Costo lote</th></tr></thead>
        <tbody>
          {recetas.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="py-2">{r.name}</td>
              <td>{r.yieldQty}</td>
              <td>{formatARS((r.ingredientes.reduce((a, ing) => {
                const mp = mps.find((m) => m.id === ing.materiaPrimaId)
                if (!mp) return a
                return a + Number(ingredientCost(ing.quantity, ing.unit, mp.price, mp.quantity, mp.unit))
              }, 0) + r.extraCost) as any)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}