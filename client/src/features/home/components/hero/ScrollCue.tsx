import type { ReactElement } from 'react';

export function ScrollCue(): ReactElement {
  return (
    <a
      href="#estatisticas"
      aria-label="Rolar para o próximo conteúdo"
      className="absolute inset-x-0 bottom-8 mx-auto hidden w-fit animate-cue flex-col items-center gap-1 text-sm font-medium text-white/90 md:flex"
    >
      Role
      <span aria-hidden="true" className="h-8 w-px bg-white/80" />
    </a>
  );
}
