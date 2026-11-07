import { describe, expect, it } from 'vitest';
import {
  audienciaSchema,
  denunciaSchema,
  estadoSchema,
  reclamoSchema,
} from '@/lib/validation/schemas';

const reclamoOk = {
  tipo: 'bache',
  descripcion: 'Bache profundo frente a la escuela',
  nombre: 'Ana Pérez',
  ci: '1.234.567',
  consentimiento: true,
};

describe('reclamoSchema', () => {
  it('acepta un reclamo válido y normaliza la cédula', () => {
    const r = reclamoSchema.parse(reclamoOk);
    expect(r.ci).toBe('1234567');
  });
  it('exige consentimiento explícito', () => {
    expect(
      reclamoSchema.safeParse({ ...reclamoOk, consentimiento: false }).success,
    ).toBe(false);
    expect(
      reclamoSchema.safeParse({ ...reclamoOk, consentimiento: 'true' }).success,
    ).toBe(false);
  });
  it('rechaza HTML, tipos fuera de lista y coordenadas fuera de Paraguay', () => {
    expect(
      reclamoSchema.safeParse({
        ...reclamoOk,
        descripcion: '<script>alert(1)</script> texto',
      }).success,
    ).toBe(false);
    expect(
      reclamoSchema.safeParse({ ...reclamoOk, tipo: 'otro' }).success,
    ).toBe(false);
    expect(
      reclamoSchema.safeParse({ ...reclamoOk, lat: 40.4, lng: -3.7 }).success,
    ).toBe(false);
  });
  it('rechaza operadores tipo NoSQL en lugar de strings', () => {
    expect(
      reclamoSchema.safeParse({ ...reclamoOk, nombre: { $ne: null } }).success,
    ).toBe(false);
  });
});

describe('audienciaSchema', () => {
  it('valida teléfono paraguayo', () => {
    const base = {
      nombre: 'Juan',
      ci: '4567890',
      motivo: 'Consulta sobre obras en el barrio San José',
      consentimiento: true,
    };
    expect(
      audienciaSchema.safeParse({ ...base, telefono: '0981 123 456' }).success,
    ).toBe(true);
    expect(
      audienciaSchema.safeParse({ ...base, telefono: '+595981123456' }).success,
    ).toBe(true);
    expect(
      audienciaSchema.safeParse({ ...base, telefono: '12345' }).success,
    ).toBe(false);
  });
});

describe('estadoSchema', () => {
  it('normaliza a mayúsculas y valida el formato', () => {
    expect(
      estadoSchema.parse({ tramite: 'licencia', expediente: 'lic-2026-000123' })
        .expediente,
    ).toBe('LIC-2026-000123');
    expect(
      estadoSchema.safeParse({
        tramite: 'licencia',
        expediente: "1' OR '1'='1",
      }).success,
    ).toBe(false);
  });
});

describe('denunciaSchema', () => {
  const desc = 'Descripción suficientemente larga de un hecho irregular.';
  it('permite denuncia anónima sin contacto', () => {
    expect(
      denunciaSchema.safeParse({ anonima: true, descripcion: desc }).success,
    ).toBe(true);
  });
  it('exige contacto y consentimiento si no es anónima', () => {
    expect(
      denunciaSchema.safeParse({ anonima: false, descripcion: desc }).success,
    ).toBe(false);
    expect(
      denunciaSchema.safeParse({
        anonima: false,
        descripcion: desc,
        contacto: 'a@b.py',
      }).success,
    ).toBe(false);
    expect(
      denunciaSchema.safeParse({
        anonima: false,
        descripcion: desc,
        contacto: 'a@b.py',
        consentimiento: true,
      }).success,
    ).toBe(true);
  });
});
