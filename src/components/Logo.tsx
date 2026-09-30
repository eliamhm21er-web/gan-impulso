interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export function Logo({ className = '', showText = true, variant = 'dark' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-ink-900';
  const subColor = variant === 'light' ? 'text-gan-300' : 'text-gan-600';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative shrink-0">
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          className="drop-shadow-sm"
        >
          <rect width="44" height="44" rx="11" fill="url(#gan-gradient)" />
          <defs>
            <linearGradient id="gan-gradient" x1="0" y1="0" x2="44" y2="44">
              <stop stopColor="#047857" />
              <stop offset="1" stopColor="#065f46" />
            </linearGradient>
          </defs>
          <circle cx="22" cy="12" r="4" fill="#34d399" />
          <circle cx="11" cy="32" r="4" fill="#6ee7b7" />
          <circle cx="22" cy="32" r="4" fill="#6ee7b7" />
          <circle cx="33" cy="32" r="4" fill="#6ee7b7" />
          <line x1="22" y1="16" x2="11" y2="28" stroke="#34d399" stroke-width="1.8" stroke-linecap="round" opacity="0.7" />
          <line x1="22" y1="16" x2="22" y2="28" stroke="#34d399" stroke-width="1.8" stroke-linecap="round" opacity="0.7" />
          <line x1="22" y1="16" x2="33" y2="28" stroke="#34d399" stroke-width="1.8" stroke-linecap="round" opacity="0.7" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-extrabold text-lg tracking-tight ${textColor}`}>
            GAN<span className="text-gan-500">.</span>Impulso
          </span>
          <span className={`font-body text-[10px] font-medium tracking-[0.18em] uppercase mt-0.5 ${subColor}`}>
            Red de Crecimiento
          </span>
        </div>
      )}
    </div>
  );
}
