import type { PermissionOverride } from '../types';
import type { OverrideChoice } from './permission-origin';

export const OVERRIDE_FIELD_PREFIX = 'override:';

export interface OverrideOperation {
  permission: string;
  effect: PermissionOverride['effect'] | null;
}

const CHOICES: OverrideChoice[] = ['INHERIT', 'GRANTED', 'REVOKED'];

export function parseOverrideChoices(
  formData: FormData,
  permissionCodes: string[],
): Record<string, OverrideChoice> {
  return Object.fromEntries(
    permissionCodes.map((code) => {
      const value = formData.get(`${OVERRIDE_FIELD_PREFIX}${code}`);
      return [code, CHOICES.find((choice) => choice === value) ?? 'INHERIT'];
    }),
  );
}

export function diffOverrides(
  current: PermissionOverride[],
  choices: Record<string, OverrideChoice>,
): OverrideOperation[] {
  return Object.entries(choices).flatMap(([permission, choice]) => {
    const currentEffect = current.find((override) => override.permission === permission)?.effect;
    const wantedEffect = choice === 'INHERIT' ? undefined : choice;
    return currentEffect === wantedEffect ? [] : [{ permission, effect: wantedEffect ?? null }];
  });
}
