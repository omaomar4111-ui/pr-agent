import { cn } from '@/lib/utils';

export function Card({ className, children, hover = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6',
        hover && 'hover:border-brand/40 hover:bg-white/[0.05] hover:shadow-[var(--shadow-glow)] transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
