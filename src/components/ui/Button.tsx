import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { soundFX } from '@/lib/soundFX';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] select-none cursor-pointer',
  {
    variants: {
      variant: {
        lime: 'bg-[#d3fd50] text-[#0f1011] hover:bg-[#c4ee3e] hover:shadow-[0_0_25px_rgba(211,253,80,0.45)] hover:scale-[1.01] shadow-lg font-black',
        primary: 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:from-[#7c3aed] hover:to-[#6d28d9] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:scale-[1.01] shadow-[var(--shadow-glow)] border border-purple-400/20',
        secondary: 'bg-[#1a1b1e] border border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]',
        ghost: 'text-[#9ca3af] hover:text-white hover:bg-white/5',
        danger: 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'lime', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, onClick, onMouseEnter, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      onClick={(e) => {
        soundFX.playPop();
        onClick?.(e);
      }}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
