import { useEffect, useState } from 'react'
import { LocalStorageRepository, newEntity, type Entity } from '../data/repository'
import type { Unit } from '../domain/costing'

interface MateriaPrima extends Entity { name: string; price: number; quantity: number; unit: Unit }
interface Insumo extends Entity { name: string; price: number; quantity: number; unit: Unit }
interface Historial extends Entity { articleType: string; articleId: string; priceOld: number; priceNew: number; note: string }

const mpRepo = new LocalStorageRepository<MateriaPrima>('materias-primas')
const insumoRepo = new LocalStorageRepository<Insumo>('insumos')
const histRepo = new LocalStorageRepository<Historial>('historial-precios')

export default function PreciosPage() {
  const [type, setType] = useState<'mp' | 'insumo'>('mp')
  const [items, setItems] = useState<(MateriaPrima | Insumo)[]>([])
  const [hist, setHist] = useState<Historial[]>([])
  const [articleId, setArticleId] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [note, setNote] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    (type === 'mp' ? mpRepo : insumoRepo).list().then(setItems)
    histRepo.list().then(setHist)
  }, [type])

  const selected = items.find((x) => x.id === articleId)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    const old = selected.price
    const np = Number(newPrice)
    await histRepo.save(newEntity<Omit<Historial, keyof Entity>>({
      articleType: type, articleId: selected.id, priceOld: old, priceNew: np, note,
    }))
    selected.price = np
    if (type === 'mp') { await mpRepo.save(selected as MateriaPrima) } else { await insumoRepo.save(selected as Insumo) }
    setItems(await (type === 'mp' ? mpRepo : insumoRepo).list())
    setHist(await histRepo.list())
    setNewPrice(''); setNote(''); setMsg('Precio actualizado.')
  }

  return (
    <>
      <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-5">
        <select className="rounded border px-3 py-2" value={type} onChange={(e) => { setType(e.target.value as any); setArticleId('') }}>
          <option value="mp">Materia prima</option><option value="insumo">Insumo</option>
        </select>
        <select className="rounded border px-3 py-2" value={articleId} onChange={(e) => setArticleId(e.target.value)} required>
          <option value="">Artículo</option>
          {items.map((x) => <option key={x.id} value={x.id}>{x.name} (${x.price})</option>)}
        </select>
        <input className="rounded border px-3 py-2" type="number" placeholder="Nuevo precio" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required />
        <input className="rounded border px-3 py-2" placeholder="Motivo" value={note} onChange={(e) => setNote(e.target.value)} />
        <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">Actualizar</button>
      </form>
      {msg && <p className="mt-2 text-sm">{msg}</p>}
      <h2 className="mt-6 text-lg font-medium">Historial</h2>
      <table className="mt-2 w-full text-left text-sm">
        <thead><tr><th>Fecha</th><th>Tipo</th><th>Artículo</th><th>Anterior</th><th>Nuevo</th><th>Motivo</th></tr></thead>
        <tbody>
          {hist.slice().reverse().map((h) => {
            const list = h.articleType === 'mp' ? items : items
            const art = list.find((x) => x.id === h.articleId)
            return <tr key={h.id} className="border-t"><td>{new Date(h.createdAt).toLocaleDateString()}</td><td>{h.articleType}</td><td>{art?.name ?? h.articleId}</td><td>{h.priceOld}</td><td>{h.priceNew}</td><td>{h.note}</td></tr>
          })}
        </tbody>
      </table>
    </>
  )
}