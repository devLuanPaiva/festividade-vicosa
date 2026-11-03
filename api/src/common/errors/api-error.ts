export interface ApiErrorDetails {
  code: string;
  detail: string;
  field?: string;
}

export function apiError(code: string, detail: string, field?: string): ApiErrorDetails {
  return field === undefined ? { code, detail } : { code, detail, field };
}
