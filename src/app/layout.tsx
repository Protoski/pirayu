import '@fontsource-variable/public-sans';
import '@fontsource-variable/source-serif-4';
import './globals.css';
import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { Providers } from '@/components/site/theme-provider';
import { institucion, modoDemostracion } from '@/content/sitio';

export const metadata: Metadata = {
  title: {
    default: `${institucion.nombre} · Propuesta de portal ciudadano`,
    template: `%s · ${institucion.nombre}`,
  },
  description:
    'Ventanilla única virtual: trámites, transparencia activa (Ley 5282/2014), autoridades y turismo de Pirayú, Paraguarí.',
  // Mientras sea demostración, no indexar en buscadores.
  robots: { index: !modoDemostracion, follow: !modoDemostracion },
  metadataBase: new URL('https://pirayu.vercel.app'),
  openGraph: {
    title: 'Pirayú · Renovación y servicio a la ciudadanía',
    description:
      'Información municipal, patrimonio y canales de atención. Propuesta de portal ciudadano.',
    locale: 'es_PY',
    type: 'website',
    images: [
      {
        url: '/media/oficial/estacion.jpg',
        width: 1200,
        height: 800,
        alt: 'Estación ferroviaria de Pirayú',
      },
    ],
  },
  icons: { icon: '/media/oficial/logo.png', apple: '/media/oficial/logo.png' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#18513b' },
    { media: '(prefers-color-scheme: dark)', color: '#101c18' },
  ],
};

/*
 * Aplica la escala tipográfica guardada antes del primer pintado (evita saltos de diseño).
 * Se ejecuta con el nonce de la CSP; no hay scripts inline sin nonce en el sitio.
 */
const FONT_SCALE_SCRIPT = `try{var s=localStorage.getItem('pirayu.fontScale');if(s==='1'||s==='2')document.documentElement.dataset.fontScale=s}catch(e){}`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  return (
    <html lang="es-PY" suppressHydrationWarning>
      <head>
        {}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: FONT_SCALE_SCRIPT }}
        />
      </head>
      <body className="min-h-dvh">
        <Providers nonce={nonce}>
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground"
          >
            Saltar al contenido principal
          </a>
          {modoDemostracion ? (
            <div
              role="note"
              className="border-b border-warning/40 bg-[#fff7e6] px-4 py-2 text-center text-sm text-[#5c3800] dark:bg-[#2a1f08] dark:text-[#f2c26b]"
            >
              Propuesta para la Municipalidad · Trámites en demostración. Los
              canales oficiales de contacto están disponibles.
            </div>
          ) : null}
          <SiteHeader />
          <main id="contenido" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
