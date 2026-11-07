import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs font-semibold rounded-sm',
  {
    variants: {
      variant: {
        default: 'border-border text-foreground',
        success: 'border-success/40 text-success',
        warning: 'border-warning/40 text-warning',
        info: 'border-primary/30 text-primary bg-primary-soft',
        ejemplo: 'border-dashed border-warning/60 text-warning',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>): React.JSX.Element {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
