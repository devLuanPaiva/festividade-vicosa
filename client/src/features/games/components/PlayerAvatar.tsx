import type { ReactElement } from 'react';
import type { Gender } from '../types';

interface PlayerAvatarProps {
  gender: Gender;
}

const AVATAR_LABEL = 'Avatar do melhor jogador';

function HairBehind(): ReactElement {
  return (
    <>
      <path d="M26 46c0-20 9-30 22-30s22 10 22 30v26H26Z" className="fill-brand-900" />
      <circle cx="73" cy="30" r="7" className="fill-brand-900" />
    </>
  );
}

function HairFront({ gender }: Readonly<PlayerAvatarProps>): ReactElement {
  const fringe =
    gender === 'FEMALE'
      ? 'M31 40c2-12 10-18 18-18s16 6 18 18c-8-3-14-9-17-14-3 7-10 13-19 14Z'
      : 'M31 40c0-12 8-19 18-19s17 7 17 19c-6-2-10-6-12-10-4 6-12 10-23 10Z';
  return <path d={fringe} className="fill-brand-900" />;
}

function Face(): ReactElement {
  return (
    <>
      <circle cx="41" cy="45" r="2.6" className="fill-brand-900" />
      <circle cx="57" cy="45" r="2.6" className="fill-brand-900" />
      <path
        d="M39 53c3 6 17 6 20 0"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-brand-900"
      />
      <circle cx="35" cy="52" r="3" className="fill-[#f29b9b] opacity-70" />
      <circle cx="63" cy="52" r="3" className="fill-[#f29b9b] opacity-70" />
    </>
  );
}

export function PlayerAvatar({ gender }: Readonly<PlayerAvatarProps>): ReactElement {
  return (
    <svg
      role="img"
      aria-label={AVATAR_LABEL}
      viewBox="0 0 96 96"
      className="size-24 shrink-0 rounded-full bg-sun/30 ring-4 ring-sun"
    >
      {gender === 'FEMALE' ? <HairBehind /> : null}
      <path d="M14 96c2-18 16-26 34-26s32 8 34 26Z" className="fill-brand-600" />
      <rect x="42" y="58" width="14" height="14" rx="5" className="fill-[#f2c6a0]" />
      <circle cx="48" cy="46" r="19" className="fill-[#f2c6a0]" />
      <HairFront gender={gender} />
      <Face />
    </svg>
  );
}
