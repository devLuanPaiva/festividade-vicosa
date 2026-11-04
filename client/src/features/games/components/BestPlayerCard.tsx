import Image from 'next/image';
import type { ReactElement } from 'react';
import { isVectorPhoto, resolvePhotoUrl } from '../lib/photo-url';
import type { BestPlayer, Gender, Team } from '../types';
import { PlayerAvatar } from './PlayerAvatar';

interface BestPlayerCardProps {
  player: BestPlayer;
  team: Team;
  gender: Gender;
}

export function BestPlayerCard({ player, team, gender }: BestPlayerCardProps): ReactElement {
  const photoUrl = resolvePhotoUrl(player.photoKey);
  return (
    <div className="flex items-center gap-5 rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(7,59,134,0.12)]">
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={`Foto de ${player.name}`}
          width={96}
          height={96}
          unoptimized={isVectorPhoto(photoUrl)}
          className="size-24 shrink-0 rounded-full bg-paper object-cover ring-4 ring-sun"
        />
      ) : (
        <PlayerAvatar gender={gender} />
      )}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          Melhor jogador da partida
        </p>
        <p className="mt-1 font-display text-4xl leading-none text-brand-900">{player.name}</p>
        <p className="mt-1 text-sm text-ink-soft">{team.name}</p>
      </div>
    </div>
  );
}
