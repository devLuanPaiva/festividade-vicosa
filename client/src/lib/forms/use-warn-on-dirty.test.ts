import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useWarnOnDirty } from './use-warn-on-dirty';

function leavePage(): boolean {
  const event = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(event);
  return event.defaultPrevented;
}

describe('useWarnOnDirty', () => {
  it('asks for confirmation before leaving a form with unsaved changes', () => {
    renderHook(() => useWarnOnDirty(true));

    expect(leavePage()).toBe(true);
  });

  it('lets the person leave a form that was not changed', () => {
    renderHook(() => useWarnOnDirty(false));

    expect(leavePage()).toBe(false);
  });

  it('stops warning once the form is no longer dirty', () => {
    const { rerender } = renderHook(({ dirty }) => useWarnOnDirty(dirty), {
      initialProps: { dirty: true },
    });

    rerender({ dirty: false });

    expect(leavePage()).toBe(false);
  });
});
