import type { ReactElement } from 'react';
import { Section } from '@/components/layout/Section';
import { RevealText } from '@/components/motion/RevealText';
import { resolvePhotoUrl } from '@/features/games/lib/photo-url';
import { getActiveLive } from '../services/get-active-live';
import { LiveCountdown } from './LiveCountdown';
import { LivePlayer } from './LivePlayer';

export async function LiveLoader(): Promise<ReactElement | null> {
  const live = await getActiveLive();
  if (!live) {
    return null;
  }
  return (
    <Section tone="deep" id="ao-vivo" labelledBy="live-title" withWave>
      <div className="flex flex-col gap-8 text-white">
        <div>
          <p className="font-signature text-3xl text-sun md:text-4xl">Ao vivo</p>
          <RevealText
            id="live-title"
            text={live.title}
            className="font-display text-5xl md:text-7xl"
          />
        </div>
        <LiveCountdown startsAt={live.startsAt} />
        <LivePlayer
          title={live.title}
          videoId={live.videoId}
          previewUrl={resolvePhotoUrl(live.previewKey)}
        />
      </div>
    </Section>
  );
}
