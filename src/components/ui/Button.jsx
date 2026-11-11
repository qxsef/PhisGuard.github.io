import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-brand-deep text-white hover:bg-brand border border-transparent',
  secondary: 'bg-surface text-fg hover:bg-[#2c2740] border border-white/10 hover:border-white/20',
  ghost: 'bg-transparent text-muted hover:text-fg hover:bg-white/5 border border-transparent',
  danger: 'bg-transparent text-bad hover:bg-bad/10 border border-bad/30',
};

export default function Button({ variant = 'primary', loading = false, icon: Icon, children, className = '', disabled, ...rest }) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition duration-200 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {loading ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : Icon && <Icon size={18} aria-hidden="true" />}
      {children}
    </button>
  );
}
