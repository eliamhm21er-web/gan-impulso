import { useState } from 'react';
import { Logo } from '@/components/Logo';
import { NetworkBackground } from '@/components/NetworkBackground';
import { StepIndicator } from '@/components/StepIndicator';
import { InviterStep } from '@/components/InviterStep';
import { GanamexStep } from '@/components/GanamexStep';
import { SuccessStep } from '@/components/SuccessStep';
import type { RegistrationStep, AssociateInfo, SponsorAssignment } from '@/types';

interface RegistrationData {
  inviter: AssociateInfo;
  associateName: string;
  sponsor: SponsorAssignment;
  associateId: string;
}

function App() {
  const [step, setStep] = useState<RegistrationStep>('inviter');
  const [data, setData] = useState<RegistrationData | null>(null);

  const handleInviterComplete = (partial: Omit<RegistrationData, 'associateId'>) => {
    setData({ ...partial, associateId: '' });
    setStep('ganamex');
  };

  const handleGanamexComplete = (associateId: string) => {
    setData((prev) => (prev ? { ...prev, associateId } : prev));
    setStep('success');
  };

  const handleRestart = () => {
    setData(null);
    setStep('inviter');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-ink-50 via-white to-gan-50/40 flex flex-col">
      <NetworkBackground />

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Logo />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-ink-100 text-xs font-body font-medium text-ink-500">
            <span className="w-1.5 h-1.5 rounded-full bg-gan-500 animate-pulse" />
            Sistema de registro
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6">
        <div className="w-full max-w-lg">
          {/* Card container */}
          <div className="glass rounded-3xl border border-white/60 shadow-xl shadow-ink-900/5 p-6 sm:p-8">
            {/* Step indicator */}
            <div className="mb-6 sm:mb-8">
              <StepIndicator current={step} />
            </div>

            {/* Step content */}
            <div key={step} className="min-h-[340px] flex items-center justify-center">
              {step === 'inviter' && <InviterStep onComplete={handleInviterComplete} />}
              {step === 'ganamex' && data && (
                <GanamexStep
                  inviter={data.inviter}
                  associateName={data.associateName}
                  sponsor={data.sponsor}
                  onComplete={handleGanamexComplete}
                />
              )}
              {step === 'success' && data && (
                <SuccessStep
                  inviter={data.inviter}
                  associateName={data.associateName}
                  sponsor={data.sponsor}
                  associateId={data.associateId}
                  onRestart={handleRestart}
                />
              )}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center mt-5 text-xs text-ink-400 font-body">
            GAN.Impulso — Red de crecimiento 4×∞ · Estructura administrativa
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
