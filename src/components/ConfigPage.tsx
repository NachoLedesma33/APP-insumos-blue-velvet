import { useState } from 'react'

const KEYS = ['materias-primas', 'insumos', 'recetas', 'productos', 'movimientos']

export default function ConfigPage() {
  const [msg, setMsg] = useState('')

  function backup() {
    const data: Record<string, unknown> = {}
    for (const k of KEYS) data[k] = JSON.parse(localStorage.getItem(k) || '[]')
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'costita-backup.json'
    a.click()
    URL.revokeObjectURL(url)
    setMsg('Backup descargado.')
  }

  function restore(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        for (const k of KEYS) if (data[k]) localStorage.setItem(k, JSON.stringify(data[k]))
        setMsg('Restauración completada. Recargá la página.')
      } catch {
        setMsg('Archivo inválido.')
      }
    }
    reader.readAsText(file)
  }

  function clearAll() {
    if (!confirm('¿Borrar todos los datos locales?')) return
    for (const k of KEYS) localStorage.removeItem(k)
    setMsg('Datos borrados.')
  }

  return (
    <div className="mt-4 space-y-4">
      <p className="text-sm text-slate-600">Moneda: ARS (pesos argentinos).</p>
      <div className="flex flex-wrap gap-2">
        <button className="rounded bg-slate-900 px-3 py-2 text-white" onClick={backup}>Descargar backup JSON</button>
        <label className="rounded bg-slate-200 px-3 py-2 cursor-pointer">
          Restaurar backup
          <input type="file" accept="application/json" className="hidden" onChange={restore} />
        </label>
        <button className="rounded bg-red-600 px-3 py-2 text-white" onClick={clearAll}>Borrar datos</button>
      </div>
      {msg && <p className="text-sm text-slate-700">{msg}</p>}
    </div>
  )
}