import type { ReactElement } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Icon } from '@/components/ui/Icon';

export function NotFoundView(): ReactElement {
  return (
    <PageHero
      eyebrow="Fora de campo"
      title="Página não encontrada"
      description="O link pode estar errado ou a página foi movida. Que tal voltar para o jogo?"
    >
      <div className="mt-8 flex items-center gap-5">
        <p
          aria-hidden="true"
          className="outline-text font-display text-8xl leading-none md:text-9xl"
        >
          404
        </p>
        <Icon name="ball" className="size-16 text-sun motion-safe:animate-bounce md:size-24" />
      </div>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <ButtonLink href="/">Voltar ao início</ButtonLink>
        <ButtonLink href="/jogos" variant="outline">
          Ver jogos
        </ButtonLink>
        <ButtonLink href="/galeria" variant="outline">
          Ver a galeria
        </ButtonLink>
      </div>
    </PageHero>
  );
}
