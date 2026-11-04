import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { BestPlayer, Team } from '../types';
import { BestPlayerCard } from './BestPlayerCard';

const player: BestPlayer = { name: 'Maria Souza', teamId: 'team-1', photoKey: null };
const team = { id: 'team-1', name: 'Bairro Centro' } as Team;

describe('BestPlayerCard', () => {
  it('shows the default avatar when the player has no photo', () => {
    render(<BestPlayerCard player={player} team={team} gender="FEMALE" />);

    expect(screen.getByRole('img', { name: 'Avatar do melhor jogador' })).toBeInTheDocument();
    expect(screen.getByText('Maria Souza')).toBeInTheDocument();
  });

  it('draws different hair for the female and the male avatar', () => {
    const female = render(<BestPlayerCard player={player} team={team} gender="FEMALE" />);
    const femaleShapes = female.container.querySelectorAll('svg path').length;
    female.unmount();
    const male = render(<BestPlayerCard player={player} team={team} gender="MALE" />);

    expect(male.container.querySelectorAll('svg path').length).toBeLessThan(femaleShapes);
  });
});
