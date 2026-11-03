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

export interface TeamFormValues {
  name: string;
  city: string;
  abbreviation: string;
  groupId: string;
}

export interface TeamFormState extends FormErrorState {
  values: TeamFormValues;
}

export const EMPTY_TEAM_VALUES: TeamFormValues = {
  name: '',
  city: '',
  abbreviation: '',
  groupId: '',
};

export const INITIAL_TEAM_STATE: TeamFormState = {
  errorMessage: null,
  errorField: null,
  values: EMPTY_TEAM_VALUES,
};

export interface TeamTarget {
  teamId: string;
  categoryId: string;
}
