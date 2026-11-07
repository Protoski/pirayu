/**
 * Serialización CSV (RFC 4180) con defensa contra "CSV/Formula injection":
 * celdas que comienzan con =, +, -, arroba, TAB o CR se prefijan con apóstrofo para que
 * Excel/LibreOffice no las evalúen como fórmulas al abrir datos abiertos descargados.
 */
export function escapeCsvCell(
  value: string | number | null | undefined,
): string {
  if (value === null || value === undefined) return '';
  let s = String(value);
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\r\n;]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCsv(
  headers: string[],
  rows: (string | number | null)[][],
): string {
  const lines = [headers, ...rows].map((r) => r.map(escapeCsvCell).join(','));
  // BOM UTF-8 para que Excel muestre correctamente tildes y la ñ.
  return `\uFEFF${lines.join('\r\n')}\r\n`;
}
