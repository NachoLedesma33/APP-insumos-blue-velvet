import { useEffect, useState } from 'react'
import { LocalStorageRepository, type Entity } from '../data/repository'
import { downloadCsv, toCsv } from '../lib/csv'
import type { Unit } from '../domain/costing'

interface MateriaPrima extends Entity { name: string; price: number; quantity: number; unit: Unit; stock: number }
interface Insumo extends Entity { name: string; price: number; quantity: number; unit: Unit; stock: number }
interface Receta extends Entity { name: string; yieldQty: number }
interface Producto extends Entity { name: string; salePrice: number; method: string; targetPercent: number }
interface Movimiento extends Entity { articleType: string; type: string; quantity: number; note: string }

const mpRepo = new LocalStorageRepository<MateriaPrima>('materias-primas')
const insumoRepo = new LocalStorageRepository<Insumo>('insumos')
const recetaRepo = new LocalStorageRepository<Receta>('recetas')
const prodRepo = new LocalStorageRepository<Producto>('productos')
const movRepo = new LocalStorageRepository<Movimiento>('movimientos')

export default function ReportesPage() {
  const [mps, setMps] = useState<MateriaPrima[]>([])
  const [ins, setIns] = useState<Insumo[]>([])
  const [recs, setRecs] = useState<Receta[]>([])
  const [prods, setProds] = useState<Producto[]>([])
  const [movs, setMovs] = useState<Movimiento[]>([])

  useEffect(() => {
    mpRepo.list().then(setMps)
    insumoRepo.list().then(setIns)
    recetaRepo.list().then(setRecs)
    prodRepo.list().then(setProds)
    movRepo.list().then(setMovs)
  }, [])

  return (
    <div className="mt-4 space-y-3">
      <button className="rounded bg-slate-900 px-3 py-2 text-white" onClick={() => downloadCsv('materias-primas.csv', toCsv(mps as any, ['name', 'price', 'quantity', 'unit', 'stock']))}>Exportar materias primas</button>
      <button className="rounded bg-slate-900 px-3 py-2 text-white" onClick={() => downloadCsv('insumos.csv', toCsv(ins as any, ['name', 'price', 'quantity', 'unit', 'stock']))}>Exportar insumos</button>
      <button className="rounded bg-slate-900 px-3 py-2 text-white" onClick={() => downloadCsv('recetas.csv', toCsv(recs as any, ['name', 'yieldQty']))}>Exportar recetas</button>
      <button className="rounded bg-slate-900 px-3 py-2 text-white" onClick={() => downloadCsv('productos.csv', toCsv(prods as any, ['name', 'method', 'targetPercent', 'salePrice']))}>Exportar productos</button>
      <button className="rounded bg-slate-900 px-3 py-2 text-white" onClick={() => downloadCsv('movimientos.csv', toCsv(movs as any, ['articleType', 'type', 'quantity', 'note', 'createdAt']))}>Exportar movimientos</button>
    </div>
  )
}