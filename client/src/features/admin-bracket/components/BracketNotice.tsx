import Link from 'next/link';
import type { ReactElement } from 'react';

interface BracketNoticeProps {
  title: string;
  text: string;
  href: string;
  linkLabel: string;
}

export function BracketNotice({ title, text, href, linkLabel }: BracketNoticeProps): ReactElement {
  return (
    <section
      aria-labelledby="bracket-notice-title"
      className="flex flex-col items-start gap-2 rounded-2xl border border-admin-line bg-admin-surface p-5"
    >
      <h2 id="bracket-notice-title" className="font-bold">
        {title}
      </h2>
      <p className="text-sm text-admin-muted">{text}</p>
      <Link
        href={href}
        className="inline-flex min-h-12 items-center rounded-xl border border-admin-line bg-admin-canvas px-6 font-semibold hover:border-brand-500"
      >
        {linkLabel}
      </Link>
    </section>
  );
}
