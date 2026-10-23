import { render, screen, within } from '@testing-library/react';
import type { SubEvent } from '@/features/schedule/types';
import { SubEventGrid } from './components/program/SubEventGrid';
import { HomePage } from './HomePage';

function renderHome(subEvents: SubEvent[]): void {
  render(<HomePage programContent={<SubEventGrid subEvents={subEvents} />} />);
}

const futsal: SubEvent = {
  id: 'sub-event-1',
  editionId: 'edition-1',
  type: 'JOCEV_FUTSAL',
  name: 'JOCEV — Futsal',
  description: null,
  startDate: '2026-12-09',
  endDate: '2026-12-19',
  location: 'Ginásio Municipal',
};

describe('HomePage', () => {
  it('shows the festival title as the main heading', () => {
    renderHome([]);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'A jornada que virou tradição em Viçosa',
    );
  });

  it('lists each sub-event with its date range and location', () => {
    renderHome([futsal]);

    const program = within(screen.getByRole('region', { name: 'Programação de dezembro' }));

    expect(program.getByRole('heading', { name: 'JOCEV — Futsal' })).toBeInTheDocument();
    expect(program.getByText('9 a 19 de dezembro')).toBeInTheDocument();
    expect(program.getByText('Ginásio Municipal')).toBeInTheDocument();
  });

  it('explains that the program is coming soon when there are no sub-events', () => {
    renderHome([]);

    expect(screen.getByText(/programação completa será publicada em breve/i)).toBeInTheDocument();
  });

  it('tells the 25-year story through a list of milestones', () => {
    renderHome([]);

    expect(screen.getByRole('heading', { name: '25 anos de história' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'A primeira jornada' })).toBeInTheDocument();
  });

  it('presents the four calendar highlights of the championship', () => {
    renderHome([]);

    ['Handebol', 'Futsal', 'Festival Cultural', 'Vôlei de Areia'].forEach((name) => {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument();
    });
  });
});
