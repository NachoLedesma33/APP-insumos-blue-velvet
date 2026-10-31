import { Decimal } from 'decimal.js'

export type Unit = 'g' | 'kg' | 'ml' | 'L' | 'u'
export type Dimension = 'mass' | 'volume' | 'count'

const BASE_UNIT: Record<Dimension, Unit> = {
  mass: 'g',
  volume: 'ml',
  count: 'u',
}

const FACTOR_TO_BASE: Record<Unit, number> = {
  g: 1,
  kg: 1000,
  ml: 1,
  L: 1000,
  u: 1,
}

const DIMENSION: Record<Unit, Dimension> = {
  g: 'mass',
  kg: 'mass',
  ml: 'volume',
  L: 'volume',
  u: 'count',
}

export function dimensionOf(unit: Unit): Dimension {
  return DIMENSION[unit]
}

export function baseUnitOf(unit: Unit): Unit {
  return BASE_UNIT[DIMENSION[unit]]
}

export function canConvert(a: Unit, b: Unit): boolean {
  return DIMENSION[a] === DIMENSION[b]
}

export function toBase(quantity: number | string | Decimal, unit: Unit): Decimal {
  const q = new Decimal(quantity)
  if (q.isNaN()) throw new Error('cantidad inválida')
  return q.mul(FACTOR_TO_BASE[unit])
}

export function unitCost(price: number | string | Decimal, quantity: number | string | Decimal, unit: Unit): Decimal {
  const baseQty = toBase(quantity, unit)
  if (baseQty.isZero()) throw new Error('cantidad de compra cero')
  return new Decimal(price).div(baseQty)
}

export function ingredientCost(
  usedQuantity: number | string | Decimal,
  usedUnit: Unit,
  price: number | string | Decimal,
  purchasedQuantity: number | string | Decimal,
  purchasedUnit: Unit,
): Decimal {
  if (!canConvert(usedUnit, purchasedUnit)) throw new Error('unidades incompatibles')
  const usedBase = toBase(usedQuantity, usedUnit)
  const costPerBase = unitCost(price, purchasedQuantity, purchasedUnit)
  return usedBase.mul(costPerBase)
}

export function recipeMaterialCost(
  items: Array<{
    usedQuantity: number | string | Decimal
    usedUnit: Unit
    price: number | string | Decimal
    purchasedQuantity: number | string | Decimal
    purchasedUnit: Unit
  }>,
): Decimal {
  return items.reduce((acc, item) => acc.plus(ingredientCost(
    item.usedQuantity,
    item.usedUnit,
    item.price,
    item.purchasedQuantity,
    item.purchasedUnit,
  )), new Decimal(0))
}

export function lotCost(material: Decimal, supplies: Decimal = new Decimal(0), extra: Decimal = new Decimal(0)): Decimal {
  return material.plus(supplies).plus(extra)
}

export function unitCostPerUnit(lot: Decimal, yieldQty: number | string | Decimal): Decimal {
  const y = new Decimal(yieldQty)
  if (y.isZero()) throw new Error('rendimiento cero')
  if (y.isNegative()) throw new Error('rendimiento negativo')
  return lot.div(y)
}

export function priceByMarkup(cost: Decimal, markupPercent: number | string | Decimal): Decimal {
  const m = new Decimal(markupPercent)
  if (m.lt(0)) throw new Error('recargo negativo')
  return cost.mul(new Decimal(1).plus(m.div(100)))
}

export function priceByMargin(cost: Decimal, marginPercent: number | string | Decimal): Decimal {
  const m = new Decimal(marginPercent)
  if (m.lt(0)) throw new Error('margen negativo')
  if (m.gte(100)) throw new Error('margen debe ser menor a 100%')
  return cost.div(new Decimal(1).minus(m.div(100)))
}

export function profitPerUnit(price: Decimal, cost: Decimal): Decimal {
  return price.minus(cost)
}

export function marginOnSale(price: Decimal, cost: Decimal): Decimal {
  if (price.isZero()) throw new Error('precio de venta cero')
  return price.minus(cost).div(price).mul(100)
}

export function formatARS(value: Decimal): string {
  const fixed = value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toString()
  const [intPart, decPart = ''] = fixed.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `$ ${grouped},${decPart.padEnd(2, '0')}`
}