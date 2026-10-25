import type { ReactElement } from 'react';
import { roundLabel } from '../lib/match-labels';
import type { BracketTree as BracketTreeData } from '../lib/build-bracket-tree';
import { BracketColumn } from './BracketColumn';
import { BracketSlotCard } from './BracketSlotCard';

interface BracketTreeProps {
  tree: BracketTreeData;
}

const FINAL_LINES =
  'before:absolute before:-left-3 before:top-1/2 before:h-px before:w-3 before:bg-white/40 after:absolute after:-right-3 after:top-1/2 after:h-px after:w-3 after:bg-white/40';

export function BracketTree({ tree }: BracketTreeProps): ReactElement {
  const hasSides = tree.sideA.length > 0;
  return (
    <div className="-mx-[5%] mt-8 overflow-x-auto px-[5%] pb-4">
      <div className="mx-auto flex w-max items-stretch">
        {tree.sideA.map((column, index) => (
          <BracketColumn key={column.round} column={column} side="A" hasIncoming={index > 0} />
        ))}
        <div className="box-content flex w-56 shrink-0 flex-col px-3">
          <h3 className="mb-4 h-8 text-center font-display text-3xl text-sun">
            {roundLabel('FINAL')}
          </h3>
          <div className={`relative flex flex-1 items-center ${hasSides ? FINAL_LINES : ''}`}>
            <div className="w-full">
              <BracketSlotCard slot={tree.final} />
            </div>
          </div>
        </div>
        {tree.sideB.map((column, index) => (
          <BracketColumn
            key={column.round}
            column={column}
            side="B"
            hasIncoming={index < tree.sideB.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
