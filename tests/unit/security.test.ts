import { describe, expect, it } from 'vitest';
import { buildCsp } from '@/lib/security/csp';
import { createCsrfSeed, tokenForSeed, verifyCsrf } from '@/lib/security/csrf';
import { escapeCsvCell, toCsv } from '@/lib/security/csv';
import { decryptField, encryptField } from '@/lib/security/field-crypto';
import { detectImageType } from '@/lib/security/file-validation';
import { createMemoryLimiter } from '@/lib/security/rate-limit';
import { sanitizeHtml } from '@/lib/security/sanitize';

describe('cSRF', () => {
  it('acepta el token derivado de la semilla', () => {
    const seed = createCsrfSeed();
    expect(verifyCsrf(seed, tokenForSeed(seed))).toBe(true);
  });
  it('rechaza token ausente, ajeno o manipulado', () => {
    const seed = createCsrfSeed();
    expect(verifyCsrf(seed, null)).toBe(false);
    expect(verifyCsrf(undefined, tokenForSeed(seed))).toBe(false);
    expect(verifyCsrf(seed, tokenForSeed(createCsrfSeed()))).toBe(false);
    expect(verifyCsrf(seed, `${tokenForSeed(seed)}x`)).toBe(false);
  });
});

describe('rate limiting en memoria', () => {
  it('bloquea al superar el máximo y libera al vencer la ventana', async () => {
    let t = 0;
    const rl = createMemoryLimiter(2, 1000, () => t);
    expect((await rl.limit('ip')).success).toBe(true);
    expect((await rl.limit('ip')).success).toBe(true);
    expect((await rl.limit('ip')).success).toBe(false);
    expect((await rl.limit('otra-ip')).success).toBe(true);
    t = 1001;
    expect((await rl.limit('ip')).success).toBe(true);
  });
});

describe('cifrado de campos (AES-256-GCM)', () => {
  it('cifra con IV aleatorio y descifra', () => {
    const a = encryptField('1234567');
    const b = encryptField('1234567');
    expect(a).not.toBe(b);
    expect(a).not.toContain('1234567');
    expect(decryptField(a)).toBe('1234567');
  });
  it('detecta manipulación del texto cifrado', () => {
    const parts = encryptField('0981123456').split('.');
    const ct = Buffer.from(parts[3] ?? '', 'base64url');
    ct[0] = 255 - (ct[0] ?? 0); // altera el primer byte
    parts[3] = ct.toString('base64url');
    expect(() => decryptField(parts.join('.'))).toThrow();
  });
});

describe('cSV', () => {
  it('neutraliza fórmulas y escapa comillas/separadores', () => {
    expect(escapeCsvCell('=HYPERLINK("x")')).toBe(`"'=HYPERLINK(""x"")"`);
    expect(escapeCsvCell('+1')).toBe("'+1");
    expect(escapeCsvCell(-5)).toBe('-5');
    expect(escapeCsvCell('a,b')).toBe('"a,b"');
  });
  it('incluye BOM y CRLF', () => {
    const csv = toCsv(['a'], [['ñ']]);
    expect(csv.startsWith('﻿a\r\n')).toBe(true);
  });
});

describe('validación de imágenes por magic bytes', () => {
  it('reconoce JPEG, PNG y WebP; rechaza el resto', () => {
    expect(detectImageType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe(
      'image/jpeg',
    );
    expect(
      detectImageType(
        new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      ),
    ).toBe('image/png');
    expect(
      detectImageType(new TextEncoder().encode('RIFF\0\0\0\0WEBPVP8 ')),
    ).toBe('image/webp');
    expect(
      detectImageType(new TextEncoder().encode('<svg onload=alert(1)>')),
    ).toBeNull();
  });
});

describe('sanitización HTML', () => {
  it('elimina scripts, manejadores y URLs javascript:', () => {
    const out = sanitizeHtml(
      '<p onclick="x()">Hola<script>alert(1)</script><a href="javascript:alert(1)">l</a><img src=x onerror=alert(1)></p>',
    );
    expect(out).toBe('<p>Hola<a>l</a></p>');
  });
});

describe('cSP', () => {
  it('producción: nonce, sin unsafe-inline/eval en scripts y frame-ancestors none', () => {
    const csp = buildCsp('abc', false);
    const script =
      csp.split('; ').find((d) => d.startsWith('script-src')) ?? '';
    expect(script).toContain("'nonce-abc'");
    expect(script).not.toContain('unsafe-inline');
    expect(script).not.toContain('unsafe-eval');
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
  });
});
