import Image from 'next/image';
import type { ReactElement } from 'react';
import emancipationLogo from '@/assets/LOGOTIPOS/aniversario-63-anos/logotipo-emancipacao-2026.png';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/motion/Reveal';
import { RevealText } from '@/components/motion/RevealText';
import { ButtonLink } from '@/components/ui/ButtonLink';

export function ClosingSection(): ReactElement {
  return (
    <Section tone="splash" labelledBy="closing-title">
      <div className="grid items-center gap-10 py-6 md:grid-cols-2 md:gap-16">
        <Reveal direction="left" className="mx-auto w-full max-w-sm">
          <Image
            src={emancipationLogo}
            alt="Emancipação política de Viçosa, 63 anos"
            className="h-auto w-full animate-float drop-shadow-[0_20px_30px_rgba(7,59,134,0.3)]"
          />
        </Reveal>
        <div className="rounded-3xl bg-white p-8 shadow-[0_18px_50px_rgba(7,59,134,0.15)]">
          <RevealText
            id="closing-title"
            text="Dezembro tem Viçosa"
            className="font-display text-6xl text-brand-900 md:text-8xl"
          />
          <p className="mt-4 max-w-md text-lg text-ink-soft">
            Do primeiro apito à festa de emancipação nos dias 27 e 28, são 25 dias para viver com a
            cidade inteira.
          </p>
          <div className="mt-8">
            <ButtonLink href="/#programacao" variant="brand">
              Ver as datas
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
