export interface NavigationItem {
  label: string;
  href: string;
}

export const publicNavigation: NavigationItem[] = [
  { label: 'Início', href: '/' },
  { label: 'Trajetória', href: '/#trajetoria' },
  { label: 'JOCEV’S', href: '/#jocevs' },
  { label: 'Jogos', href: '/#jogos' },
  { label: 'Programação', href: '/#programacao' },
];
