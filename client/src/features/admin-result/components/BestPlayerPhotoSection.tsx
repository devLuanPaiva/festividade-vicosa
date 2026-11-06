import type { ReactElement } from 'react';
import { PhotoSection } from '@/features/admin-shell/components/PhotoSection';
import { resolvePhotoUrl } from '@/features/games/lib/photo-url';
import type { Match } from '@/features/games/types';
import {
  removeBestPlayerPhotoAction,
  uploadBestPlayerPhotoAction,
} from '../actions/best-player-photo-actions';

interface BestPlayerPhotoSectionProps {
  match: Match;
}

export function BestPlayerPhotoSection({
  match,
}: Readonly<BestPlayerPhotoSectionProps>): ReactElement {
  const { bestPlayer } = match;
  if (!bestPlayer) {
    return (
      <section className="flex flex-col gap-2 rounded-2xl border border-dashed border-admin-line p-5">
        <h2 className="font-bold">Melhor jogador</h2>
        <p className="text-sm text-admin-muted">
          Para enviar a foto do melhor jogador, informe o nome dele no formulário acima e salve o
          resultado.
        </p>
      </section>
    );
  }
  return (
    <PhotoSection
      title={`Melhor jogador: ${bestPlayer.name}`}
      alt={`Foto de ${bestPlayer.name}`}
      photoUrl={resolvePhotoUrl(bestPlayer.photoKey)}
      uploadAction={uploadBestPlayerPhotoAction.bind(null, match.id)}
      removeAction={removeBestPlayerPhotoAction.bind(null, match.id)}
    />
  );
}
