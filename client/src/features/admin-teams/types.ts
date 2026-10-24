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
