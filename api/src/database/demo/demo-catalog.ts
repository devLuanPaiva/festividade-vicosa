import type { DemoSport } from './demo-photos';

export interface TeamTemplate {
  name: string;
  city: string;
  abbreviation: string;
}

export const TEAM_TEMPLATES: TeamTemplate[] = [
  { name: 'Bairro Açude', city: 'Viçosa', abbreviation: 'ACU' },
  { name: 'Centro Esporte Clube', city: 'Viçosa', abbreviation: 'CEC' },
  { name: 'Alto da Boa Vista', city: 'Viçosa', abbreviation: 'ABV' },
  { name: 'Vila Nova', city: 'Viçosa', abbreviation: 'VNO' },
  { name: 'Sítio Lagoa', city: 'Viçosa', abbreviation: 'LAG' },
  { name: 'Cohab Unidos', city: 'Viçosa', abbreviation: 'COH' },
  { name: 'São José', city: 'Viçosa', abbreviation: 'SJO' },
  { name: 'Santa Luzia', city: 'Viçosa', abbreviation: 'SLZ' },
  { name: 'Portalegre Atlético', city: 'Portalegre', abbreviation: 'PAT' },
  { name: 'Martins Esporte', city: 'Martins', abbreviation: 'MAR' },
  { name: 'Riacho Sport', city: 'Riacho da Cruz', abbreviation: 'RIA' },
  { name: 'Francisco Dantas EC', city: 'Francisco Dantas', abbreviation: 'FDA' },
  { name: 'Alexandria United', city: 'Alexandria', abbreviation: 'ALX' },
  { name: 'Marcelino Vieira FC', city: 'Marcelino Vieira', abbreviation: 'MVI' },
  { name: 'Lucrécia Sport', city: 'Lucrécia', abbreviation: 'LUC' },
  { name: 'Pau dos Ferros Jovem', city: 'Pau dos Ferros', abbreviation: 'PDF' },
  { name: 'Serra do Mel', city: 'Viçosa', abbreviation: 'SMEL' },
  { name: 'Estrela da Serra', city: 'Portalegre', abbreviation: 'EST' },
  { name: 'Unidos do Rosário', city: 'Viçosa', abbreviation: 'ROS' },
  { name: 'Flamengo da Praça', city: 'Viçosa', abbreviation: 'FLP' },
];

export const FEMALE_FIRST_NAMES = [
  'Ana',
  'Beatriz',
  'Camila',
  'Daniela',
  'Eduarda',
  'Fernanda',
  'Gabriela',
  'Helena',
  'Isabela',
  'Jéssica',
  'Kauane',
  'Larissa',
  'Mariana',
  'Natália',
  'Raquel',
  'Sabrina',
  'Thaís',
  'Vitória',
];

export const MALE_FIRST_NAMES = [
  'Alan',
  'Bruno',
  'Caio',
  'Davi',
  'Eduardo',
  'Felipe',
  'Gustavo',
  'Henrique',
  'Igor',
  'João',
  'Kléber',
  'Lucas',
  'Matheus',
  'Nathan',
  'Otávio',
  'Pedro',
  'Rafael',
  'Thiago',
  'Wesley',
];

export const SURNAMES = [
  'Alves',
  'Barbosa',
  'Cavalcante',
  'Dantas',
  'Fernandes',
  'Gomes',
  'Lima',
  'Medeiros',
  'Nobre',
  'Oliveira',
  'Pereira',
  'Queiroz',
  'Rodrigues',
  'Silva',
  'Souza',
  'Torres',
  'Vieira',
  'Xavier',
];

export const VENUES: Record<DemoSport, string[]> = {
  HANDBALL: ['Ginásio Municipal', 'Quadra da Escola Municipal', 'Quadra do Centro Esportivo'],
  FUTSAL: ['Ginásio Municipal', 'Quadra do Centro Esportivo'],
};

export function buildAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(seed)}&size=256&backgroundColor=b6e3f4`;
}
