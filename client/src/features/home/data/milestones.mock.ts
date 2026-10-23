export interface Milestone {
  year: number;
  title: string;
  description: string;
}

export const milestones: Milestone[] = [
  {
    year: 2001,
    title: 'A primeira jornada',
    description:
      'A JOCEV nasce como um torneio entre bairros e comunidades e reúne a cidade pela primeira vez em torno do esporte.',
  },
  {
    year: 2006,
    title: 'Da quadra para o palco',
    description:
      'O festival cultural entra no calendário e a jornada passa a celebrar música, dança e artes junto com os jogos.',
  },
  {
    year: 2011,
    title: 'Equipes de toda a região',
    description:
      'Times de cidades vizinhas passam a disputar o campeonato e a festividade ganha alcance regional.',
  },
  {
    year: 2016,
    title: 'Handebol e vôlei de areia',
    description:
      'Novas modalidades ampliam o público e as categorias femininas ganham o mesmo destaque das masculinas.',
  },
  {
    year: 2021,
    title: 'Resistência e retorno',
    description:
      'Depois do período de restrições, a jornada volta com protocolos e com a torcida de volta às arquibancadas.',
  },
  {
    year: 2026,
    title: '25 anos de emoções',
    description:
      'A edição de prata reúne todas as modalidades, o ecopedal, a corrida e a festa dos 63 anos de emancipação.',
  },
];
