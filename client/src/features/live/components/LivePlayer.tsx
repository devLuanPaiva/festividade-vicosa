'use client';

import Image from 'next/image';
import { useEffect, useState, type ReactElement } from 'react';
import { buildEmbedUrl, buildWatchUrl } from '../lib/youtube-links';

const PREVIEW_WIDTH = 1280;
const PREVIEW_HEIGHT = 720;
const EMBED_PERMISSIONS = 'autoplay; encrypted-media; picture-in-picture; fullscreen';

const COLLAPSED_CLASS_NAME = 'relative w-full';
const EXPANDED_CLASS_NAME =
  'fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-8';

interface LivePlayerProps {
  title: string;
  videoId: string;
  previewUrl: string | null;
}

function useExpansion(): { isExpanded: boolean; toggle: () => void; collapse: () => void } {
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    if (!isExpanded) {
      return undefined;
    }
    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isExpanded]);
  return {
    isExpanded,
    toggle: () => setIsExpanded((current) => !current),
    collapse: () => setIsExpanded(false),
  };
}

function PlayFacade({ title, previewUrl, onPlay }: Readonly<PlayFacadeProps>): ReactElement {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Assistir à transmissão: ${title}`}
      className="group absolute inset-0 flex items-center justify-center bg-brand-900"
    >
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt=""
          width={PREVIEW_WIDTH}
          height={PREVIEW_HEIGHT}
          unoptimized
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <span className="px-6 text-center font-display text-4xl text-white md:text-6xl">
          {title}
        </span>
      )}
      <span
        aria-hidden="true"
        className="relative flex size-20 items-center justify-center rounded-full bg-sun text-3xl text-brand-900 shadow-[0_6px_0_#c9a900] transition-transform duration-300 group-hover:scale-110"
      >
        ▶
      </span>
    </button>
  );
}

interface PlayFacadeProps {
  title: string;
  previewUrl: string | null;
  onPlay: () => void;
}

export function LivePlayer({
  title,
  videoId,
  previewUrl,
}: Readonly<LivePlayerProps>): ReactElement {
  const [isPlaying, setIsPlaying] = useState(false);
  const { isExpanded, toggle, collapse } = useExpansion();
  return (
    <div className="flex flex-col gap-3">
      <div className={isExpanded ? EXPANDED_CLASS_NAME : COLLAPSED_CLASS_NAME}>
        <div className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-3xl bg-black ring-4 ring-sun">
          {isPlaying ? (
            <iframe
              title={title}
              src={buildEmbedUrl(videoId)}
              allow={EMBED_PERMISSIONS}
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 size-full"
            />
          ) : (
            <PlayFacade title={title} previewUrl={previewUrl} onPlay={() => setIsPlaying(true)} />
          )}
        </div>
        {isExpanded ? (
          <button
            type="button"
            onClick={collapse}
            className="absolute right-3 top-3 min-h-11 rounded-full bg-white px-5 font-semibold text-brand-900 sm:right-8 sm:top-8"
          >
            Fechar
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm text-white">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex min-h-11 items-center rounded-full px-5 font-semibold ring-2 ring-white/70 hover:bg-white hover:text-brand-900"
        >
          {isExpanded ? 'Reduzir' : 'Expandir'}
        </button>
        <a
          href={buildWatchUrl(videoId)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
        >
          Abrir no YouTube
        </a>
      </div>
    </div>
  );
}
