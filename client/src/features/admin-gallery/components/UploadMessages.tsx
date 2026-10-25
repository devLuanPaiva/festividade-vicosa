import type { ReactElement } from 'react';

interface UploadMessagesProps {
  notices: string[];
  sentCount: number | null;
}

function sentMessage(count: number): string {
  return count === 1 ? '1 foto enviada para o álbum.' : `${count} fotos enviadas para o álbum.`;
}

export function UploadMessages({ notices, sentCount }: UploadMessagesProps): ReactElement {
  return (
    <>
      {notices.length > 0 ? (
        <ul
          role="alert"
          className="flex flex-col gap-1 rounded-xl bg-danger/10 p-3 text-sm text-danger"
        >
          {notices.map((notice) => (
            <li key={notice}>{notice}</li>
          ))}
        </ul>
      ) : null}
      {sentCount ? (
        <p
          role="status"
          className="rounded-xl bg-success/10 p-3 text-sm font-semibold text-success"
        >
          {sentMessage(sentCount)}
        </p>
      ) : null}
    </>
  );
}
