import { CheckCircle2, PartyPopper, Users, ArrowRight } from 'lucide-react';
import type { AssociateInfo, SponsorAssignment } from '@/types';

interface SuccessStepProps {
  inviter: AssociateInfo;
  associateName: string;
  sponsor: SponsorAssignment;
  associateId: string;
  onRestart: () => void;
}

export function SuccessStep({
  associateName,
  sponsor,
  associateId,
  onRestart,
}: SuccessStepProps) {
  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up text-center">
      {/* Animated success icon */}
      <div className="relative inline-flex items-center justify-center mb-5">
        <div className="absolute inset-0 rounded-full bg-gan-400/20 animate-pulse-ring" />
        <div className="absolute inset-0 rounded-full bg-gan-400/20 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-gan-500 to-gan-700 flex items-center justify-center shadow-glow-lg">
          <CheckCircle2 className="w-10 h-10 text-white animate-scale-in" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gan-100 text-gan-700 text-xs font-semibold font-body mb-3 animate-fade-in">
        <PartyPopper className="w-3.5 h-3.5" />
        Registro completado
      </div>

      <h2 className="font-display font-bold text-2xl text-ink-900 mb-2">
        ¡Bienvenido a la red!
      </h2>
      <p className="text-sm text-ink-500 font-body mb-6 leading-relaxed text-balance">
        Tu registro se ha activado correctamente. Ya eres parte de la estructura de GAN.Impulso.
      </p>

      {/* Confirmation card */}
      <div className="rounded-2xl bg-white border border-ink-100 p-5 mb-5 text-left space-y-3 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-ink-100">
          <span className="text-xs font-medium text-ink-400 uppercase tracking-wide">Datos del registro</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gan-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Activo
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gan-50 border border-gan-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-gan-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-ink-400 font-body uppercase tracking-wide">Asociado</p>
            <p className="text-sm font-semibold text-ink-900 font-body truncate">{associateName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-ink-50 px-3 py-2.5">
            <p className="text-[10px] text-ink-400 font-body uppercase tracking-wide mb-0.5">ID asociado</p>
            <p className="text-sm font-display font-bold text-ink-800 tracking-wider truncate">
              {associateId}
            </p>
          </div>
          <div className="rounded-xl bg-ink-50 px-3 py-2.5">
            <p className="text-[10px] text-ink-400 font-body uppercase tracking-wide mb-0.5">Patrocinador</p>
            <p className="text-sm font-display font-bold text-ink-800 tracking-wider truncate">
              {sponsor.sponsorId}
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-ink-400 font-body mb-4 leading-relaxed">
        Guarda tu ID de asociado. Lo necesitarás para invitar a nuevas personas a tu red.
      </p>

      <button
        onClick={onRestart}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-ink-100 text-ink-700 font-display font-semibold text-base py-4 hover:bg-ink-200 transition-all duration-300"
      >
        Registrar otro asociado
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
