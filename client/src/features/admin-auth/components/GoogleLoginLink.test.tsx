import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GoogleLoginLink } from './GoogleLoginLink';

describe('GoogleLoginLink', () => {
  it('lets the first click go to Google and blocks the next ones', () => {
    render(<GoogleLoginLink />);
    const link = screen.getByRole('link', { name: 'Entrar com Google' });

    const firstClickWasAllowed = fireEvent.click(link);
    const redirecting = screen.getByRole('link', { name: 'Redirecionando…' });
    const secondClickWasAllowed = fireEvent.click(redirecting);

    expect(firstClickWasAllowed).toBe(true);
    expect(secondClickWasAllowed).toBe(false);
    expect(redirecting).toHaveAttribute('aria-disabled', 'true');
  });

  it('works again when the person comes back with the browser back button', () => {
    render(<GoogleLoginLink />);
    fireEvent.click(screen.getByRole('link', { name: 'Entrar com Google' }));

    const restored = new Event('pageshow') as PageTransitionEvent;
    Object.defineProperty(restored, 'persisted', { value: true });
    fireEvent(window, restored);

    expect(screen.getByRole('link', { name: 'Entrar com Google' })).toHaveAttribute(
      'aria-disabled',
      'false',
    );
  });
});
