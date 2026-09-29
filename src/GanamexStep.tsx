import { useState, useEffect, useCallback } from 'react';
import {
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Clock,
  KeyRound,
  Info,
  UserCheck,
  BadgeCheck,
  Users,
} from 'lucide-react';
import { AnimatedInput } from '@/components/AnimatedInput';
import { validateAssociateId } from '@/services/registration';
import type { AssociateInfo, SponsorAssignment, RegistrationStatus } from '@/types';

interface GanamexStepProps {
  inviter: AssociateInfo;
  associateName: string;
  sponsor: SponsorAssignment;
  onComplete: (associateId: string) => void;
}

type InputState = 'idle' | 'loading' | 'success' | 'error';

export function GanamexStep({
  inviter,
  associateName,
  sponsor,
  onComplete,
}: GanamexStepProps) {
  const [associateId, setAssociateId] = useState('');
  const [inputState, setInputState] = useState<InputState>('idle');
  const [status, setStatus] = useState<RegistrationStatus>('pending');
  const [canActivate, setCanActivate] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const handleValidation = useCallback(async (id: string) => {
    if (id.trim().length < 3) {
      setInputState('idle');
      return;
    }
    setInputState('loading');
    const valid = await validateAssociateId(id);
    if (valid) {
      setInputState('success');
    } else {
      setInputState('error');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (associateId.trim().length >= 3) {
        handleValidation(associateId);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [associateId, handleValidation]);

  useEffect(() => {
    setCanActivate(inputState === 'success');
  }, [inputState]);

  const handleActivate = async () => {
    if (!canActivate) return;
    setIsActivating(true);
    await new Promise((r) => setTimeout(r, 900));
    setStatus('active');
    setIsActivating(false);
    setTimeout(() => onComplete(associateId.trim()), 800);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gan-50 border border-gan-100 mb-3">
          <KeyRound className="w-7 h-7 text-gan-600" />
        </div>
        <h2 className="font-display font-bold text-xl text-ink-900">Registro en GANAMEX</h2>
        <p className="mt-1.5 text-sm text-ink-500 font-body">
          Completa tu registro en la plataforma y activa tu cuenta
        </p>
      </div>

      {/* Registration summary card */}
      <div className="rounded-2xl bg-white border border-ink-100 p-4 mb-4 space-y-2.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-ink-100">
          <span className="text-xs font-medium text-ink-400 uppercase tracking-wide">Resumen</span>
          <span className="text-xs font-semibold text-gan-600 font-body">Paso 1 completado</span>
        </div>
        <SummaryRow icon={<UserCheck className="w-4 h-4" />} label="Nuevo asociado" value={associateName} />
        <SummaryRow icon={<Users className="w-4 h-4" />} label="Invitador" value={inviter.name} />
        <SummaryRow icon={<BadgeCheck className="w-4 h-4" />} label="ID patrocinador" value={sponsor.sponsorId} mono />
      </div>

      {/* GANAMEX instructions */}
      <div className="rounded-2xl bg-gradient-to-br from-gan-50 to-emerald-50 border border-gan-200 p-4 mb-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gan-600 flex items-center justify-center">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm text-ink-900">
              Regístrate en GANAMEX
            </h3>
            <p className="text-xs text-ink-600 font-body mt-0.5 leading-relaxed">
              Dirígete a la plataforma de GANAMEX y completa tu registro utilizando el ID patrocinador que el sistema te asignó.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white/70 border border-gan-100 px-3 py-2.5 mb-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-ink-500 font-body">Tu ID patrocinador:</span>
            <span className="font-display font-bold text-sm text-gan-700 tracking-wider select-all">
              {sponsor.sponsorId}
            </span>
          </div>
        </div>

        <a
          href="https://www.ganamex.org/registro/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-gan-600 text-white font-body font-medium text-sm py-2.5 hover:bg-gan-700 transition-colors duration-200"
        >
          Ir a GANAMEX
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Associate ID input */}
      <div className="space-y-4">
        <AnimatedInput
          label="ID asociado"
          value={associateId}
          onChange={setAssociateId}
          placeholder="El ID que GANAMEX te asignó"
          icon={<KeyRound className="w-5 h-5" />}
          state={inputState}
          helperText="Ingresa el ID que recibiste al registrarte en GANAMEX"
          errorMessage="ID no válido. Verifica el ID que te proporcionó GANAMEX"
          successMessage="ID válido. Puedes activar tu registro"
        />

        {/* Status badge */}
        <div className="flex items-center justify-center">
          <div
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-xs font-semibold
              transition-all duration-400
              ${
                status === 'active'
                  ? 'bg-gan-100 text-gan-700 border border-gan-300'
                  : 'bg-amber-50 text-amber-600 border border-amber-200'
              }
            `}
          >
            {status === 'active' ? (
              <>
                <CheckCircle2 className="w-4 h-4 animate-scale-in" />
                Estado: Activo
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                Estado: Pendiente
              </>
            )}
          </div>
        </div>

        {/* Activate button */}
        <button
          onClick={handleActivate}
          disabled={!canActivate || isActivating || status === 'active'}
          className={`
            w-full flex items-center justify-center gap-2 rounded-2xl font-display font-semibold text-base
            transition-all duration-300 py-4
            ${
              status === 'active'
                ? 'bg-gan-100 text-gan-700 cursor-default'
                : canActivate && !isActivating
                ? 'bg-gan-600 text-white hover:bg-gan-700 shadow-lg shadow-gan-600/20 hover:shadow-gan-600/30 hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-ink-100 text-ink-400 cursor-not-allowed'
            }
          `}
        >
          {status === 'active' ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Registro activado
            </>
          ) : isActivating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Activando...
            </>
          ) : (
            <>
              Activar registro
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-ink-50 flex items-center justify-center text-ink-400">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-ink-400 font-body uppercase tracking-wide">{label}</p>
        <p className={`text-sm text-ink-800 font-body font-medium truncate ${mono ? 'font-mono tracking-wide' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
}


