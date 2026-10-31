import { useEffect, useState } from 'react'
import { LocalStorageRepository, type Entity } from '../data/repository'
import type { Unit } from '../domain/costing'

interface MateriaPrima extends Entity { name: string; stock: number; stockMin: number; price: number }
interface Insumo extends Entity { name: string; stock: number; stockMin: number }
interface Receta extends Entity { name: string; yieldQty: number; ingredientes: { materiaPrimaId: string; quantity: number; unit: Unit }[] }
interface Producto extends Entity { name: string }

const mpRepo = new LocalStorageRepository<MateriaPrima>('materias-primas')
const insumoRepo = new LocalStorageRepository<Insumo>('insumos')
const recetaRepo = new LocalStorageRepository<Receta>('recetas')
const prodRepo = new LocalStorageRepository<Producto>('productos')

export default function DashboardPage() {
  const [mps, setMps] = useState<MateriaPrima[]>([])
  const [ins, setIns] = useState<Insumo[]>([])
  const [recetas, setRecetas] = useState<Receta[]>([])
  const [prods, setProds] = useState<Producto[]>([])

  useEffect(() => {
    mpRepo.list().then(setMps)
    insumoRepo.list().then(setIns)
    recetaRepo.list().then(setRecetas)
    prodRepo.list().then(setProds)
  }, [])

  const lowStock = [...mps.filter((m) => m.stockMin && m.stock < m.stockMin), ...ins.filter((i) => i.stockMin && i.stock < i.stockMin)]
  const incomplete = recetas.filter((r) => r.ingredientes.length === 0 || r.yieldQty <= 0)

  return (
    <div className="mt-4 space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded border p-4"><p className="text-sm text-slate-500">Materias primas</p><p className="text-2xl font-semibold">{mps.length}</p></div>
        <div className="rounded border p-4"><p className="text-sm text-slate-500">Insumos</p><p className="text-2xl font-semibold">{ins.length}</p></div>
        <div className="rounded border p-4"><p className="text-sm text-slate-500">Recetas</p><p className="text-2xl font-semibold">{recetas.length}</p></div>
        <div className="rounded border p-4"><p className="text-sm text-slate-500">Productos</p><p className="text-2xl font-semibold">{prods.length}</p></div>
      </div>

      {lowStock.length > 0 && (
        <div className="rounded border border-amber-300 bg-amber-50 p-4">
          <p className="font-medium">Stock bajo</p>
          <ul className="mt-2 text-sm">{lowStock.map((a) => <li key={a.id}>{a.name}: {a.stock} (mín {a.stockMin})</li>)}</ul>
        </div>
      )}
      {incomplete.length > 0 && (
        <div className="rounded border border-red-300 bg-red-50 p-4">
          <p className="font-medium">Recetas incompletas</p>
          <ul className="mt-2 text-sm">{incomplete.map((r) => <li key={r.id}>{r.name}</li>)}</ul>
        </div>
      )}
      {mps.length === 0 && ins.length === 0 && recetas.length === 0 && (
        <div className="rounded border p-6 text-center text-slate-500">
          Empezá cargando una materia prima o insumo.
        </div>
      )}
    </div>
  )
}