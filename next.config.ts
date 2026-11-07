import type { NextConfig } from 'next';

/**
 * Cabeceras de seguridad estáticas aplicadas a TODAS las respuestas (incluidos assets).
 * La Content-Security-Policy se emite en src/middleware.ts porque necesita un nonce por petición.
 *
 * - Strict-Transport-Security: fuerza HTTPS durante 2 años (63 072 000 s) e incluye subdominios.
 *   `preload` solo debe añadirse cuando el dominio definitivo esté inscripto en hstspreload.org.
 * - X-Frame-Options: DENY → bloquea clickjacking (redundante con CSP frame-ancestors 'none').
 * - X-Content-Type-Options: nosniff → impide que el navegador reinterprete tipos MIME.
 * - Referrer-Policy: no filtra rutas internas a terceros.
 * - Permissions-Policy: deshabilita APIs del navegador que el portal no usa. La geolocalización
 *   se permite solo al propio origen (reclamos con ubicación).
 */
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), payment=(), usb=(), geolocation=(self)' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // El lint se ejecuta aparte con `npm run lint` (ESLint 8 + @vercel/style-guide), no dentro de `next build`.
  eslint: { ignoreDuringBuilds: true },
  images: { formats: ['image/avif', 'image/webp'] },
  // jsdom (dependencia de isomorphic-dompurify) no debe empaquetarse.
  serverExternalPackages: ['isomorphic-dompurify', 'jsdom'],
  headers() {
    return Promise.resolve([{ source: '/:path*', headers: securityHeaders }]);
  },
};

export default nextConfig;
