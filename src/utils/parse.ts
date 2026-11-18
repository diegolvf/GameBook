export function parseDateBR(text: string): string | null | undefined {
    const value = text.trim();
    if (!value) return null;

    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return undefined;

    const [, day, month, year] = match;
    const d = Number(day);
    const m = Number(month);
    const y = Number(year);

    const date = new Date (y, m - 1, d);
    const exists = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;

    return exists ? `${year}-${month}-${day}` : undefined;
}

export function parsePrice(text: string): number | null | undefined {
    let value = text.trim().replace(/R\$\s?/i, '');
    if (!value) return null;

    if (value.includes(',')) {
        value = value.replace(/\./g, '').replace(',', '.')
    }

    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : undefined;
}

