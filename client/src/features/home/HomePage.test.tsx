import { render, screen } from '@testing-library/react';
import type { SubEvent } from '@/features/schedule/schedule-types';
import { HomePage } from './HomePage';

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
    render(<HomePage subEvents={[]} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'A jornada que virou tradição em Viçosa',
    );
  });

  it('lists each sub-event with its date range and location', () => {
    render(<HomePage subEvents={[futsal]} />);

    expect(screen.getByRole('heading', { name: 'JOCEV — Futsal' })).toBeInTheDocument();
    expect(screen.getByText('9 a 19 de dezembro')).toBeInTheDocument();
    expect(screen.getByText('Ginásio Municipal')).toBeInTheDocument();
  });

  it('explains that the program is coming soon when there are no sub-events', () => {
    render(<HomePage subEvents={[]} />);

    expect(screen.getByText(/programação completa será publicada em breve/i)).toBeInTheDocument();
  });

  it('presents the timeline of milestones as an ordered list', () => {
    render(<HomePage subEvents={[]} />);

    expect(screen.getByRole('heading', { name: '25 anos de história' })).toBeInTheDocument();
    expect(screen.getByText('2001')).toBeInTheDocument();
  });
});
