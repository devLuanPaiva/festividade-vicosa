import type { ReactElement } from 'react';
import type { BracketColumn as BracketColumnData, BracketSlot } from '../lib/build-bracket-tree';
import { BracketSlotCard } from './BracketSlotCard';

export type BracketSide = 'A' | 'B';

interface BracketColumnProps {
  column: BracketColumnData;
  side: BracketSide;
  hasIncoming: boolean;
}

const LINE = 'after:absolute after:bg-white/40';

const SIDE_CLASSES: Record<BracketSide, { outgoing: string; incoming: string; joiner: string }> = {
  A: {
    outgoing: 'after:-right-3 after:h-px after:w-3 after:top-1/2',
    incoming: 'before:-left-3',
    joiner: 'after:-right-3',
  },
  B: {
    outgoing: 'after:-left-3 after:h-px after:w-3 after:top-1/2',
    incoming: 'before:-right-3',
    joiner: 'after:-left-3',
  },
};

const INCOMING_LINE = 'before:absolute before:top-1/2 before:h-px before:w-3 before:bg-white/40';
const JOINER_LINE = 'after:absolute after:bottom-1/4 after:top-1/4 after:w-px after:bg-white/40';

function toPairs(slots: BracketSlot[]): BracketSlot[][] {
  return Array.from({ length: Math.ceil(slots.length / 2) }, (_, index) =>
    slots.slice(index * 2, index * 2 + 2),
  );
}

export function BracketColumn({ column, side, hasIncoming }: BracketColumnProps): ReactElement {
  const classes = SIDE_CLASSES[side];
  const cellClasses = `relative flex flex-1 items-center py-2 ${LINE} ${classes.outgoing} ${
    hasIncoming ? `${INCOMING_LINE} ${classes.incoming}` : ''
  }`;
  const pairClasses = `relative flex flex-1 flex-col ${
    column.slots.length > 1 ? `${JOINER_LINE} ${classes.joiner}` : ''
  }`;
  return (
    <div className="box-content flex w-56 shrink-0 flex-col px-3">
      <h3 className="mb-4 h-8 font-display text-2xl text-sun">{column.title}</h3>
      <div className="flex flex-1 flex-col">
        {toPairs(column.slots).map((pair, pairIndex) => (
          <div key={pairIndex} className={pairClasses}>
            {pair.map((slot, slotIndex) => (
              <div key={slotIndex} className={cellClasses}>
                <div className="w-full">
                  <BracketSlotCard slot={slot} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
