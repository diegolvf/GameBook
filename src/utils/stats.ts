export function sumPrices(items: { price: number | null }[]): number {
  return items.reduce((total, item) => total + (item.price ?? 0), 0);
}