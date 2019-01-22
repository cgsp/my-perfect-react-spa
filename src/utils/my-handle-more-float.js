import { Decimal } from 'decimal.js'

export const myHandleMoreFloat = (a, handleType, b) => {
  a = (a - 0) || 0
  if (handleType === '+') {
    b = (b - 0) || 0
    return new Decimal(a).add(new Decimal(b)).toNumber()
  }
  if (handleType === '-') {
    b = (b - 0) || 0
    return new Decimal(a).sub(new Decimal(b)).toNumber()
  }
  if (handleType === '*') {
    b = (b - 0) || 1
    return new Decimal(a).mul(new Decimal(b)).toNumber()
  }
  if (handleType === '/') {
    b = (b - 0) || 1
    return new Decimal(a).div(new Decimal(b)).toNumber()
  }
}
