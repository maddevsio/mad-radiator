export function getPercentage(first: number, second: number, useDiff = true): number {
  const diff = useDiff ? 100 : 0
  return Number(((first * 100) / second - diff).toFixed(2))
}
