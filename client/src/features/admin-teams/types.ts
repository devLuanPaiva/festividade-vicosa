import type { FormErrorState } from '@/lib/forms/form-errors';

export interface MatchGroup {
  id: string;
  categoryId: string;
  name: string;
}

export interface CategoryLink {
  id: string;
  label: string;
}

export interface ModalityCategories {
  modalityLabel: string;
  categories: CategoryLink[];
}

export interface GroupFormState extends FormErrorState {
  name: string;
}

export const INITIAL_GROUP_STATE: GroupFormState = {
  errorMessage: null,
  errorField: null,
  name: '',
};
