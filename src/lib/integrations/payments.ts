/**
 * Pasarela de pagos — INTERFAZ, NO INTEGRADA.
 *
 * El cobro electrónico de impuestos/patentes requiere: contrato con un procesador habilitado
 * (p. ej. redes de cobranza o bancos que operan en Paraguay), y cumplir la Ley N° 4868/2013
 * "De Comercio Electrónico" (información del proveedor, confirmación de la transacción,
 * comprobante), además de la normativa tributaria municipal. Debe validarse con asesoría legal
 * y con la Dirección de Hacienda.
 *
 * Reglas de diseño para la integración futura:
 * - El portal NUNCA recibe ni almacena datos de tarjeta: se redirige al checkout alojado del
 *   procesador (alcance PCI DSS reducido).
 * - El monto se calcula en el servidor a partir de la liquidación oficial, nunca del cliente.
 * - La confirmación se acepta solo por webhook firmado (HMAC) del procesador, con idempotencia.
 */
export interface Liquidacion {
  concepto: 'inmobiliario' | 'patente' | 'licencia';
  referencia: string; // cuenta corriente catastral, n.º de patente, etc.
  montoGs: number;
}

export interface CheckoutSession {
  redirectUrl: string;
  idTransaccion: string;
}

export interface PaymentGateway {
  readonly nombre: string;
  readonly configurado: boolean;
  crearCheckout: (l: Liquidacion) => Promise<CheckoutSession>;
}

export class PasarelaNoConfigurada implements PaymentGateway {
  readonly nombre = 'sin-configurar';
  readonly configurado = false;
  crearCheckout(): Promise<CheckoutSession> {
    return Promise.reject(new Error('Pasarela de pagos no configurada.'));
  }
}

export function getPaymentGateway(): PaymentGateway {
  // Punto de extensión: instanciar el adaptador del procesador según PAYMENT_PROVIDER.
  return new PasarelaNoConfigurada();
}
