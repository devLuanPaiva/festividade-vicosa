import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { resolvePhotoUrl } from '@/features/games/lib/photo-url';
import { photoCountLabel } from '../lib/photo-count-label';

const COVER_SIZE = 640;

interface AlbumCardProps {
  href: string;
  title: string;
  detail: string;
  coverPhotoKey: string | null;
  photoCount: number;
}

export function AlbumCard({
  href,
  title,
  detail,
  coverPhotoKey,
  photoCount,
}: AlbumCardProps): ReactElement {
  const coverUrl = resolvePhotoUrl(coverPhotoKey, 'medium');
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-3xl bg-white text-ink shadow-[0_10px_30px_rgba(7,59,134,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(7,59,134,0.22)]"
    >
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt=""
          width={COVER_SIZE}
          height={COVER_SIZE}
          unoptimized
          className="aspect-4/3 w-full object-cover"
        />
      ) : null}
      <div className="flex flex-col gap-1 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{detail}</p>
        <h3 className="text-xl font-semibold text-brand-900">{title}</h3>
        <p className="text-sm text-ink-soft">{photoCountLabel(photoCount)}</p>
      </div>
    </Link>
  );
}
