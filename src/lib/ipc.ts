export interface IpcPoint {
  date: string
  value: number
}

const SERIES_ID = '103.1_I2N_2016_M_19'
const CACHE_KEY = 'costita.ipc.cache'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

interface Cache {
  fetchedAt: number
  points: IpcPoint[]
}

function readCache(): Cache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Cache
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(points: IpcPoint[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), points }))
  } catch {
    // ignore storage errors
  }
}

export async function fetchIpcMonthly(limit = 24): Promise<IpcPoint[]> {
  const cached = readCache()
  if (cached) return cached.points.slice(-limit)

  const url = `https://apis.datos.gob.ar/series/api/series/?ids=${SERIES_ID}&last=${limit}&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`IPC request failed: ${res.status}`)
  const json = (await res.json()) as { data: [string, number][] }
  const points = json.data.map(([date, value]) => ({ date, value }))
  writeCache(points)
  return points
}

export function inflationBetween(points: IpcPoint[], fromIndex: number, toIndex: number): number | null {
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= points.length || toIndex >= points.length) return null
  const a = points[fromIndex].value
  const b = points[toIndex].value
  if (a === 0) return null
  return ((b - a) / a) * 100
}