import { useActionState } from 'react';
import { INITIAL_FORM_ERROR_STATE, type FormErrorState } from '@/lib/forms/form-errors';
import { ImageResizeError, resizeForUpload } from '@/lib/images/resize-for-upload';

type UploadAction = (previous: FormErrorState, formData: FormData) => Promise<FormErrorState>;

const PHOTO_FIELD = 'file';

async function resizeChosenPhoto(formData: FormData): Promise<FormErrorState | null> {
  const file = formData.get(PHOTO_FIELD);
  if (!(file instanceof File) || file.size === 0) {
    return null;
  }
  try {
    formData.set(PHOTO_FIELD, await resizeForUpload(file));
    return null;
  } catch (error) {
    if (error instanceof ImageResizeError) {
      return { errorMessage: error.message, errorField: PHOTO_FIELD };
    }
    throw error;
  }
}

interface TeamPhotoUpload {
  state: FormErrorState;
  formAction: (formData: FormData) => void;
}

export function useTeamPhotoUpload(action: UploadAction): TeamPhotoUpload {
  const [state, formAction] = useActionState(
    async (previous: FormErrorState, formData: FormData) => {
      const resizeFailure = await resizeChosenPhoto(formData);
      return resizeFailure ?? action(previous, formData);
    },
    INITIAL_FORM_ERROR_STATE,
  );
  return { state, formAction };
}
