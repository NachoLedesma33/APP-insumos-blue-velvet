import { describe, it, expect } from 'vitest'
import { Decimal } from 'decimal.js'
import {
  toBase,
  canConvert,
  dimensionOf,
  unitCost,
  ingredientCost,
  recipeMaterialCost,
  lotCost,
  unitCostPerUnit,
  priceByMarkup,
  priceByMargin,
  profitPerUnit,
  marginOnSale,
  formatARS,
} from './costing'

describe('units', () => {
  it('converts kg to g', () => {
    expect(toBase(1, 'kg').toString()).toBe('1000')
  })
  it('converts L to ml', () => {
    expect(toBase(1, 'L').toString()).toBe('1000')
  })
  it('rejects incompatible conversion', () => {
    expect(canConvert('g', 'ml')).toBe(false)
    expect(() => ingredientCost(10, 'g', 100, 1, 'ml')).toThrow()
  })
})

describe('cost', () => {
  it('harina 1kg $1800, 250g -> $450', () => {
    const c = ingredientCost(250, 'g', 1800, 1, 'kg')
    expect(c.toString()).toBe('450')
  })
  it('lote $6000 / 12 -> $500', () => {
    const u = unitCostPerUnit(new Decimal(6000), 12)
    expect(u.toString()).toBe('500')
  })
  it('markup 40% -> $700, profit $200, margin 28.57%', () => {
    const cost = new Decimal(500)
    const price = priceByMarkup(cost, 40)
    expect(price.toString()).toBe('700')
    expect(profitPerUnit(price, cost).toString()).toBe('200')
    expect(marginOnSale(price, cost).toFixed(2)).toBe('28.57')
  })
  it('margin 40% -> $833.33', () => {
    const price = priceByMargin(new Decimal(500), 40)
    expect(price.toFixed(2)).toBe('833.33')
  })
  it('rejects margin >= 100', () => {
    expect(() => priceByMargin(new Decimal(500), 100)).toThrow()
  })
  it('rejects yield zero', () => {
    expect(() => unitCostPerUnit(new Decimal(100), 0)).toThrow()
  })
  it('rejects ingredient without price via zero price? price zero allowed calc', () => {
    // price 0 yields 0 cost; completeness handled elsewhere
    expect(ingredientCost(10, 'g', 0, 1, 'kg').toString()).toBe('0')
  })
})

describe('format', () => {
  it('formats ARS', () => {
    expect(formatARS(new Decimal(1234.5))).toBe('$ 1.234,50')
  })
})