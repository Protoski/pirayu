import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate limiting (mitigación de fuerza bruta y abuso de formularios, OWASP A07:2021).
 *
 * - Con UPSTASH_REDIS_REST_URL/TOKEN definidas: ventana deslizante distribuida en Redis
 *   (válida con varias instancias serverless, p. ej. en Vercel).
 * - Sin ellas: ventana deslizante en memoria. LIMITACIÓN: cada instancia serverless lleva su
 *   propia cuenta, por lo que en producción con varias instancias el límite efectivo es mayor.
 *   Se recomienda configurar Upstash antes de publicar.
 */
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  /** Epoch en milisegundos en que se libera la ventana. */
  reset: number;
}

export interface RateLimiter {
  limit: (key: string) => Promise<RateLimitResult>;
}

export function createMemoryLimiter(
  max: number,
  windowMs: number,
  now: () => number = Date.now,
): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    limit(key) {
      const t = now();
      const recent = (hits.get(key) ?? []).filter((ts) => t - ts < windowMs);
      const success = recent.length < max;
      if (success) recent.push(t);
      hits.set(key, recent);
      // Evita crecimiento ilimitado del mapa.
      if (hits.size > 10_000) {
        for (const [k, v] of hits)
          if (v.every((ts) => t - ts >= windowMs)) hits.delete(k);
      }
      const oldest = recent[0] ?? t;
      return Promise.resolve({
        success,
        remaining: Math.max(0, max - recent.length),
        reset: oldest + windowMs,
      });
    },
  };
}

const limiters = new Map<string, RateLimiter>();

/** Devuelve (y memoriza) un limitador con nombre: `max` peticiones por `windowSec` segundos. */
export function getLimiter(
  name: string,
  max: number,
  windowSec: number,
): RateLimiter {
  const cacheKey = `${name}:${max}:${windowSec}`;
  const cached = limiters.get(cacheKey);
  if (cached) return cached;

  let limiter: RateLimiter;
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    const rl = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(max, `${windowSec} s`),
      prefix: `pirayu:${name}`,
    });
    limiter = {
      limit: async (key) => {
        const r = await rl.limit(key);
        return { success: r.success, remaining: r.remaining, reset: r.reset };
      },
    };
  } else {
    limiter = createMemoryLimiter(max, windowSec * 1000);
  }
  limiters.set(cacheKey, limiter);
  return limiter;
}

/** IP del cliente. En Vercel `x-forwarded-for` lo fija la plataforma; detrás de otro proxy, verificar que éste lo sobrescriba. */
export function clientIp(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (fwd) return fwd;
  return headers.get('x-real-ip') ?? 'desconocida';
}
