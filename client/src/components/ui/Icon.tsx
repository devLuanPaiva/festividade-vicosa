import type { ReactElement } from 'react';

const ICON_PATHS = {
  home: 'M3 11.5 12 4l9 7.5M5 10v10h5v-6h4v6h5V10',
  trophy:
    'M8 4h8v5a4 4 0 0 1-8 0V4zM8 6H4v1a3 3 0 0 0 3 3M16 6h4v1a3 3 0 0 1-3 3M12 13v4M8 20h8M10 17h4',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  users:
    'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1M16 5.2a3 3 0 0 1 0 5.6M21 20v-1a5 5 0 0 0-3.5-4.8',
  menu: 'M4 6h16M4 12h16M4 18h16',
  panelLeft: 'M4 5h16v14H4zM9 5v14',
  logout: 'M10 4H5v16h5M15 8l4 4-4 4M19 12H9',
  plus: 'M12 5v14M5 12h14',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  moreVertical: 'M12 5h.01M12 12h.01M12 19h.01',
  table: 'M4 5h16v14H4zM4 10h16M4 15h16M10 5v14',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  close: 'M6 6l12 12M18 6 6 18',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  eyeOff:
    'M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9M6.6 6.7A16.6 16.6 0 0 0 2 12s4 7 10 7a9.7 9.7 0 0 0 4-.9',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  download: 'M12 4v11M7.5 10.5 12 15l4.5-4.5M4 15v5h16v-5',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9.5h.01',
  ball: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8l3.5 2.5-1.3 4h-4.4l-1.3-4zM12 3v5M15.5 10.5 20 9M14.2 14.5l2.6 3.5M9.8 14.5 7.2 18M8.5 10.5 4 9',
} as const;

export type IconName = keyof typeof ICON_PATHS;

interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className = 'size-5' }: IconProps): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}
