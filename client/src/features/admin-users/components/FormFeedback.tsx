import type { ReactElement } from 'react';

interface FormFeedbackProps {
  errorMessage: string | null;
  isSaved: boolean;
}

export function FormFeedback({ errorMessage, isSaved }: FormFeedbackProps): ReactElement | null {
  if (errorMessage) {
    return (
      <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm font-semibold text-danger">
        {errorMessage}
      </p>
    );
  }
  if (isSaved) {
    return (
      <p role="status" className="rounded-xl bg-success/10 p-4 text-sm font-semibold text-success">
        Alterações salvas.
      </p>
    );
  }
  return null;
}
