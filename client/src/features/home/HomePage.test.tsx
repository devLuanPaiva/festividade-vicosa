import { render, screen } from '@testing-library/react';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('renders the festival title as the main heading', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Festividade de Viçosa' }),
    ).toBeInTheDocument();
  });
});
