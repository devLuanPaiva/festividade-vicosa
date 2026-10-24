'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactElement } from 'react';
import { isActiveSection, visibleSections } from '../lib/admin-sections';

interface AdminNavProps {
  permissions: string[];
}

export function AdminNav({ permissions }: AdminNavProps): ReactElement | null {
  const pathname = usePathname();
  const sections = visibleSections(permissions);
  if (sections.length < 2) {
    return null;
  }
  return (
    <nav aria-label="Seções do painel" className="flex gap-2">
      {sections.map((section) => {
        const isActive = isActiveSection(pathname, section);
        const tone = isActive
          ? 'bg-brand-600 text-white'
          : 'border border-admin-line bg-admin-surface hover:border-brand-500';
        return (
          <Link
            key={section.href}
            href={section.href}
            aria-current={isActive ? 'page' : undefined}
            className={`inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold transition-colors ${tone}`}
          >
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
}
