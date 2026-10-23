export interface Stat {
  value: number;
  label: string;
}

export interface Modality {
  name: string;
  dates: string;
  detail: string;
}

export const marqueeTopItems = [
  'FUTSAL',
  'HANDEBOL',
  'VÔLEI DE AREIA',
  'FESTIVAL CULTURAL',
  'CORRIDA',
  'ECOPEDAL',
  'FESTA',
];

export const marqueeBottomItems = [
  '25 ANOS DE EMOÇÕES',
  'VIÇOSA 63 ANOS',
  'DEZEMBRO TEM FESTA',
  'JOCEV’S 2026',
];

export const stats: Stat[] = [
  { value: 25, label: 'anos de jornada' },
  { value: 25, label: 'dias de festividade, de 4 a 28 de dezembro' },
  { value: 7, label: 'eventos no calendário' },
  { value: 11, label: 'categorias em disputa' },
];

export const modalities: Modality[] = [
  { name: 'Handebol', dates: '4 a 6 de dezembro', detail: '7 categorias' },
  { name: 'Festival Cultural', dates: '8 de dezembro', detail: 'Música, dança e artes' },
  { name: 'Futsal', dates: '9 a 19 de dezembro', detail: '4 categorias' },
  { name: 'Vôlei de Areia', dates: '13 de dezembro', detail: 'Um dia de disputa' },
];
