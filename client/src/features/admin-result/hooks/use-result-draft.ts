import { useState } from 'react';
import type { ResultDraft, ResultDraftChange } from '../types';

interface ResultDraftControls {
  draft: ResultDraft;
  changeField: ResultDraftChange;
}

export function useResultDraft(initialDraft: ResultDraft): ResultDraftControls {
  const [draft, setDraft] = useState(initialDraft);

  const changeField: ResultDraftChange = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  return { draft, changeField };
}
