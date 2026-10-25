import type { ReactElement } from 'react';

export function BracketPlaceholderCard(): ReactElement {
  return (
    <div className="flex min-h-32 flex-col justify-center gap-3 rounded-3xl border border-dashed border-white/30 p-4 text-white/60">
      <span className="text-sm font-semibold">A definir</span>
      <span className="h-px bg-white/15" />
      <span className="text-sm font-semibold">A definir</span>
    </div>
  );
}
