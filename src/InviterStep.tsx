import { useState, useEffect, useCallback } from 'react';
import { UserCheck, Users, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { AnimatedInput } from '@/components/AnimatedInput';
import { lookupInviter, calculateSponsor } from '@/services/registration';
import type { AssociateInfo, SponsorAssignment } from '@/types';

interface InviterStepProps {
  onComplete: (data: {
    inviter: AssociateInfo;
    associateName: string;
    sponsor: SponsorAssignment;
  }) => void;
}

type InputState = 'idle' | 'loading' | 'success' | 'error';

export function InviterStep({ onComplete }: InviterStepProps) {
  const [inviterId, setInviterId] = useState('');
  const [inviter, setInviter] = useState<AssociateInfo | null>(null);
  const [inviterState, setInviterState] = useState<InputState>('idle');
  const [inviterError, setInviterError] = useState('');

  const [associateName, setAssociateName] = useState('');
  const [sponsor, setSponsor] = useState<SponsorAssignment | null>(null);
  const [sponsorState, setSponsorState] = useState<InputState>('idle');

  const [canContinue, setCanContinue] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInviterLookup = useCallback(async (id: string) => {
    if (id.trim().length < 3) {
      setInviter(null);
      setInviterState('idle');
      setInviterError('');
      return;
    }
    setInviterState('loading');
    setInviterError('');
    const result = await lookupInviter(id);
    if (result) {
      setInviter(result);
      setInviterState('success');
    } else {
      setInviter(null);
      setInviterState('error');
      setInviterError('No se encontró ningún asociado con ese ID');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inviterId.trim().length >= 3) {
        handleInviterLookup(inviterId);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [inviterId, handleInviterLookup]);

  useEffect(() => {
    if (inviter && associateName.trim().length >= 3 && !sponsor) {
      setSponsorState('loading');
      calculateSponsor(inviter.id).then((result) => {
        if (result) {
          setSponsor(result);
          setSponsorState('success');
        } else {
          setSponsorState('error');
        }
      });
    }
  }, [inviter, associateName, sponsor]);

  useEffect(() => {
    setCanContinue(
      inviter !== null &&
      inviterState === 'success' &&
      associateName.trim().length >= 3 &&
      sponsor !== null &&
      sponsorState === 'success'
    );
  }, [inviter, inviterState, associateName, sponsor, sponsorState]);

  const handleContinue = async () => {
    if (!canContinue || !inviter || !sponsor) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    onComplete({
      inviter,
      associateName: associateName.trim(),
      sponsor,
    });
  };

  const resetInviter = () => {
    setInviterId('');
    setInviter(null);
    setInviterState('idle');
    setInviterError('');
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gan-50 border border-gan-100 mb-3">
          <Users className="w-7 h-7 text-gan-600" />
        </div>
        <h2 className="font-display font-bold text-xl text-ink-900">Registro en GAN.Impulso</h2>
        <p className="mt-1.5 text-sm text-ink-500 font-body">
          Comienza ingresando el ID de quien te invita a la red
        </p>
      </div>

      <div className="space-y-4">
        {/* Inviter ID */}
        <div>
          <AnimatedInput
            label="ID del invitador"
            value={inviterId}
            onChange={(v) => {
              setInviterId(v);
              if (inviter) resetInviter();
              if (sponsor) {
                setSponsor(null);
                setSponsorState('idle');
              }
            }}
            placeholder="Ej: 10623"
            icon={<UserCheck className="w-5 h-5" />}
            autoFocus
            state={inviterState}
            errorMessage={inviterError}
            helperText="Ingresa el ID que te compartió tu invitador"
          />
        </div>

        {/* Inviter confirmation */}
        {inviter && inviterState === 'success' && (
          <div className="animate-slide-in-right rounded-2xl bg-gan-50 border border-gan-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gan-600 flex items-center justify-center text-white font-display font-bold text-sm">
                {inviter.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gan-700 font-body font-medium uppercase tracking-wide">
                  Invitador confirmado
                </p>
                <p className="text-sm font-semibold text-ink-900 font-body truncate">
                  {inviter.name}
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-gan-600 ml-auto shrink-0" />
            </div>
          </div>
        )}

        {/* Associate name */}
        <AnimatedInput
          label="Nombre del nuevo asociado"
          value={associateName}
          onChange={setAssociateName}
          placeholder="Nombre y apellidos completos"
          icon={<Users className="w-5 h-5" />}
          helperText="Tal como aparecerá en su perfil de asociado"
        />

        {/* Sponsor ID (auto-calculated) */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <AnimatedInput
            label="ID patrocinador"
            value={sponsor?.sponsorId ?? ''}
            onChange={() => {}}
            icon={<Sparkles className="w-5 h-5" />}
            readOnly
            state={sponsorState}
            helperText="Asignado automáticamente por el sistema"
            successMessage="Ubicación asignada en la red"
          />
          {sponsor && sponsorState === 'success' && (
            <div className="mt-2 flex items-start gap-2 rounded-xl bg-ink-50 border border-ink-100 px-3 py-2.5 animate-fade-in">
              <ShieldCheck className="w-4 h-4 text-gan-600 mt-0.5 shrink-0" />
              <p className="text-xs text-ink-500 font-body leading-relaxed">
                El sistema ha calculado automáticamente la posición óptima para este nuevo asociado dentro de la estructura de red.
              </p>
            </div>
          )}
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!canContinue || isSubmitting}
          className={`
            w-full flex items-center justify-center gap-2 rounded-2xl font-display font-semibold text-base
            transition-all duration-300 py-4 mt-2
            ${
              canContinue && !isSubmitting
                ? 'bg-gan-600 text-white hover:bg-gan-700 shadow-lg shadow-gan-600/20 hover:shadow-gan-600/30 hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-ink-100 text-ink-400 cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              Continuar registro
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
