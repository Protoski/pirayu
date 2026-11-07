'use client';

import { MotionConfig } from 'motion/react';
import { ThemeProvider as NextThemes } from 'next-themes';

/** Tema claro/oscuro (respeta prefers-color-scheme) y movimiento reducido según el sistema. */
export function Providers({
  children,
  nonce,
}: {
  children: React.ReactNode;
  nonce?: string;
}): React.JSX.Element {
  return (
    <NextThemes
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      nonce={nonce}
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemes>
  );
}
