export function formatPrice(value: number | null): string {
  if (value === null) return '—';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

export function toDateInput(iso: string | null): string {
  return iso ? formatDate(iso) : '';
}

export function toPriceInput(value: number | null): string {
  return value === null ? '' : value.toFixed(2).replace('.', ',');
}