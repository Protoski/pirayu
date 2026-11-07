# Fotos, videos y escudo

Esta carpeta está vacía a propósito: el portal no incluye imágenes de terceros. Para reemplazar los marcadores gráficos:

1. Copiar aquí los archivos oficiales (con derechos de uso de la Municipalidad o licencia que permita su publicación).
   - Fotos: JPEG o WebP, lado mayor ≤ 2400 px. `next/image` genera AVIF/WebP y tamaños responsivos automáticamente.
   - Video del Hero (opcional): MP4 H.264, sin audio, ≤ 4 MB, 10–20 s en bucle, + imagen `poster`.
   - Escudo: SVG preferentemente.
2. Editar `src/content/sitio.ts`:
   - `institucion.escudo = '/media/escudo.svg'`
   - `heroDiapositivas[n].src = '/media/estacion.webp'` (y `alt` descriptivo)
   - `heroVideo = { src: '/media/hero.mp4', poster: '/media/hero.webp' }`
   - `galeria[n].src`, `administracion.intendente.foto`, `juntaMunicipal[n].foto`, `directores[n].foto`
3. Fotos de personas: contar con su autorización escrita (datos personales — imagen).
