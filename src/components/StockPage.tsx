import { useEffect, useState } from 'react'
import { LocalStorageRepository, newEntity, type Entity } from '../data/repository'
import type { Unit } from '../domain/costing'

interface MateriaPrima extends Entity { name: string; stock: number; unit: Unit }
interface Insumo extends Entity { name: string; stock: number; unit: Unit }
interface Movimiento extends Entity {
  articleType: 'mp' | 'insumo'
  articleId: string
  type: 'ingreso' | 'ajuste' | 'merma'
  quantity: number
  note: string
}

const mpRepo = new LocalStorageRepository<MateriaPrima>('materias-primas')
const insumoRepo = new LocalStorageRepository<Insumo>('insumos')
const movRepo = new LocalStorageRepository<Movimiento>('movimientos')

export default function StockPage() {
  const [mps, setMps] = useState<MateriaPrima[]>([])
  const [ins, setIns] = useState<Insumo[]>([])
  const [movs, setMovs] = useState<Movimiento[]>([])
  const [articleType, setArticleType] = useState<'mp' | 'insumo'>('mp')
  const [articleId, setArticleId] = useState('')
  const [type, setType] = useState<'ingreso' | 'ajuste' | 'merma'>('ingreso')
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    mpRepo.list().then(setMps)
    insumoRepo.list().then(setIns)
    movRepo.list().then(setMovs)
  }, [])

  const articles = articleType === 'mp' ? mps : ins

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const q = Number(quantity)
    const signed = type === 'merma' ? -q : q
    const mov = newEntity<Omit<Movimiento, keyof Entity>>({ articleType, articleId, type, quantity: signed, note })
    await movRepo.save(mov)

    if (articleType === 'mp') {
      const a = mps.find((x) => x.id === articleId)
      if (a) { a.stock = (a.stock || 0) + signed; await mpRepo.save(a) }
      setMps(await mpRepo.list())
    } else {
      const a = ins.find((x) => x.id === articleId)
      if (a) { a.stock = (a.stock || 0) + signed; await insumoRepo.save(a) }
      setIns(await insumoRepo.list())
    }
    setMovs(await movRepo.list())
    setQuantity(''); setNote('')
  }

  return (
    <>
      <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-6">
        <select className="rounded-xl border px-3 py-2" value={articleType} onChange={(e) => { setArticleType(e.target.value as any); setArticleId('') }}>
          <option value="mp">Materia prima</option><option value="insumo">Insumo</option>
        </select>
        <select className="rounded-xl border px-3 py-2" value={articleId} onChange={(e) => setArticleId(e.target.value)} required>
          <option value="">Artículo</option>
          {articles.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select className="rounded-xl border px-3 py-2" value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="ingreso">Ingreso</option><option value="ajuste">Ajuste</option><option value="merma">Merma</option>
        </select>
        <input className="rounded-xl border px-3 py-2" placeholder="Cantidad" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        <input className="rounded-xl border px-3 py-2" placeholder="Motivo" value={note} onChange={(e) => setNote(e.target.value)} />
        <button className="rounded-xl bg-navy-800 px-3 py-2 text-white" type="submit">Registrar</button>
      </form>

      <h2 className="mt-6 text-lg font-medium">Stock actual</h2>
      <table className="mt-2 w-full text-left text-sm">
        <thead><tr><th>Tipo</th><th>Nombre</th><th>Stock</th><th>Unidad</th></tr></thead>
        <tbody>
          {mps.map((m) => <tr key={m.id} className="border-t"><td>MP</td><td>{m.name}</td><td>{m.stock}</td><td>{m.unit}</td></tr>)}
          {ins.map((i) => <tr key={i.id} className="border-t"><td>Insumo</td><td>{i.name}</td><td>{i.stock}</td><td>{i.unit}</td></tr>)}
        </tbody>
      </table>

      <h2 className="mt-6 text-lg font-medium">Movimientos</h2>
      <table className="mt-2 w-full text-left text-sm">
        <thead><tr><th>Fecha</th><th>Tipo</th><th>Artículo</th><th>Cantidad</th><th>Motivo</th></tr></thead>
        <tbody>
          {movs.slice().reverse().map((m) => {
            const art = m.articleType === 'mp' ? mps.find((x) => x.id === m.articleId) : ins.find((x) => x.id === m.articleId)
            return <tr key={m.id} className="border-t"><td>{new Date(m.createdAt).toLocaleDateString()}</td><td>{m.type}</td><td>{art?.name ?? m.articleId}</td><td>{m.quantity}</td><td>{m.note}</td></tr>
          })}
        </tbody>
      </table>
    </>
  )
}