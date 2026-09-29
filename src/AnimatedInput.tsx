import { useState, useEffect, useRef, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface AnimatedInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  disabled?: boolean;
  autoFocus?: boolean;
  uppercase?: boolean;
  helperText?: string;
  state?: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
  successMessage?: string;
  maxLength?: number;
  type?: string;
  readOnly?: boolean;
}

export function AnimatedInput({
  label,
  value,
  onChange,
  placeholder,
  icon,
  disabled = false,
  autoFocus = false,
  uppercase = false,
  helperText,
  state = 'idle',
  errorMessage,
  successMessage,
  maxLength,
  type = 'text',
  readOnly = false,
}: AnimatedInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasValue = value.length > 0;
  const isFloating = focused || hasValue;

  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = uppercase ? e.target.value.toUpperCase() : e.target.value;
    onChange(val);
  };

  const borderColor =
    state === 'error'
      ? 'border-red-400'
      : state === 'success'
      ? 'border-gan-500'
      : focused
      ? 'border-gan-500 ring-4 ring-gan-100'
      : 'border-ink-200';

  return (
    <div className="w-full">
      <div
        className={`
          relative flex items-center rounded-2xl bg-white border-2 transition-all duration-200
          ${borderColor}
          ${disabled ? 'opacity-60' : ''}
        `}
      >
        <div
          className={`
            absolute left-3.5 transition-all duration-200 pointer-events-none
            ${icon ? 'flex items-center' : 'hidden'}
            ${state === 'error' ? 'text-red-400' : state === 'success' ? 'text-gan-500' : focused ? 'text-gan-600' : 'text-ink-400'}
          `}
        >
          {icon}
        </div>

        <div className="relative flex-1">
          <label
            className={`
              absolute pointer-events-none transition-all duration-200 font-body
              ${icon ? 'left-11' : 'left-3.5'}
              ${
                isFloating
                  ? 'top-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-500'
                  : 'top-1/2 -translate-y-1/2 text-sm text-ink-400'
              }
            `}
          >
            {label}
          </label>
          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={isFloating ? placeholder : ''}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            className={`
              w-full bg-transparent outline-none font-body text-sm text-ink-900
              ${icon ? 'pl-11' : 'pl-3.5'} pr-11
              ${isFloating ? 'pt-6 pb-1' : 'py-3.5'}
              ${readOnly ? 'cursor-default select-all' : ''}
            `}
          />
        </div>

        <div className="absolute right-3.5 flex items-center justify-center">
          {state === 'loading' && (
            <Loader2 className="w-5 h-5 text-gan-500 animate-spin" />
          )}
          {state === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-gan-500 animate-scale-in" />
          )}
          {state === 'error' && (
            <AlertCircle className="w-5 h-5 text-red-400 animate-scale-in" />
          )}
        </div>
      </div>

      {helperText && state === 'idle' && (
        <p className="mt-1.5 ml-2 text-xs text-ink-400 font-body">{helperText}</p>
      )}
      {state === 'error' && errorMessage && (
        <p className="mt-1.5 ml-2 text-xs text-red-500 font-body animate-fade-in">{errorMessage}</p>
      )}
      {state === 'success' && successMessage && (
        <p className="mt-1.5 ml-2 text-xs text-gan-600 font-body animate-fade-in">{successMessage}</p>
      )}
    </div>
  );
}
