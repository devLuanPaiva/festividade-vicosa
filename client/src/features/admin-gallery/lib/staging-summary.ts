import type { StagedPhoto } from '../types';

export interface StagingSummary {
  total: number;
  finished: number;
  failed: number;
  percent: number;
}

const FULL = 100;

export function summarizeStaging(items: StagedPhoto[]): StagingSummary {
  const failed = items.filter((item) => item.status === 'failed').length;
  const finished = items.filter((item) => item.status === 'done').length + failed;
  const total = items.length;
  return {
    total,
    finished,
    failed,
    percent: total === 0 ? 0 : Math.round((finished / total) * FULL),
  };
}
