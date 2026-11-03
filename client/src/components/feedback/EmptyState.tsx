import type { ReactElement, ReactNode } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';

export type EmptyStateTone = 'public' | 'dark' | 'admin';

interface ToneStyle {
  container: string;
  icon: string;
  title: string;
  description: string;
}

const TONE_STYLES: Record<EmptyStateTone, ToneStyle> = {
  public: {
    container: 'rounded-3xl bg-white p-8 shadow-[0_10px_30px_rgba(7,59,134,0.1)] md:p-12',
    icon: 'bg-sun text-brand-900',
    title: 'font-display text-3xl text-brand-900 md:text-4xl',
    description: 'text-ink-soft',
  },
  dark: {
    container: 'rounded-3xl bg-white/10 p-8 text-white md:p-12',
    icon: 'bg-sun text-brand-900',
    title: 'font-display text-3xl md:text-4xl',
    description: 'text-white/80',
  },
  admin: {
    container: 'rounded-2xl border border-dashed border-admin-line bg-admin-surface p-6 md:p-8',
    icon: 'bg-brand-500/10 text-brand-600',
    title: 'text-lg font-bold',
    description: 'text-sm text-admin-muted',
  },
};

interface EmptyStateProps {
  icon: IconName;
  title: string;
  description: string;
  tone?: EmptyStateTone;
  children?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  tone = 'public',
  children,
}: EmptyStateProps): ReactElement {
  const style = TONE_STYLES[tone];
  return (
    <section
      aria-label={title}
      className={`mx-auto flex w-full max-w-2xl flex-col items-center gap-3 text-center ${style.container}`}
    >
      <span
        className={`inline-flex size-14 items-center justify-center rounded-full ${style.icon}`}
      >
        <Icon name={icon} className="size-7" />
      </span>
      <h2 className={style.title}>{title}</h2>
      <p className={`max-w-md ${style.description}`}>{description}</p>
      {children ? <div className="mt-2 flex flex-wrap justify-center gap-3">{children}</div> : null}
    </section>
  );
}
