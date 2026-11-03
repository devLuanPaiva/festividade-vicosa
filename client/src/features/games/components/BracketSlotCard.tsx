import type { ReactElement } from 'react';
import type { BracketSlot } from '../lib/build-bracket-tree';
import { BracketMatchCard } from './BracketMatchCard';
import { BracketPlaceholderCard } from './BracketPlaceholderCard';

interface BracketSlotCardProps {
  slot: BracketSlot;
}

export function BracketSlotCard({ slot }: BracketSlotCardProps): ReactElement {
  return slot ? <BracketMatchCard match={slot} /> : <BracketPlaceholderCard />;
}
