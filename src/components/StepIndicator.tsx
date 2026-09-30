import { Check } from 'lucide-react';
import type { RegistrationStep } from '@/types';

interface StepIndicatorProps {
  current: RegistrationStep;
}

const STEPS: { key: RegistrationStep; label: string; shortLabel: string }[] = [
  { key: 'inviter', label: 'Invitador', shortLabel: 'Invitador' },
  { key: 'ganamex', label: 'Registro GANAMEX', shortLabel: 'GANAMEX' },
  { key: 'success', label: 'Confirmación', shortLabel: 'Listo' },
];

export function StepIndicator({ current }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isLast = i === STEPS.length - 1;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                <div
                  className={`
                    relative flex items-center justify-center rounded-full transition-all duration-500
                    h-9 w-9 sm:h-10 sm:w-10 text-xs sm:text-sm font-semibold font-display
                    ${
                      isCompleted
                        ? 'bg-gan-600 text-white shadow-glow'
                        : isCurrent
                        ? 'bg-gan-600 text-white shadow-glow-lg ring-4 ring-gan-100'
                        : 'bg-white text-ink-400 border-2 border-ink-200'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 animate-scale-in" />
                  ) : (
                    i + 1
                  )}
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full border-2 border-gan-400 animate-pulse-ring" />
                  )}
                </div>
                <span
                  className={`
                    text-[10px] sm:text-xs font-medium font-body transition-colors duration-300
                    ${isCurrent ? 'text-gan-700' : isCompleted ? 'text-ink-600' : 'text-ink-400'}
                  `}
                >
                  {step.shortLabel}
                </span>
              </div>
              {!isLast && (
                <div className="flex-1 mx-2 sm:mx-3 h-0.5 rounded-full bg-ink-200 relative overflow-hidden -mt-5">
                  <div
                    className={`
                      absolute inset-0 bg-gradient-to-r from-gan-500 to-gan-600 rounded-full
                      transition-all duration-700 ease-out
                      ${isCompleted ? 'w-full' : 'w-0'}
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
