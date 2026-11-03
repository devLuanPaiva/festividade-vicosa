import { createRandomToken } from './google-oauth';

export interface GoogleFlow {
  state: string;
  nonce: string;
  verifier: string;
}

export function createGoogleFlow(): GoogleFlow {
  return { state: createRandomToken(), nonce: createRandomToken(), verifier: createRandomToken() };
}

export function parseGoogleFlow(serialized: string | undefined): GoogleFlow | null {
  if (!serialized) {
    return null;
  }
  try {
    const { state, nonce, verifier } = JSON.parse(serialized) as Partial<GoogleFlow>;
    const isComplete = [state, nonce, verifier].every(
      (value) => typeof value === 'string' && value !== '',
    );
    return isComplete ? ({ state, nonce, verifier } as GoogleFlow) : null;
  } catch {
    return null;
  }
}
