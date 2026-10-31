import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageRepository, newEntity, MemoryStorage } from './repository'

interface Item extends ReturnType<typeof newEntity<{ name: string }>> {}

describe('LocalStorageRepository', () => {
  let storage: MemoryStorage
  beforeEach(() => { storage = new MemoryStorage() })

  it('saves and lists', async () => {
    const repo = new LocalStorageRepository<Item>('items', storage)
    const e = newEntity({ name: 'harina' })
    await repo.save(e)
    const list = await repo.list()
    expect(list).toHaveLength(1)
    expect(list[0].name).toBe('harina')
  })

  it('gets by id', async () => {
    const repo = new LocalStorageRepository<Item>('items', storage)
    const e = newEntity({ name: 'azucar' })
    await repo.save(e)
    const got = await repo.get(e.id)
    expect(got?.name).toBe('azucar')
  })

  it('removes', async () => {
    const repo = new LocalStorageRepository<Item>('items', storage)
    const e = newEntity({ name: 'sal' })
    await repo.save(e)
    await repo.remove(e.id)
    expect(await repo.list()).toHaveLength(0)
  })
})