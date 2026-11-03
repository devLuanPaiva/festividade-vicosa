import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { FormErrorState } from './form-errors';
import { useDismissibleErrors } from './use-dismissible-errors';

const NAME_ERROR: FormErrorState = { errorMessage: 'Informe o nome.', errorField: 'name' };
const CITY_ERROR: FormErrorState = { errorMessage: 'Informe a cidade.', errorField: 'city' };

describe('useDismissibleErrors', () => {
  it('shows the error of the field the api complained about', () => {
    const { result } = renderHook(() => useDismissibleErrors(NAME_ERROR));

    expect(result.current.errorFor('name')).toBe('Informe o nome.');
    expect(result.current.errorFor('city')).toBeNull();
  });

  it('hides the error as soon as the person starts correcting that field', () => {
    const { result } = renderHook(() => useDismissibleErrors(NAME_ERROR));

    act(() => {
      result.current.dismiss('name');
    });

    expect(result.current.errorFor('name')).toBeNull();
  });

  it('brings the error back when a new submission fails again', () => {
    const { result, rerender } = renderHook(({ state }) => useDismissibleErrors(state), {
      initialProps: { state: NAME_ERROR },
    });
    act(() => {
      result.current.dismiss('name');
    });

    rerender({ state: { ...NAME_ERROR } });

    expect(result.current.errorFor('name')).toBe('Informe o nome.');
  });

  it('keeps the error of another field untouched', () => {
    const { result, rerender } = renderHook(({ state }) => useDismissibleErrors(state), {
      initialProps: { state: NAME_ERROR },
    });
    act(() => {
      result.current.dismiss('name');
    });

    rerender({ state: CITY_ERROR });

    expect(result.current.errorFor('city')).toBe('Informe a cidade.');
  });
});
