import Link from 'next/link';
import type { ReactElement } from 'react';
import type { KpiTileData } from '../types';

interface KpiTileProps {
  tile: KpiTileData;
}

const TILE_CLASS =
  'flex h-full flex-col gap-1 rounded-2xl border border-admin-line bg-admin-surface p-4';

function TileBody({ tile }: KpiTileProps): ReactElement {
  const captionTone = tile.needsAttention ? 'font-semibold text-danger' : 'text-admin-muted';
  return (
    <>
      <span className="text-sm font-semibold text-admin-muted">{tile.label}</span>
      <span className="text-3xl font-bold tabular-nums">{tile.value}</span>
      <span className={`text-sm ${captionTone}`}>{tile.caption}</span>
      {tile.meterPercent === null ? null : (
        <span
          role="meter"
          aria-label={tile.label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={tile.meterPercent}
          className="mt-2 block h-2 overflow-hidden rounded-full bg-admin-line"
        >
          <span
            className="block h-full rounded-full bg-chart-1"
            style={{ width: `${tile.meterPercent}%` }}
          />
        </span>
      )}
    </>
  );
}

export function KpiTile({ tile }: KpiTileProps): ReactElement {
  if (tile.href === null) {
    return (
      <div className={TILE_CLASS}>
        <TileBody tile={tile} />
      </div>
    );
  }
  return (
    <Link href={tile.href} className={`${TILE_CLASS} transition-colors hover:border-brand-500`}>
      <TileBody tile={tile} />
    </Link>
  );
}
