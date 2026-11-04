import type { FormErrorState } from '@/lib/forms/form-errors';

export interface LiveStream {
  id: string;
  title: string;
  videoId: string;
  previewKey: string | null;
  startsAt: string;
  active: boolean;
}

export interface LiveFormValues {
  title: string;
  url: string;
  date: string;
  time: string;
}

export interface LiveFormState extends FormErrorState {
  values: LiveFormValues;
}

export const EMPTY_LIVE_VALUES: LiveFormValues = { title: '', url: '', date: '', time: '' };

export const INITIAL_LIVE_STATE: LiveFormState = {
  errorMessage: null,
  errorField: null,
  values: EMPTY_LIVE_VALUES,
};
