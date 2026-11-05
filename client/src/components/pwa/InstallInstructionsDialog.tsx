import type { ReactElement, RefObject } from 'react';
import { INSTALL_INSTRUCTIONS, type InstallPlatform } from '@/lib/pwa/install-platform';

interface InstallInstructionsDialogProps {
  platform: InstallPlatform;
  dialogRef: RefObject<HTMLDialogElement | null>;
}

export function InstallInstructionsDialog({
  platform,
  dialogRef,
}: InstallInstructionsDialogProps): ReactElement {
  const { title, steps } = INSTALL_INSTRUCTIONS[platform];
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="install-instructions-title"
      className="m-auto w-[min(92vw,26rem)] rounded-2xl bg-white p-6 text-admin-ink shadow-2xl backdrop:bg-black/60"
    >
      <h2 id="install-instructions-title" className="text-lg font-bold">
        {title}
      </h2>
      <ol className="mt-4 flex list-decimal flex-col gap-2 pl-5 text-sm">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <form method="dialog" className="mt-6 flex justify-end">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-xl bg-brand-600 px-6 font-semibold text-white hover:bg-brand-700"
        >
          Entendi
        </button>
      </form>
    </dialog>
  );
}
