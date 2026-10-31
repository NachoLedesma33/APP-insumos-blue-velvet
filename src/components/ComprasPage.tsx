import { useEffect, useState } from 'react'
import { LocalStorageRepository, newEntity, type Entity } from '../data/repository'
import { toBase } from '../domain/costing'
import type { Unit } from '../domain/costing'

interface MateriaPrima extends Entity { name: string; price: number; quantity: number; unit: Unit; stock: number }
interface Insumo extends Entity { name: string; price: number; quantity: number; unit: Unit; stock: number }
interface Compra extends Entity { articleType: string; articleId: string; quantity: number; unit: Unit; total: number; supplier: string; note: string }

const mpRepo = new LocalStorageRepository<MateriaPrima>('materias-primas')
const insumoRepo = new LocalStorageRepository<Insumo>('insumos')
const compraRepo = new LocalStorageRepository<Compra>('compras')

export default function ComprasPage() {
  const [type, setType] = useState<'mp' | 'insumo'>('mp')
  const [items, setItems] = useState<(MateriaPrima | Insumo)[]>([])
  const [articleId, setArticleId] = useState('')
  const [qty, setQty] = useState('')
  const [unit, setUnit] = useState<Unit>('kg')
  const [total, setTotal] = useState('')
  const [supplier, setSupplier] = useState('')
  const [note, setNote] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    (type === 'mp' ? mpRepo : insumoRepo).list().then(setItems)
  }, [type])

  const selected = items.find((x) => x.id === articleId)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    const baseQty = Number(toBase(Number(qty), unit))
    // update article: last cost reference + stock
    selected.price = Number(total)
    selected.quantity = Number(qty)
    selected.unit = unit
    selected.stock = (selected.stock || 0) + baseQty
    if (type === 'mp') { await mpRepo.save(selected as MateriaPrima) } else { await insumoRepo.save(selected as Insumo) }

    await compraRepo.save(newEntity<Omit<Compra, keyof Entity>>({
      articleType: type, articleId: selected.id, quantity: Number(qty), unit, total: Number(total), supplier, note,
    }))
    setItems(await (type === 'mp' ? mpRepo : insumoRepo).list())
    setQty(''); setTotal(''); setSupplier(''); setNote(''); setMsg('Compra registrada.')
  }

  return (
    <>
      <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-6">
        <select className="rounded border px-3 py-2" value={type} onChange={(e) => { setType(e.target.value as any); setArticleId('') }}>
          <option value="mp">Materia prima</option><option value="insumo">Insumo</option>
        </select>
        <select className="rounded border px-3 py-2" value={articleId} onChange={(e) => setArticleId(e.target.value)} required>
          <option value="">Artículo</option>
          {items.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
        <input className="rounded border px-3 py-2" type="number" placeholder="Cantidad" value={qty} onChange={(e) => setQty(e.target.value)} required />
        <select className="rounded border px-3 py-2" value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
          <option value="kg">kg</option><option value="g">g</option><option value="L">L</option><option value="ml">ml</option><option value="u">u</option>
        </select>
        <input className="rounded border px-3 py-2" type="number" placeholder="Total pagado" value={total} onChange={(e) => setTotal(e.target.value)} required />
        <input className="rounded border px-3 py-2" placeholder="Proveedor" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
        <input className="rounded border px-3 py-2 md:col-span-5" placeholder="Nota/comprobante" value={note} onChange={(e) => setNote(e.target.value)} />
        <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">Registrar compra</button>
      </form>
      {msg && <p className="mt-2 text-sm">{msg}</p>}
      {selected && total && qty && (
        <p className="mt-2 text-sm text-slate-600">
          Costo unitario resultante: {Number(total) / Number(toBase(Number(qty), unit))} por unidad base
        </p>
      )}
    </>
  )
}