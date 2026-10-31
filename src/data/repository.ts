export interface Entity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface Repository<T extends Entity> {
  list(): Promise<T[]>
  get(id: string): Promise<T | null>
  save(entity: T): Promise<T>
  remove(id: string): Promise<void>
}

function now(): string {
  return new Date().toISOString()
}

export function newEntity<T extends Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>>(
  partial: T,
): T & Entity {
  const id = crypto.randomUUID()
  const ts = now()
  return { ...partial, id, createdAt: ts, updatedAt: ts } as T & Entity
}

export class MemoryStorage implements Storage {
  private data = new Map<string, string>()
  get length() { return this.data.size }
  clear() { this.data.clear() }
  getItem(key: string) { return this.data.get(key) ?? null }
  key(index: number) { return [...this.data.keys()][index] ?? null }
  removeItem(key: string) { this.data.delete(key) }
  setItem(key: string, value: string) { this.data.set(key, value) }
}

export class LocalStorageRepository<T extends Entity> implements Repository<T> {
  private readonly storage: Storage
  constructor(private readonly key: string, storage?: Storage) {
    this.storage = storage ?? (typeof localStorage !== 'undefined' ? localStorage : new MemoryStorage())
  }

  private readAll(): T[] {
    try {
      const raw = this.storage.getItem(this.key)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? (parsed as T[]) : []
    } catch {
      return []
    }
  }

  private writeAll(items: T[]): void {
    this.storage.setItem(this.key, JSON.stringify(items))
  }

  async list(): Promise<T[]> {
    return this.readAll()
  }

  async get(id: string): Promise<T | null> {
    return this.readAll().find((x) => x.id === id) ?? null
  }

  async save(entity: T): Promise<T> {
    const items = this.readAll()
    const idx = items.findIndex((x) => x.id === entity.id)
    const next = { ...entity, updatedAt: now() }
    if (idx >= 0) items[idx] = next
    else items.push(next)
    this.writeAll(items)
    return next
  }

  async remove(id: string): Promise<void> {
    this.writeAll(this.readAll().filter((x) => x.id !== id))
  }
}