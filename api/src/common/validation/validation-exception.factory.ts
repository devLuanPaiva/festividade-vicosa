import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';
import { apiError } from '../errors/api-error';

interface ValidationFailure {
  field: string;
  detail: string;
}

const WHITELIST_CONSTRAINT = 'whitelistValidation';
const FALLBACK_DETAIL = 'Valor inválido.';

function describeConstraint(field: string, constraint: [string, string] | undefined): string {
  if (constraint?.[0] === WHITELIST_CONSTRAINT) {
    return `O campo "${field}" não é permitido.`;
  }
  return constraint?.[1] ?? FALLBACK_DETAIL;
}

function collectFailures(errors: ValidationError[], parentField = ''): ValidationFailure[] {
  return errors.flatMap((error) => {
    const field = parentField ? `${parentField}.${error.property}` : error.property;
    const [firstConstraint] = Object.entries(error.constraints ?? {});
    const own = firstConstraint
      ? [{ field, detail: describeConstraint(field, firstConstraint) }]
      : [];
    return [...own, ...collectFailures(error.children ?? [], field)];
  });
}

export function createValidationException(errors: ValidationError[]): BadRequestException {
  const [firstFailure] = collectFailures(errors);
  const { field, detail } = firstFailure ?? { field: undefined, detail: FALLBACK_DETAIL };
  return new BadRequestException(apiError('VALIDATION_ERROR', detail, field));
}
