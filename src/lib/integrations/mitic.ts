import { createHash, randomBytes } from 'node:crypto';

/**
 * Autenticación ciudadana con Identidad Electrónica (MITIC) — PREPARADA, NO INTEGRADA.
 *
 * Se asume un proveedor OpenID Connect con flujo Authorization Code + PKCE (S256), que es el
 * estándar recomendado para aplicaciones web (OAuth 2.0 Security BCP, RFC 9700).
 * NO VERIFICADO: la disponibilidad, endpoints y requisitos de alta de clientes del servicio de
 * identidad del MITIC deben confirmarse con el propio MITIC antes de implementar el callback.
 *
 * Aquí se implementa la parte independiente del proveedor (state, nonce, PKCE). El intercambio
 * del código por tokens y la validación del ID Token (firma JWKS, iss, aud, exp, nonce) quedan
 * pendientes de las credenciales y la documentación oficiales.
 */
export interface MiticConfig {
  issuer: string;
  clientId: string;
  redirectUri: string;
}

export function getMiticConfig(): MiticConfig | null {
  const {
    MITIC_OIDC_ISSUER: issuer,
    MITIC_OIDC_CLIENT_ID: clientId,
    MITIC_OIDC_REDIRECT_URI: redirectUri,
  } = process.env;
  if (!issuer || !clientId || !redirectUri) return null;
  return { issuer, clientId, redirectUri };
}

export function createPkce(): { verifier: string; challenge: string } {
  const verifier = randomBytes(32).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

export function buildAuthorizationUrl(
  cfg: MiticConfig,
  state: string,
  nonce: string,
  challenge: string,
): string {
  // El endpoint real debe obtenerse del documento de descubrimiento (/.well-known/openid-configuration).
  const url = new URL('/authorize', cfg.issuer);
  url.search = new URLSearchParams({
    response_type: 'code',
    client_id: cfg.clientId,
    redirect_uri: cfg.redirectUri,
    scope: 'openid',
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  }).toString();
  return url.toString();
}
