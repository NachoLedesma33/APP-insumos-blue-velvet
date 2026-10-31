import { useEffect, useState } from 'react'
import { LocalStorageRepository, newEntity, type Entity } from '../data/repository'
import type { Unit } from '../domain/costing'

interface MateriaPrima extends Entity { name: string; stock: number; unit: Unit }
interface Receta extends Entity { name: string; yieldQty: number; ingredientes: { materiaPrimaId: string; quantity: number; unit: Unit }[] }
interface Produccion extends Entity { recetaId: string; batches: number; units: number; note: string }
interface Movimiento extends Entity { articleType: string; articleId: string; type: string; quantity: number; note: string }

const mpRepo = new LocalStorageRepository<MateriaPrima>('materias-primas')
const recetaRepo = new LocalStorageRepository<Receta>('recetas')
const prodRepo = new LocalStorageRepository<Produccion>('producciones')
const movRepo = new LocalStorageRepository<Movimiento>('movimientos')

export default function ProduccionPage() {
  const [mps, setMps] = useState<MateriaPrima[]>([])
  const [recetas, setRecetas] = useState<Receta[]>([])
  const [recetaId, setRecetaId] = useState('')
  const [batches, setBatches] = useState('1')
  const [note, setNote] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    mpRepo.list().then(setMps)
    recetaRepo.list().then(setRecetas)
  }, [])

  const receta = recetas.find((r) => r.id === recetaId)
  const b = Number(batches) || 0

  const consumption = receta ? receta.ingredientes.map((ing) => {
    const mp = mps.find((m) => m.id === ing.materiaPrimaId)
    const qty = ing.quantity * b
    const enough = mp ? mp.stock >= qty : false
    return { ing, mp, qty, enough }
  }) : []

  const insufficient = consumption.some((c) => !c.enough)

  async function confirm() {
    if (!receta || b <= 0) return
    if (insufficient) { setMsg('Stock insuficiente para algún ingrediente.'); return }
    for (const c of consumption) {
      if (!c.mp) continue
      c.mp.stock -= c.qty
      await mpRepo.save(c.mp)
      await movRepo.save(newEntity<Omit<Movimiento, keyof Entity>>({
        articleType: 'mp', articleId: c.mp.id, type: 'consumo', quantity: -c.qty, note: `Producción ${receta.name}`,
      }))
    }
    await prodRepo.save(newEntity<Omit<Produccion, keyof Entity>>({
      recetaId: receta.id, batches: b, units: receta.yieldQty * b, note,
    }))
    setMps(await mpRepo.list())
    setMsg('Producción registrada.')
    setBatches('1'); setNote('')
  }

  return (
    <>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <select className="rounded border px-3 py-2" value={recetaId} onChange={(e) => setRecetaId(e.target.value)}>
          <option value="">Receta</option>
          {recetas.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <input className="rounded border px-3 py-2" type="number" placeholder="Lotes" value={batches} onChange={(e) => setBatches(e.target.value)} />
        <input className="rounded border px-3 py-2" placeholder="Nota" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      {receta && (
        <div className="mt-4">
          <p className="text-sm">Consumo estimado ({b} lote/s, {receta.yieldQty * b} unidades):</p>
          <ul className="mt-2 text-sm space-y-1">
            {consumption.map((c, i) => (
              <li key={i} className={c.enough ? '' : 'text-red-600'}>
                {c.mp?.name ?? '?'}: {c.qty} {c.mp?.unit} {c.enough ? '✓' : '(insuficiente)'}
              </li>
            ))}
          </ul>
          <button className="mt-3 rounded bg-slate-900 px-3 py-2 text-white" onClick={confirm} disabled={insufficient}>
            Confirmar producción
          </button>
          {msg && <p className="mt-2 text-sm">{msg}</p>}
        </div>
      )}
    </>
  )
}