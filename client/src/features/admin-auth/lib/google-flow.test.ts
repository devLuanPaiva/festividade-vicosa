import { describe, expect, it } from 'vitest';
import { createGoogleFlow, parseGoogleFlow } from './google-flow';

describe('google flow', () => {
  it('uses a different secret for state, nonce and code verifier', () => {
    const { state, nonce, verifier } = createGoogleFlow();

    expect(new Set([state, nonce, verifier]).size).toBe(3);
  });

  it('restores the flow saved in the cookie', () => {
    const flow = createGoogleFlow();

    expect(parseGoogleFlow(JSON.stringify(flow))).toEqual(flow);
  });

  it.each([
    ['no cookie', undefined],
    ['text that is not json', 'not-json'],
    ['a flow missing a field', JSON.stringify({ state: 's', nonce: 'n' })],
    ['a flow with an empty field', JSON.stringify({ state: 's', nonce: '', verifier: 'v' })],
    ['a flow with fields of another type', JSON.stringify({ state: 1, nonce: 2, verifier: 3 })],
  ])('treats %s as no pending login', (_name, serialized) => {
    expect(parseGoogleFlow(serialized)).toBeNull();
  });
});
